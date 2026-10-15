// supabase/functions/sync/index.ts
//
// Called only by Apps Script (never the browser). Shapes:
//
//   Incremental (from the onEdit trigger, one changed row):
//     POST { mode: "row", table: "mou", row: { "MOU ID": "...", ... } }
//
//   Full resync, chunked — for larger tabs, send rows in batches of a few
//   hundred (no delete happens on these calls, just upsert):
//     POST { mode: "full_upsert_chunk", table: "mou", rows: [ {...}, ... ] }
//   ...then ONE final call with just the ids seen across every chunk, which
//   deletes any Supabase row whose id is NOT in that set (keeps Supabase
//   from drifting when a row gets deleted in the sheet, edited by another
//   script, or missed because a trigger errored):
//     POST { mode: "full_prune", table: "mou", ids: [ "id1", "id2", ... ] }
//
//   Full resync, single-shot — fine for small tabs, sends everything in one
//   request (upsert + delete together):
//     POST { mode: "full", table: "mou", rows: [ {...}, {...} ] }
//
//   Settings (mirrors 0.Setting!B1/B2):
//     POST { mode: "settings", universal_password: "...", global_worker_username: "..." }
//
// Auth: header `x-sync-secret` must match the SYNC_SECRET env var (set via
// `supabase secrets set SYNC_SECRET=...`). This is NOT the service role key —
// Apps Script should never hold that.
//
// Deploy: supabase functions deploy sync --no-verify-jwt

import { createClient } from "npm:@supabase/supabase-js@2";
import { CORS_HEADERS, json, TABLE_CONFIG, TableKey } from "../_shared/config.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const SYNC_SECRET = Deno.env.get("SYNC_SECRET")!;

function str(v: unknown) { return String(v ?? "").trim(); }

async function upsertRow(tableKey: TableKey, row: Record<string, unknown>) {
  const conf = TABLE_CONFIG[tableKey];
  const id = str(row[conf.idHeader]);
  if (!id) throw new Error(`Row missing id column "${conf.idHeader}" for table "${tableKey}"`);
  const { error } = await supabase.from(conf.table)
    .upsert({ id, data: row, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw error;
  return id;
}

// Upserts one chunk of rows. No deletion here — safe to call repeatedly with
// different slices of a tab without wiping anything.
async function upsertChunk(tableKey: TableKey, rows: Record<string, unknown>[]) {
  const conf = TABLE_CONFIG[tableKey];
  const ids: string[] = [];
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500).map((row) => {
      const id = str(row[conf.idHeader]);
      if (id) ids.push(id);
      return { id, data: row, updated_at: new Date().toISOString() };
    }).filter((r) => r.id);
    if (batch.length) {
      const { error } = await supabase.from(conf.table).upsert(batch, { onConflict: "id" });
      if (error) throw error;
    }
  }
  return { upserted: ids.length };
}

// Deletes any row in the table whose id is NOT in the given complete set.
// Call this once, after every chunk for that tab has been upserted.
async function pruneToIds(tableKey: TableKey, ids: string[]) {
  const conf = TABLE_CONFIG[tableKey];
  const clean = ids.map(str).filter(Boolean);
  if (clean.length === 0) return { deleted: 0 }; // refuse to wipe a table on an empty id list
  const { error, count } = await supabase.from(conf.table)
    .delete({ count: "exact" })
    .not("id", "in", `(${clean.map((i) => `"${i.replace(/"/g, '""')}"`).join(",")})`);
  if (error) throw error;
  return { deleted: count ?? 0 };
}

async function fullResync(tableKey: TableKey, rows: Record<string, unknown>[]) {
  const { upserted } = await upsertChunk(tableKey, rows);
  const ids = rows.map((r) => str(r[TABLE_CONFIG[tableKey].idHeader])).filter(Boolean);
  const { deleted } = await pruneToIds(tableKey, ids);
  return { upserted, deleted };
}

async function syncSettings(body: any) {
  const entries: [string, string][] = [];
  if (body.universal_password !== undefined) entries.push(["universal_password", str(body.universal_password)]);
  if (body.global_worker_username !== undefined) entries.push(["global_worker_username", str(body.global_worker_username)]);
  for (const [key, value] of entries) {
    const { error } = await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
  return { updated: entries.map(([k]) => k) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });

  if (req.headers.get("x-sync-secret") !== SYNC_SECRET) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  try {
    if (body.mode === "settings") {
      return json({ success: true, ...(await syncSettings(body)) });
    }

    const tableKey = body.table as TableKey;
    if (!TABLE_CONFIG[tableKey]) return json({ error: "Unknown table: " + body.table }, 400);

    if (body.mode === "row") {
      const id = await upsertRow(tableKey, body.row || {});
      return json({ success: true, id });
    }

    if (body.mode === "full_upsert_chunk") {
      const result = await upsertChunk(tableKey, body.rows || []);
      return json({ success: true, ...result });
    }

    if (body.mode === "full_prune") {
      const result = await pruneToIds(tableKey, body.ids || []);
      return json({ success: true, ...result });
    }

    if (body.mode === "full") {
      const result = await fullResync(tableKey, body.rows || []);
      return json({ success: true, ...result });
    }

    return json({ error: "Unknown mode: " + body.mode }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
