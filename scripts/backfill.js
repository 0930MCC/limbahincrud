/**
 * scripts/backfill.js
 * -----------------------------------------------------------------------
 * One-time bulk load: Google Sheets -> Supabase, so Supabase isn't empty
 * on day one. Safe to re-run (it's just a big upsert) — e.g. run it once
 * to backfill, then again right before cutover to catch anything edited
 * in between.
 *
 * Mirrors exactly where your Apps Script already reads each tab from:
 *  - "user" / "worker" (login + password data) come from USER_SHEET_ID,
 *    the same source login_() reads from.
 *  - every other tab comes from the portal sheet `d`, the same source
 *    readPortalTab_() reads from — so what lands in Supabase matches
 *    exactly what the portal currently displays.
 *
 * Setup:
 *   1. npm install googleapis @supabase/supabase-js dotenv
 *   2. Create a Google Cloud service account, enable the Sheets API,
 *      download its JSON key as ./service-account.json, and share BOTH
 *      spreadsheets (USER_SHEET_ID and the portal sheet `d`) with the
 *      service account's email (Viewer is enough).
 *   3. Create a .env file next to this script:
 *        SUPABASE_URL=https://xxxx.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...           (Project Settings -> API)
 *        GOOGLE_SERVICE_ACCOUNT_FILE=./service-account.json
 *   4. node backfill.js
 */

require("dotenv").config();
const { google } = require("googleapis");
const { createClient } = require("@supabase/supabase-js");

const USER_SHEET_ID = "1e955Lkrjph2yFT8Prrkhpur0AVU1lzRna54cWCbTFeU"; // source (login + passwords)
const PORTAL_SHEET_ID = "1lxYb6N6UUHcT1GLSgk8bmcWgJitnhZM3NBkdKEIbpCA"; // portal mirror (matches `d` in Code.gs)

// Mirrors TABS in Code.gs: sheetName, which spreadsheet it's read from, the
// header row's zero-based index, and the destination Supabase table + id
// header. Keep this in sync with functions/_shared/config.ts.
const TABS = [
  { key: "user",        sheetName: "1.User",         source: "user",   headerRow: 0, table: "users",        idHeader: "User ID" },
  { key: "worker",      sheetName: "2.Worker",       source: "user",   headerRow: 0, table: "workers",      idHeader: "Worker ID" },
  { key: "branch",      sheetName: "3.Branch",       source: "portal", headerRow: 2, table: "branches",     idHeader: "Branch ID" },
  { key: "mou",         sheetName: "4.MOU",          source: "portal", headerRow: 0, table: "mous",         idHeader: "MOU ID" },
  { key: "data",        sheetName: "5.Data",         source: "portal", headerRow: 0, table: "pickups",      idHeader: "ID DATA" },
  { key: "invoice",     sheetName: "6.Invoice",      source: "portal", headerRow: 0, table: "invoices",     idHeader: "INVOICE ID" },
  { key: "ba",          sheetName: "7.BA",           source: "portal", headerRow: 0, table: "ba",           idHeader: "BA ID" },
  { key: "c1sudahtrf",  sheetName: "8.SudahKomisi",  source: "portal", headerRow: 0, table: "sudah_komisi", idHeader: "INVOICE ID" },
  { key: "c1belumtrf",  sheetName: "9.BelumKomisi",  source: "portal", headerRow: 0, table: "belum_komisi", idHeader: "Invoice ID" },
  { key: "perizinan",   sheetName: "10.Perizinan",   source: "portal", headerRow: 0, table: "perizinan",    idHeader: "Nomor File" },
  { key: "dokumentasi", sheetName: "11.Dokumentasi", source: "portal", headerRow: 0, table: "dokumentasi",  idHeader: "ID Dokumentasi" },
];

// ----------------------------------------------------------------------------
// Same normalizeHeaders_() logic as Code.gs — dedupe repeated headers.
// ----------------------------------------------------------------------------
function normalizeHeaders(header) {
  const keys = [];
  const used = {};
  header.forEach((h) => {
    let hStr = String(h ?? "").trim();
    if (hStr.startsWith("Jumlah:")) hStr = "Jumlah";
    if (hStr.startsWith("Tanggal Muat")) hStr = "Tanggal Muat";
    if (used[hStr]) { keys.push(hStr + "__" + used[hStr]++); }
    else { used[hStr] = 1; keys.push(hStr); }
  });
  return keys;
}

function rowToObject(keys, row) {
  const o = {};
  keys.forEach((k, i) => {
    const val = row[i];
    o[k] = val === undefined || val === null ? "" : val;
  });
  return o;
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_FILE || "./service-account.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  for (const tab of TABS) {
    const spreadsheetId = tab.source === "user" ? USER_SHEET_ID : PORTAL_SHEET_ID;
    console.log(`Reading ${tab.sheetName} from ${tab.source === "user" ? "USER_SHEET_ID" : "portal sheet"}...`);

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: tab.sheetName,
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
    });
    const data = res.data.values || [];
    if (data.length <= tab.headerRow) { console.log(`  (empty, skipping)`); continue; }

    const header = data[tab.headerRow];
    const keys = normalizeHeaders(header);
    const rawRows = data.slice(tab.headerRow + 1).filter((r) => r.some((v) => v !== "" && v !== undefined && v !== null));
    const objects = rawRows.map((r) => rowToObject(keys, r));

    const rowsWithId = objects.filter((o) => String(o[tab.idHeader] ?? "").trim() !== "");
    const skipped = objects.length - rowsWithId.length;
    if (skipped > 0) console.log(`  WARNING: ${skipped} row(s) skipped — missing "${tab.idHeader}"`);

    console.log(`  Upserting ${rowsWithId.length} rows into "${tab.table}"...`);
    for (let i = 0; i < rowsWithId.length; i += 500) {
      const batch = rowsWithId.slice(i, i + 500).map((o) => ({
        id: String(o[tab.idHeader]).trim(),
        data: o,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from(tab.table).upsert(batch, { onConflict: "id" });
      if (error) throw new Error(`${tab.table}: ${error.message}`);
    }
    console.log(`  Done: ${tab.table}`);
  }

  // Settings: 0.Setting!B1 (universal password) + B2 (global worker username),
  // read from the portal sheet (same source readUniversalPassword_() uses).
  console.log("Reading 0.Setting...");
  const settingRes = await sheets.spreadsheets.values.get({
    spreadsheetId: PORTAL_SHEET_ID,
    range: "0.Setting!B1:B2",
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  const [b1, b2] = (settingRes.data.values || []).map((r) => (r ? String(r[0] ?? "") : ""));
  const { error: settingsError } = await supabase.from("settings").upsert([
    { key: "universal_password", value: b1 || "", updated_at: new Date().toISOString() },
    { key: "global_worker_username", value: b2 || "", updated_at: new Date().toISOString() },
  ]);
  if (settingsError) throw new Error("settings: " + settingsError.message);
  console.log("Done: settings");

  console.log("\nBackfill complete.");
}

main().catch((err) => { console.error(err); process.exit(1); });
