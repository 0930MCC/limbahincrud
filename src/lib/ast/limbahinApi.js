// Frontend API client for the LIMBAHIN Supabase edge functions.
// The edge functions run server-side and hold the Supabase service role key
// and the Apps Script secret — they are never exposed to the browser.

const EDGE_BASE = "https://cnpdazqpxnkdqdolqueo.functions.supabase.co";

async function call(fn, body) {
  const res = await fetch(`${EDGE_BASE}/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const limbahinApi = {
  login: (workerId, password) => call("limbahin-login", { workerId, password }),
  listRecords: (workerId) => call("limbahin-list-records", { workerId }),
  saveRecord: (payload) => call("limbahin-save-record", payload),
  // Needs workerId too, not just id — the edge function's delete query is
  // `.eq("id", id).ilike("worker_id", workerId)`, so without workerId it was always matching
  // zero rows (silently "succeeding" at deleting nothing).
  deleteRecord: (workerId, id) => call("limbahin-delete-record", { workerId, id }),

  // AssetRecord2 — separate table (asset_records2), sheet tab and edge functions.
  listRecords2: (workerId) => call("limbahin-list-records2", { workerId }),
  saveRecord2: (payload) => call("limbahin-save-record2", payload),
  deleteRecord2: (workerId, id) => call("limbahin-delete-record2", { workerId, id }),
};
