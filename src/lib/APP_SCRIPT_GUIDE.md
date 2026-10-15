/**
 * ============================================================================
 * SECURITY-HARDENED VERSION 2
 * ============================================================================
 * What changed vs. your original file, and why:
 *
 *  1. Removed the public `?tab=setting` endpoint (was leaking the universal
 *     login password to anyone, unauthenticated).
 *
 *  2. Login now happens entirely server-side (doPost action "login"). The
 *     frontend must stop downloading the raw user/worker tab and comparing
 *     passwords in JavaScript.
 *
 *  3. Sessions are now real: login issues a random token stored server-side
 *     (CacheService), not a JSON blob the browser can edit in localStorage.
 *     Every doGet call must include a valid ?token=... or it's rejected.
 *
 *  4. Every tab is now scoped server-side to the logged-in client/worker,
 *     replicating the filtering logic that used to live in usePortalData.js
 *     (branch/mou/pickup/invoice/BA/commission ownership rules). The browser
 *     never receives another client's or worker's rows again.
 *
 *  5. Password columns are stripped from every response, always.
 *
 * FRONTEND CHANGES YOU STILL NEED TO MAKE (see notes at the end of this file):
 *   - sheets.js: loadTab() must send ?token=...
 *   - PortalAuth.jsx: login() must call doPost {action:"login"} instead of
 *     downloading the user/worker tab and checking passwords itself.
 *   - usePortalData.js: can mostly be deleted — the server now returns only
 *     the caller's own rows, so client-side filtering is no longer needed
 *     (though leaving harmless filters in place doesn't hurt).
 * ============================================================================
 */

// Portal sheet: read-only mirror of the user sheet (populated via IMPORTRANGE).
const d = "1lxYb6N6UUHcT1GLSgk8bmcWgJitnhZM3NBkdKEIbpCA";

// User sheet: the ORIGINAL source file. Writes (doPost) go here instead of
// the portal sheet, because the portal sheet's cells are IMPORTRANGE
// formulas — calling setValue() on them would break the import.
const USER_SHEET_ID = "1e955Lkrjph2yFT8Prrkhpur0AVU1lzRna54cWCbTFeU";

const SETTING_SHEET_NAME = "0.Setting";
const UNIVERSAL_PASSWORD_CELL = "B1"; // per your sheets.js comment: universal password lives in B2
const LAST_ACCESSED_HEADER = "Last Accessed";
const SESSION_TTL_SECONDS = 6 * 60 * 60; // 6 hours

// Rate limiting for login attempts, tracked per identifier (ID or email).
// After MAX_LOGIN_ATTEMPTS failures within LOGIN_ATTEMPT_WINDOW_SECONDS, that
// identifier is locked out for LOGIN_LOCKOUT_SECONDS regardless of whether
// the correct password is supplied.
const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_ATTEMPT_WINDOW_SECONDS = 2 * 60; // 15 min window to accumulate failures
const LOGIN_LOCKOUT_SECONDS = 5 * 60;        // 15 min lockout once threshold is hit

// Mirrors the COL map in src/lib/sheets.js — keep these two in sync if you
// ever rename a column header in the spreadsheet.
const COL = {
  U_EMAIL: "Email", U_PASS: "User Password", U_ID: "User ID",
  W_ID: "Worker ID", W_PASS: "Worker Password", W_EMAIL: "Email",
  W_ACTIVE_MOU: "Active MOU", W_EXPIRING_MOU: "Expiring Soon MOU", W_EXPIRED: "Expired MOU",
  B_ID: "Branch ID", B_OWNER: "Owner USER ID",
  M_ID: "MOU ID", M_BRANCH: "Branch ID", M_USERID: "USER ID", M_MARKETING: "Marketing",
  D_MOU: "ID MOU", D_USERID: "USER ID", D_INPUTTYPE: "Input Type", D_FESTRONIK2: "FESTRONIK LANGKAH 2",
  I_USERID: "INVOICE USER ID", I_MARKETING: "Marketing",
};

