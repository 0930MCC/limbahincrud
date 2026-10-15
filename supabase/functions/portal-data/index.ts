// supabase/functions/portal-data/index.ts
//
// GET /portal-data?tab=mou&token=<uuid>
// Response shape is IDENTICAL to the old Apps Script doGet(): a bare JSON
// array of row objects keyed by the original sheet headers (or {error}).
//
// Deploy: supabase functions deploy portal-data --no-verify-jwt
// (no-verify-jwt because auth is our own `token` session, not a Supabase JWT)

import { createClient } from "npm:@supabase/supabase-js@2";
import { CORS_HEADERS, json } from "../_shared/config.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type Session = { account_id: string; role: "client" | "office"; is_global: boolean };

function str(v: unknown) { return String(v ?? "").trim(); }
function splitIds(v: unknown) {
  return str(v).split(/[,;\n\r|]/).map((x) => x.trim()).filter(Boolean);
}

async function getSession(token: string | null): Promise<Session | null> {
  if (!token) return null;
  const { data } = await supabase.from("sessions").select("*").eq("token", token).maybeSingle();
  if (!data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) {
    await supabase.from("sessions").delete().eq("token", token); // lazy expiry cleanup
    return null;
  }
  return { account_id: data.account_id, role: data.role, is_global: data.is_global };
}

async function allRows(table: string) {
  const { data, error } = await supabase.from(table).select("id, data, *");
  if (error) throw error;
  return data ?? [];
}

// ----------------------------------------------------------------------------
// getWorkerMouIds — port of getWorkerMouIds_()
// ----------------------------------------------------------------------------
async function getWorkerMouIds(wid: string) {
  const { data: worker } = await supabase.from("workers").select("data").eq("id", wid).maybeSingle();
  const ids = new Set<string>();
  if (worker) {
    for (const col of ["Active MOU", "Expiring Soon MOU", "Expired MOU"]) {
      for (const x of splitIds(worker.data[col])) ids.add(x);
    }
  }
  return ids;
}

// ----------------------------------------------------------------------------
// scopedMous — port of scopedMous_() (v3.1 union fix preserved)
// ----------------------------------------------------------------------------
async function scopedMous(session: Session) {
  if (session.role === "client") {
    const uid = session.account_id.toLowerCase();
    const { data } = await supabase.from("mous").select("data").eq("user_id", uid);
    return (data ?? []).map((r) => r.data);
  }
  if (session.is_global) {
    const { data } = await supabase.from("mous").select("data");
    return (data ?? []).map((r) => r.data);
  }
  const wid = session.account_id.toLowerCase();
  const workerMouIds = await getWorkerMouIds(wid);
  const { data } = await supabase.from("mous").select("id, data");
  return (data ?? [])
    .filter((r) => workerMouIds.has(str(r.id)) || str(r.data["Marketing"]).toLowerCase().includes(wid))
    .map((r) => r.data);
}

async function scopedBranches(session: Session) {
  if (session.role === "client") {
    const uid = session.account_id.toLowerCase();
    const { data } = await supabase.from("branches").select("data").eq("owner_user_id", uid);
    return (data ?? []).map((r) => r.data);
  }
  const mous = await scopedMous(session);
  const branchIds = new Set(mous.map((m: any) => str(m["Branch ID"])));
  if (branchIds.size === 0) return [];
  const { data } = await supabase.from("branches").select("id, data").in("id", [...branchIds]);
  return (data ?? []).map((r) => r.data);
}

async function scopedPickups(session: Session) {
  if (session.role === "client") {
    const uid = session.account_id.toLowerCase();
    const { data } = await supabase.from("pickups").select("data")
      .eq("user_id", uid).eq("input_type", "F-OPR");
    return (data ?? []).map((r) => r.data);
  }
  const mous = await scopedMous(session);
  const mouIds = new Set(mous.map((m: any) => str(m["MOU ID"])));
  if (mouIds.size === 0) return [];
  const { data } = await supabase.from("pickups").select("mou_id, data")
    .eq("input_type", "F-OPR").in("mou_id", [...mouIds]);
  return (data ?? []).map((r) => r.data);
}

