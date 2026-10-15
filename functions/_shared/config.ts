// Shared across all Edge Functions. Keep this in sync with:
//  - sql/schema.sql            (table names must match)
//  - appscript/sync.gs         (TABLE_ID_HEADER must match the sheet's id column)
//  - src/lib/sheets.js (COL)   (header strings must match exactly)

export type TableKey =
  | "user" | "worker" | "branch" | "mou" | "data" | "invoice"
  | "ba" | "c1sudahtrf" | "c1belumtrf" | "perizinan" | "dokumentasi";

// Maps the same short keys your Apps Script TABS object used to the actual
// Postgres table name and which header column is the natural/unique id.
export const TABLE_CONFIG: Record<TableKey, { table: string; idHeader: string }> = {
  user:        { table: "users",        idHeader: "User ID" },
  worker:      { table: "workers",      idHeader: "Worker ID" },
  branch:      { table: "branches",     idHeader: "Branch ID" },
  mou:         { table: "mous",         idHeader: "MOU ID" },
  data:        { table: "pickups",      idHeader: "ID DATA" },
  invoice:     { table: "invoices",     idHeader: "INVOICE ID" },
  ba:          { table: "ba",           idHeader: "BA ID" },
  c1sudahtrf:  { table: "sudah_komisi", idHeader: "INVOICE ID" },
  c1belumtrf:  { table: "belum_komisi", idHeader: "Invoice ID" },
  perizinan:   { table: "perizinan",    idHeader: "Nomor File" },
  dokumentasi: { table: "dokumentasi",  idHeader: "ID Dokumentasi" },
};

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // tighten to your domain once live
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-secret",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

export const SESSION_TTL_SECONDS = 6 * 60 * 60; // 6 hours, same as Apps Script
export const MAX_LOGIN_ATTEMPTS = 3;
export const LOGIN_ATTEMPT_WINDOW_SECONDS = 2 * 60;
export const LOGIN_LOCKOUT_SECONDS = 5 * 60;