const TABS = {
  user: { sheetName: "1.User", headerRow: 0, idHeader: COL.U_ID, emailHeader: COL.U_EMAIL, passwordHeader: COL.U_PASS },
  worker: { sheetName: "2.Worker", headerRow: 0, idHeader: COL.W_ID, emailHeader: COL.W_EMAIL, passwordHeader: COL.W_PASS },
  branch: { sheetName: "3.Branch", headerRow: 2 },
  mou: { sheetName: "4.MOU", headerRow: 0 },
  data: { sheetName: "5.Data", headerRow: 0 },
  invoice: { sheetName: "6.Invoice", headerRow: 0 },
  ba: { sheetName: "7.BA", headerRow: 0 },
  c1sudahtrf: { sheetName: "8.SudahKomisi", headerRow: 0 },
  c1belumtrf: { sheetName: "9.BelumKomisi", headerRow: 0 },
};

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ----------------------------------------------------------------------------
// LOW-LEVEL SHEET HELPERS
// ----------------------------------------------------------------------------

function colLetterToIndex_(letter) {
  let n = 0;
  for (const ch of String(letter).toUpperCase()) {
    if (ch < "A" || ch > "Z") continue;
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

function normalizeHeaders_(header) {
  const keys = [];
  const used = {};
  header.forEach(h => {
    let hStr = String(h).trim();
    if (hStr.startsWith("Jumlah:")) hStr = "Jumlah";
    if (hStr.startsWith("Tanggal Muat")) hStr = "Tanggal Muat";
    if (used[hStr]) keys.push(hStr + "__" + used[hStr]++);
    else { used[hStr] = 1; keys.push(hStr); }
  });
  return keys;
}

function rowToObject_(keys, row, ss, passwordHeader) {
  const o = {};
  const pwIdx = passwordHeader ? keys.indexOf(passwordHeader) : -1;
  keys.forEach((k, i) => {
    if (i === pwIdx) return; // never expose password columns
    const val = row[i];
    if (val && (k.includes("Tanggal") || k.includes("Date") || k.includes("Start") || k.includes("End"))) {
      o[k] = Utilities.formatDate(new Date(val), ss.getSpreadsheetTimeZone(), "dd MMM yyyy");
    } else {
      o[k] = val ?? "";
    }
  });
  return o;
}

// Reads a tab from the PORTAL sheet (id `d`) and returns both the raw rows
// (for column-letter based matching) and the normalized objects.
function readPortalTab_(tabKey) {
  const conf = TABS[tabKey];
  const ss = SpreadsheetApp.openById(d);
  const sheet = ss.getSheetByName(conf.sheetName);
  if (!sheet) return { keys: [], rawRows: [], objects: [] };

  const data = sheet.getDataRange().getValues();
  const header = data[conf.headerRow] || [];
  const keys = normalizeHeaders_(header);
  const rawRows = data.slice(conf.headerRow + 1).filter(r =>
    r.some(v => v !== "" && v !== null && v !== undefined)
  );
  const objects = rawRows.map(r => rowToObject_(keys, r, ss, conf.passwordHeader));
  return { keys, rawRows, objects };
}

function str_(v) {
  return String(v ?? "").trim();
}

// ----------------------------------------------------------------------------
// SESSION HELPERS — token maps to {id, role}, stored server-side only.
// ----------------------------------------------------------------------------

function createSession_(id, role) {
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put("session_" + token, JSON.stringify({ id: id, role: role }), SESSION_TTL_SECONDS);
  return token;
}

function getSession_(token) {
  if (!token) return null;
  const raw = CacheService.getScriptCache().get("session_" + token);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

// ----------------------------------------------------------------------------
// LOGIN RATE LIMITING
// ----------------------------------------------------------------------------

function loginAttemptKey_(identifier) {
  return "loginfail_" + str_(identifier).toLowerCase();
}

// Returns { locked: boolean, remainingSeconds: number }
function checkLoginLock_(identifier) {
  const raw = CacheService.getScriptCache().get(loginAttemptKey_(identifier));
  if (!raw) return { locked: false, remainingSeconds: 0 };
  const data = JSON.parse(raw);
  if (data.lockUntil && data.lockUntil > Date.now()) {
    return { locked: true, remainingSeconds: Math.ceil((data.lockUntil - Date.now()) / 1000) };
  }
  return { locked: false, remainingSeconds: 0 };
}

function recordFailedLogin_(identifier) {
  const cache = CacheService.getScriptCache();
  const key = loginAttemptKey_(identifier);
  const raw = cache.get(key);
  const data = raw ? JSON.parse(raw) : { count: 0, lockUntil: 0 };
  data.count += 1;
  if (data.count >= MAX_LOGIN_ATTEMPTS) {
    data.lockUntil = Date.now() + LOGIN_LOCKOUT_SECONDS * 1000;
  }
  const ttl = data.lockUntil ? LOGIN_LOCKOUT_SECONDS : LOGIN_ATTEMPT_WINDOW_SECONDS;
  cache.put(key, JSON.stringify(data), ttl);
}

function clearFailedLogins_(identifier) {
  CacheService.getScriptCache().remove(loginAttemptKey_(identifier));
}

// ----------------------------------------------------------------------------
// LOGIN
// ----------------------------------------------------------------------------

function readUniversalPassword_() {
  const ss = SpreadsheetApp.openById(d);
  const sheet = ss.getSheetByName(SETTING_SHEET_NAME);
  if (!sheet) return "";
  const raw = sheet.getRange(UNIVERSAL_PASSWORD_CELL).getValue();
  return raw === "" || raw === null ? "" : String(raw);
}

// tabName: "user" (role: client) or "worker" (role: office)
// identifier: ID or email
function login_(tabName, identifier, password) {
  const conf = TABS[tabName];
  if (!conf || !conf.idHeader || !conf.passwordHeader) {
    return jsonOut({ error: "Tab not configured for login: " + tabName });
  }
  if (!identifier || !password) {
    return jsonOut({ error: "Missing credentials" });
  }

  const lock = checkLoginLock_(identifier);
  if (lock.locked) {
    return jsonOut({
      error: "Too many failed login attempts. Please try again later.",
      locked: true,
      remainingSeconds: lock.remainingSeconds,
    });
  }

  const ss = SpreadsheetApp.openById(USER_SHEET_ID);
  const sheet = ss.getSheetByName(conf.sheetName);
  if (!sheet) return jsonOut({ error: "Sheet not found: " + conf.sheetName });

  const data = sheet.getDataRange().getValues();
  const header = data[conf.headerRow] || [];
  const idColIdx = header.findIndex(h => str_(h) === conf.idHeader);
  const emailColIdx = header.findIndex(h => str_(h) === conf.emailHeader);
  const pwColIdx = header.findIndex(h => str_(h) === conf.passwordHeader);
  if (idColIdx === -1 || pwColIdx === -1) {
    return jsonOut({ error: "Login columns not found on " + conf.sheetName });
  }

  const universalPassword = readUniversalPassword_();
  const isUniversal = universalPassword !== "" && str_(password) === universalPassword;
  const idLower = str_(identifier).toLowerCase();

  for (let i = conf.headerRow + 1; i < data.length; i++) {
    const row = data[i];
    const rowId = str_(row[idColIdx]).toLowerCase();
    const rowEmail = emailColIdx !== -1 ? str_(row[emailColIdx]).toLowerCase() : "";
    if (rowId !== idLower && rowEmail !== idLower) continue;

    const storedPw = str_(row[pwColIdx]);
    if (!isUniversal && storedPw !== str_(password)) {
      recordFailedLogin_(identifier);
      const nowLocked = checkLoginLock_(identifier);
      if (nowLocked.locked) {
        return jsonOut({
          error: "Too many failed login attempts. Please try again later.",
          locked: true,
          remainingSeconds: nowLocked.remainingSeconds,
        });
      }
      return jsonOut({ error: "Invalid credentials" });
    }

    clearFailedLogins_(identifier);
    const profile = {};
    header.forEach((h, idx) => {
      if (idx === pwColIdx) return;
      profile[str_(h)] = row[idx];
    });

    const canonicalId = str_(row[idColIdx]);
    const role = tabName === "worker" ? "office" : "client";
    const token = createSession_(canonicalId, role);
    recordLogin_(tabName, canonicalId);

    return jsonOut({ success: true, token: token, role: role, profile: profile });
  }

  recordFailedLogin_(identifier);
  return jsonOut({ error: "Invalid credentials" });
}

function recordLogin_(tabName, id) {
  const conf = TABS[tabName];
  if (!conf || !conf.idHeader || !id) return;

  const ss = SpreadsheetApp.openById(USER_SHEET_ID);
  const sheet = ss.getSheetByName(conf.sheetName);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const header = data[conf.headerRow] || [];
  const idColIdx = header.findIndex(h => str_(h) === conf.idHeader);
  const lastAccessedColIdx = header.findIndex(h => str_(h) === LAST_ACCESSED_HEADER);
  if (idColIdx === -1 || lastAccessedColIdx === -1) return;

  for (let i = conf.headerRow + 1; i < data.length; i++) {
    if (str_(data[i][idColIdx]).toLowerCase() === str_(id).toLowerCase()) {
      const now = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "dd MMM yyyy HH:mm");
      sheet.getRange(i + 1, lastAccessedColIdx + 1).setValue(now);
      return;
    }
  }
}

// ----------------------------------------------------------------------------
// PER-ROLE SCOPING — replicates the filtering that used to run in the
// browser (usePortalData.js), now enforced server-side so it can't be
// bypassed by editing localStorage or calling the API directly.
// ----------------------------------------------------------------------------

function getWorkerMouIds_(wid) {
  const { objects } = readPortalTab_("worker");
  const row = objects.find(w => str_(w[COL.W_ID]).toLowerCase() === wid);
  const ids = new Set();
  if (row) {
    [COL.W_ACTIVE_MOU, COL.W_EXPIRING_MOU, COL.W_EXPIRED].forEach(col => {
      str_(row[col]).split(/[,;\n\r|]/).forEach(x => { if (str_(x)) ids.add(str_(x)); });
    });
  }
  return ids;
}

function scopedMous_(session) {
  const { objects } = readPortalTab_("mou");
  if (session.role === "client") {
    const uid = session.id.toLowerCase();
    return objects.filter(m => str_(m[COL.M_USERID]).toLowerCase() === uid);
  }
  const wid = session.id.toLowerCase();
  const workerMouIds = getWorkerMouIds_(wid);
  if (workerMouIds.size > 0) {
    return objects.filter(m => workerMouIds.has(str_(m[COL.M_ID])));
  }
  return objects.filter(m => str_(m[COL.M_MARKETING]).toLowerCase().includes(wid));
}

function scopedBranches_(session) {
  const { objects } = readPortalTab_("branch");
  if (session.role === "client") {
    const uid = session.id.toLowerCase();
    return objects.filter(b => str_(b[COL.B_OWNER]).toLowerCase() === uid);
  }
  const branchIds = new Set(scopedMous_(session).map(m => str_(m[COL.M_BRANCH])));
  return objects.filter(b => branchIds.has(str_(b[COL.B_ID])));
}

function scopedPickups_(session) {
  const { objects } = readPortalTab_("data");
  if (session.role === "client") {
    const uid = session.id.toLowerCase();
    return objects.filter(r => str_(r[COL.D_USERID]).toLowerCase() === uid && str_(r[COL.D_INPUTTYPE]) === "F-OPR");
  }
  const mouIds = new Set(scopedMous_(session).map(m => str_(m[COL.M_ID])));
  return objects.filter(r => str_(r[COL.D_INPUTTYPE]) === "F-OPR" && mouIds.has(str_(r[COL.D_MOU])));
}

function scopedInvoices_(session) {
  const { objects } = readPortalTab_("invoice");
  if (session.role === "client") {
    const uid = session.id.toLowerCase();
    return objects.filter(r => str_(r[COL.I_USERID]).toLowerCase() === uid);
  }
  const wid = session.id.toLowerCase();
  return objects.filter(r => str_(r[COL.I_MARKETING]).toLowerCase().includes(wid));
}

// BA tab: owner matched by spreadsheet column AD, per your original app's
// getColByLetter approach (header text for this column is unreliable).
function scopedBeritaAcara_(session) {
  if (session.role !== "client") return []; // office doesn't view BA in the current app
  const { keys, rawRows } = readPortalTab_("ba");
  const uid = session.id.toLowerCase();
  const ownerIdx = colLetterToIndex_("AD");
  const ss = SpreadsheetApp.openById(d);
  return rawRows
    .filter(r => str_(r[ownerIdx]).toLowerCase() === uid)
    .map(r => rowToObject_(keys, r, ss, null));
}

// Commission tabs: office only, matched by spreadsheet column letter (per
// your original getColByLetter usage), using "includes" not exact match.
function scopedSudahKomisi_(session) {
  if (session.role !== "office") return [];
  const { keys, rawRows } = readPortalTab_("c1sudahtrf");
  const wid = session.id.toLowerCase();
  const idx = colLetterToIndex_("I");
  const ss = SpreadsheetApp.openById(d);
  return rawRows
    .filter(r => str_(r[idx]).toLowerCase().includes(wid))
    .map(r => rowToObject_(keys, r, ss, null));
}

function scopedBelumKomisi_(session) {
  if (session.role !== "office") return [];
  const { keys, rawRows } = readPortalTab_("c1belumtrf");
  const wid = session.id.toLowerCase();
  const idx = colLetterToIndex_("A");
  const ss = SpreadsheetApp.openById(d);
  return rawRows
    .filter(r => str_(r[idx]).toLowerCase().includes(wid))
    .map(r => rowToObject_(keys, r, ss, null));
}

// Own profile only (used e.g. by a Profile page) — never returns other
// users'/workers' rows, and never returns the password column.
function scopedOwnProfile_(tabKey, session) {
  const expectedRole = tabKey === "worker" ? "office" : "client";
  if (session.role !== expectedRole) return [];
  const { objects } = readPortalTab_(tabKey);
  const conf = TABS[tabKey];
  const uid = session.id.toLowerCase();
  return objects.filter(o => str_(o[conf.idHeader]).toLowerCase() === uid);
}

// ----------------------------------------------------------------------------
// doGet
// ----------------------------------------------------------------------------

function doGet(e) {
  const tab = (e && e.parameter && e.parameter.tab) || "";
  const token = e && e.parameter && e.parameter.token;

  const session = getSession_(token);
  if (!session) {
    return jsonOut({ error: "Unauthorized. Please log in." });
  }

  switch (tab) {
    case "branch": return jsonOut(scopedBranches_(session));
    case "mou": return jsonOut(scopedMous_(session));
    case "data": return jsonOut(scopedPickups_(session));
    case "invoice": return jsonOut(scopedInvoices_(session));
    case "ba": return jsonOut(scopedBeritaAcara_(session));
    case "c1sudahtrf": return jsonOut(scopedSudahKomisi_(session));
    case "c1belumtrf": return jsonOut(scopedBelumKomisi_(session));
    case "user": return jsonOut(scopedOwnProfile_("user", session));
    case "worker": return jsonOut(scopedOwnProfile_("worker", session));
    default: return jsonOut({ error: "Invalid tab" });
  }
}

// ----------------------------------------------------------------------------
// doPost
// ----------------------------------------------------------------------------

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ error: "Invalid JSON body" });
  }

  const action = body && body.action;

  if (action === "login") {
    return login_(body.tab || "user", body.identifier || body.id, body.password);
  }

  if (action === "recordLogin") {
    // Requires an already-valid session so this can't be used to spam
    // arbitrary IDs anonymously. login_() already records the timestamp,
    // so this is only here for backward compatibility with the old
    // fire-and-forget call in sheets.js — safe to leave, safe to remove.
    const session = getSession_(body.token);
    if (!session || String(session.id).toLowerCase() !== String(body.id).toLowerCase()) {
      return jsonOut({ error: "Unauthorized" });
    }
    recordLogin_(body.tab || (session.role === "office" ? "worker" : "user"), body.id);
    return jsonOut({ success: true });
  }

  return jsonOut({ error: "Unknown action: " + action });
}