async function scopedInvoices(session: Session) {
  if (session.role === "client") {
    const uid = session.account_id.toLowerCase();
    const { data } = await supabase.from("invoices").select("data").eq("user_id", uid);
    return (data ?? []).map((r) => r.data)
      .filter((r: any) => str(r["Invoice File Link"]) !== "" && str(r["JENIS INVOICE"]).toLowerCase() !== "cancel");
  }
  if (session.is_global) {
    const { data } = await supabase.from("invoices").select("data").neq("inv_type", "cancel");
    return (data ?? []).map((r) => r.data);
  }
  const uid = session.account_id.toLowerCase();
  const { data } = await supabase.from("invoices").select("data")
    .ilike("marketing", `%${uid}%`).neq("inv_type", "cancel");
  return (data ?? []).map((r) => r.data);
}

async function scopedBeritaAcara(session: Session) {
  if (session.role !== "client") return [];
  const uid = session.account_id.toLowerCase();
  const { data } = await supabase.from("ba").select("data").eq("owner_id", uid);
  return (data ?? []).map((r) => r.data);
}

async function scopedPerizinan(session: Session) {
  if (session.role !== "client") return [];
  const uid = session.account_id.toLowerCase();
  const { data } = await supabase.from("perizinan").select("data").ilike("user_id", `%${uid}%`);
  return (data ?? []).map((r) => r.data);
}

async function scopedDokumentasi(session: Session) {
  if (session.role !== "client") return [];
  const uid = session.account_id.toLowerCase();
  const { data } = await supabase.from("dokumentasi").select("data").eq("owner_id", uid);
  return (data ?? []).map((r) => r.data);
}

async function scopedSudahKomisi(session: Session) {
  if (session.role !== "office") return [];
  if (session.is_global) {
    const { data } = await supabase.from("sudah_komisi").select("data");
    return (data ?? []).map((r) => r.data);
  }
  const wid = session.account_id.toLowerCase();
  const { data } = await supabase.from("sudah_komisi").select("data").ilike("marketing", `%${wid}%`);
  return (data ?? []).map((r) => r.data);
}

async function scopedBelumKomisi(session: Session) {
  if (session.role !== "office") return [];
  if (session.is_global) {
    const { data } = await supabase.from("belum_komisi").select("data");
    return (data ?? []).map((r) => r.data);
  }
  const wid = session.account_id.toLowerCase();
  const { data } = await supabase.from("belum_komisi").select("data").ilike("marketing", `%${wid}%`);
  return (data ?? []).map((r) => r.data);
}

async function scopedOwnProfile(tab: "user" | "worker", session: Session) {
  const expectedRole = tab === "worker" ? "office" : "client";
  if (session.role !== expectedRole) return [];
  if (session.is_global && tab === "worker") {
    return [{ "Worker ID": session.account_id, "Nama": "Admin", "Jabatan": "Office (Global)", "Email": "" }];
  }
  const table = tab === "worker" ? "workers" : "users";
  const passwordHeader = tab === "worker" ? "Worker Password" : "User Password";
  const { data } = await supabase.from(table).select("data").eq("id", session.account_id);
  return (data ?? []).map((r) => { const o = { ...r.data }; delete o[passwordHeader]; return o; });
}

// ----------------------------------------------------------------------------
// HTTP entry — port of doGet()
// ----------------------------------------------------------------------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });

  const url = new URL(req.url);
  const tab = url.searchParams.get("tab") || "";
  const token = url.searchParams.get("token");

  const session = await getSession(token);
  if (!session) return json({ error: "Unauthorized. Please log in." });

  try {
    switch (tab) {
      case "branch": return json(await scopedBranches(session));
      case "mou": return json(await scopedMous(session));
      case "data": return json(await scopedPickups(session));
      case "invoice": return json(await scopedInvoices(session));
      case "ba": return json(await scopedBeritaAcara(session));
      case "perizinan": return json(await scopedPerizinan(session));
      case "dokumentasi": return json(await scopedDokumentasi(session));
      case "c1sudahtrf": return json(await scopedSudahKomisi(session));
      case "c1belumtrf": return json(await scopedBelumKomisi(session));
      case "user": return json(await scopedOwnProfile("user", session));
      case "worker": return json(await scopedOwnProfile("worker", session));
      default: return json({ error: "Invalid tab" });
    }
  } catch (e) {
    console.error(e);
    return json({ error: "Server error" }, 500);
  }
});
