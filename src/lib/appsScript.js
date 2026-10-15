// Client for the Google Apps Script web app that backs the `custform` model. The server side is
// google-apps-script/Code.gs (v3) and the table is supabase/schema-custform.sql.
//
// ONE row per form, keyed by `custform_id` (6 uppercase letters, handed out by the first save).
// The row is the single source of truth: every call below answers with the full, freshly saved
// row (`row`, snake_case columns) and the page rebuilds its whole state from it via
// lib/custform.js#mapRowToState.
//
//   saveDataDasar()     step 1 "Simpan Data"        -> creates the row (new id) / updates it
//   savePelayanan()     step 2 "Simpan Data"        -> referral + rincian_pelayanan + quotation PDF
//   saveRegistration()  step 3 "Simpan Data"        -> registration fields + contract documents
//   sendQuotation()     "Kirim Penawaran" button    -> emails the SAVED quotation PDF
//   sendContract()      "Kirim Draf Kontrak" button -> emails the SAVED contract PDFs
//
// Add to your `.env` / `.env.local`:
//   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXX/exec
//
// NOTE ON CORS: sent with `Content-Type: text/plain;charset=utf-8` (not `application/json`) so
// the request stays a CORS "simple request" (no preflight) — Apps Script web apps don't reliably
// support custom preflight response headers. Code.gs still parses `e.postData.contents` as JSON.
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

async function callAppsScript(action, payload) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('VITE_APPS_SCRIPT_URL belum diisi — hubungkan dulu ke Apps Script web app.');
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Respons Apps Script tidak valid (status ${res.status}).`);
  }
  if (!res.ok || json?.error) {
    throw new Error(json?.error || `Gagal menghubungi Apps Script (status ${res.status}).`);
  }
  if (!json?.data?.row) {
    throw new Error('Respons server tidak lengkap (tidak ada data formulir). Coba lagi.');
  }
  return json.data;
}

// Step 1. `custformId` empty => this call creates the row and returns the new id.
// `configName` / `rate` are only used when the row is created.
// -> { id, row, created }
export function saveDataDasar({ custformId, configName, rate, dataDasar }) {
  return callAppsScript('saveDataDasar', { custformId, configName, rate, dataDasar });
}

// Step 2. `rincianPelayanan` is lib/pricing.js#buildPricelistSummaryText(quote); `pdfBase64` +
// `filename` are the quotation PDF built in the browser (lib/pdf.js), which the server files in
// Drive. Replaces any earlier quotation and deletes contract documents made from the old one.
// -> { id, row }
export function savePelayanan({ custformId, referralCode, rincianPelayanan, pdfBase64, filename }) {
  return callAppsScript('savePelayanan', { custformId, referralCode, rincianPelayanan, pdfBase64, filename });
}

// Step 3. `dataDasar` rides along because name / email / phone are editable from this step too
// (the phone is the same field as Data Dasar's). Generates the contract documents server-side.
// -> { id, row, failures: [{ docType, error }] }
export function saveRegistration({ custformId, dataDasar, registration }) {
  return callAppsScript('saveRegistration', { custformId, dataDasar, registration });
}

// Email buttons under the document cards. Only the id travels — the server sends the files it
// already saved. `emailTo` (optional) is the "Kirim ke email lain" override.
// -> { id, row, sentTo }
export function sendQuotation({ custformId, emailTo }) {
  return callAppsScript('sendQuotation', { custformId, emailTo });
}

export function sendContract({ custformId, emailTo }) {
  return callAppsScript('sendContract', { custformId, emailTo });
}

// Best-effort lookup for CustForm.jsx's `?id=` prefill. Returns `null` if nothing is found or the
// request fails, so a bad/unknown id degrades to a blank form instead of blocking the page.
export async function fetchCustform(id) {
  if (!APPS_SCRIPT_URL || !id) return null;
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?id=${encodeURIComponent(id)}`);
    const json = await res.json();
    if (!res.ok || json?.error || !json?.data) return null;
    return json.data; // the raw custform row (snake_case columns) or null
  } catch {
    return null;
  }
}
