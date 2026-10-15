import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, recordLogin, clearCache, COL } from "@/lib/sheets";

const PortalAuthContext = createContext(null);
const SESSION_KEY = "limbahin_session";

// NOTE ON SECURITY: unlike the old version, the object stored here no longer
// grants access on its own. Every field except `token` is purely for UI
// display (name, role badge, etc). All real authorization happens on the
// server, which validates `token` against its own session store on every
// request — so even if someone edits this object in devtools, they can't
// see another account's data; they'd need a valid token, which only the
// server can issue after a correct password check.

function str(v) {
  return String(v ?? "").trim();
}

export function PortalAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // role: "client" | "office"
  async function login({ identifier, password, role }) {
    const id = (identifier || "").trim();
    const pass = (password || "").trim();
    if (!id || !pass) throw new Error("Mohon isi semua kolom.");

    const tab = role === "office" ? "worker" : "user";

    let result;
    try {
      result = await apiLogin(tab, id, pass);
    } catch (err) {
      const wrapped = new Error(err.message || "Kredensial tidak valid. Periksa kembali ID/email dan password Anda.");
      if (err.locked) {
        wrapped.locked = true;
        wrapped.remainingSeconds = err.remainingSeconds || 0;
      }
      throw wrapped;
    }

    const { token, role: serverRole, profile } = result;

    const s = serverRole === "office"
      ? {
          role: "office",
          token,
          workerId: profile[COL.W_ID],
          name: profile[COL.W_NAME] ?? profile["Nama"],
          jabatan: profile[COL.W_JABATAN],
          email: profile[COL.W_EMAIL],
        }
      : {
          role: "client",
          token,
          userId: profile[COL.U_ID],
          name: profile[COL.U_NAME],
          pic: profile[COL.U_PIC],
          jabatan: profile[COL.U_JABATAN],
          email: profile[COL.U_EMAIL],
        };

    persist(s);
    // login_() on the server already records the "Last Accessed" timestamp,
    // this second call is kept only for parity with the old flow and is
    // safe/optional to remove.
    recordLogin(token, s.role, s.role === "office" ? s.workerId : s.userId);
    return s;
  }

  function persist(s) {
    clearCache(); // never let a new session see a previous session's cached data
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }

  function logout() {
    clearCache();
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return (
    <PortalAuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  return useContext(PortalAuthContext);
}
