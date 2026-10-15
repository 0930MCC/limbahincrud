// supabase/functions/auth/index.ts
//
// POST body: { action: "login", tab: "user"|"worker", identifier, password }
//         or { action: "recordLogin", tab, id, token }
//
// Deploy: supabase functions deploy auth --no-verify-jwt
// (no-verify-jwt because this endpoint IS the login — there's no JWT yet)

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  CORS_HEADERS, json, TABLE_CONFIG,
  SESSION_TTL_SECONDS, MAX_LOGIN_ATTEMPTS, LOGIN_ATTEMPT_WINDOW_SECONDS, LOGIN_LOCKOUT_SECONDS,
} from "../_shared/config.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const LAST_ACCESSED_HEADER = "Last Accessed";

function str(v: unknown) { return String(v ?? "").trim(); }

// ----------------------------------------------------------------------------
// Rate limiting (was CacheService loginfail_*, now the login_attempts table)
// ----------------------------------------------------------------------------
async function checkLoginLock(identifier: string) {
  const { data } = await supabase.from("login_attempts").select("*")
    .eq("identifier", identifier.toLowerCase()).maybeSingle();
  if (!data || !data.lock_until) return { locked: false, remainingSeconds: 0 };
  const lockUntil = new Date(data.lock_until).getTime();
  if (lockUntil > Date.now()) {
    return { locked: true, remainingSeconds: Math.ceil((lockUntil - Date.now()) / 1000) };
  }
  return { locked: false, remainingSeconds: 0 };
}

async function recordFailedLogin(identifier: string) {
  const id = identifier.toLowerCase();
  const { data } = await supabase.from("login_attempts").select("*").eq("identifier", id).maybeSingle();
  const now = Date.now();
  let count = data?.count ?? 0;
  let windowStart = data?.window_start ? new Date(data.window_start).getTime() : now;
  // window expired -> reset the counter
  if (now - windowStart > LOGIN_ATTEMPT_WINDOW_SECONDS * 1000) { count = 0; windowStart = now; }
  count += 1;
  const lockUntil = count >= MAX_LOGIN_ATTEMPTS ? new Date(now + LOGIN_LOCKOUT_SECONDS * 1000).toISOString() : null;
  await supabase.from("login_attempts").upsert({
    identifier: id, count, window_start: new Date(windowStart).toISOString(), lock_until: lockUntil,
  });
}

async function clearFailedLogins(identifier: string) {
  await supabase.from("login_attempts").delete().eq("identifier", identifier.toLowerCase());
}

// ----------------------------------------------------------------------------
// Sessions (was CacheService session_*, now the sessions table)
// ----------------------------------------------------------------------------
async function createSession(accountId: string, role: "client" | "office", isGlobal: boolean) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  const { data, error } = await supabase.from("sessions")
    .insert({ account_id: accountId, role, is_global: isGlobal, expires_at: expiresAt })
    .select("token").single();
  if (error) throw error;
  return data.token as string;
}

// ----------------------------------------------------------------------------
// Settings (was Setting!B1 / Setting!B2)
// ----------------------------------------------------------------------------
async function readSetting(key: string) {
  const { data } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

function buildGlobalWorkerProfile(username: string) {
  return { "Worker ID": username, "Nama": "Admin", "Jabatan": "Office (Global)", "Email": "" };
}

async function recordLogin(tab: "user" | "worker", id: string) {
  const conf = TABLE_CONFIG[tab];
  const { data: row } = await supabase.from(conf.table).select("data").eq("id", id).maybeSingle();
  if (!row) return;
  const now = new Date();
  const formatted = now.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  }).replace(",", "");
  const newData = { ...row.data, [LAST_ACCESSED_HEADER]: formatted };
  await supabase.from(conf.table).update({ data: newData, updated_at: now.toISOString() }).eq("id", id);
}

// ----------------------------------------------------------------------------
// login()
// ----------------------------------------------------------------------------
async function login(tab: "user" | "worker", identifier: string, password: string) {
  if (!identifier || !password) return json({ error: "Missing credentials" });

  const lock = await checkLoginLock(identifier);
  if (lock.locked) {
    return json({ error: "Too many failed login attempts. Please try again later.", locked: true, remainingSeconds: lock.remainingSeconds });
  }

  const idLower = identifier.toLowerCase();

  // Global/shared office login (Setting B2 username + B1 password), worker tab only.
  if (tab === "worker") {
    const [globalUsername, universalPassword] = await Promise.all([
      readSetting("global_worker_username"),
      readSetting("universal_password"),
    ]);
    if (globalUsername && universalPassword &&
        idLower === globalUsername.toLowerCase() && str(password) === universalPassword) {
      await clearFailedLogins(identifier);
      const token = await createSession(globalUsername, "office", true);
      return json({ success: true, token, role: "office", profile: buildGlobalWorkerProfile(globalUsername) });
    }
  }

  const conf = TABLE_CONFIG[tab];
  const passwordHeader = tab === "worker" ? "Worker Password" : "User Password";
  const emailHeader = "Email";

  const universalPassword = await readSetting("universal_password");
  const isUniversal = universalPassword !== "" && str(password) === universalPassword;

  // Match by id OR email — pull all rows and check in JS (tables are small;
  // swap for an .or() filter on generated columns if a tab grows large).
  const { data: rows, error } = await supabase.from(conf.table).select("id, data");
  if (error) return json({ error: "Database error" }, 500);

  const match = (rows ?? []).find((r) => {
    const rowId = str(r.data[conf.idHeader]).toLowerCase();
    const rowEmail = str(r.data[emailHeader]).toLowerCase();
    return rowId === idLower || rowEmail === idLower;
  });

  if (!match) {
    await recordFailedLogin(identifier);
    return json({ error: "Invalid credentials" });
  }

  const storedPw = str(match.data[passwordHeader]);
  if (!isUniversal && storedPw !== str(password)) {
    await recordFailedLogin(identifier);
    const nowLocked = await checkLoginLock(identifier);
    if (nowLocked.locked) {
      return json({ error: "Too many failed login attempts. Please try again later.", locked: true, remainingSeconds: nowLocked.remainingSeconds });
    }
    return json({ error: "Invalid credentials" });
  }

  await clearFailedLogins(identifier);
  const profile = { ...match.data };
  delete profile[passwordHeader];

  const canonicalId = str(match.data[conf.idHeader]);
  const role = tab === "worker" ? "office" : "client";
  const token = await createSession(canonicalId, role, false);
  await recordLogin(tab, canonicalId);

  return json({ success: true, token, role, profile });
}

// ----------------------------------------------------------------------------
// HTTP entry
// ----------------------------------------------------------------------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  const action = body?.action;

  if (action === "login") {
    const tab = body.tab === "worker" ? "worker" : "user";
    return await login(tab, str(body.identifier ?? body.id), str(body.password));
  }

  if (action === "recordLogin") {
    const token = body.token;
    const { data: session } = await supabase.from("sessions").select("*").eq("token", token).maybeSingle();
    if (!session || String(session.account_id).toLowerCase() !== str(body.id).toLowerCase()) {
      return json({ error: "Unauthorized" }, 401);
    }
    await recordLogin(body.tab === "worker" ? "worker" : "user", str(body.id));
    return json({ success: true });
  }

  return json({ error: "Unknown action: " + action }, 400);
});
