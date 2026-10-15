import { useEffect, useState, useCallback } from "react";
import { loadTab, invalidateTab } from "@/lib/sheets";

// How long a tab is allowed to load before the UI offers a manual refresh
// button in addition to the spinner. The request itself is NOT aborted —
// Apps Script has no abort signal — this only changes what's shown.
const DEFAULT_TIMEOUT_MS = 12000;

// Fetches only the tab(s) a given page actually needs, instead of every tab
// in the portal up front. Pages that only render one table (Invoice, BA,
// Perizinan, Dokumentasi, komisi tables, ...) ask for exactly one tab;
// pages that combine a couple of tabs (Dashboard, MouDetail, BranchDetail)
// can pass an array. Tabs are still cached by loadTab(), so re-visiting a
// page you already loaded this session is instant and doesn't re-fetch.
//
// Returns:
//   values   - object keyed by tab name -> array of rows (never undefined,
//              defaults to [] per tab while loading/on error)
//   loading  - true while the request(s) for the current tab set are in flight
//   error    - error message string, or null
//   sessionExpired - true when the error is an expired/invalid login session (show the
//              "logout and login again" screen instead of a generic load failure)
//   timedOut - true once `timeoutMs` has passed while still loading — use
//              this to surface a "still working / try refreshing" hint
//              without treating it as a hard failure
//   reload   - call to invalidate the cache for these tabs and refetch
export function useTabData(tabs, session, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const tabList = Array.isArray(tabs) ? tabs : [tabs];
  const tabKey = tabList.join(",");
  const token = session && session.token;

  const [state, setState] = useState({ loading: true, error: null, sessionExpired: false, timedOut: false, values: {} });
  const [reloadCount, setReloadCount] = useState(0);

  const reload = useCallback(() => {
    if (token) tabList.forEach((t) => invalidateTab(t, token));
    setReloadCount((c) => c + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey, token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null, sessionExpired: false, timedOut: false }));

    const timeoutId = setTimeout(() => {
      if (!cancelled) setState((s) => (s.loading ? { ...s, timedOut: true } : s));
    }, timeoutMs);

    Promise.all(tabList.map((t) => loadTab(t, token)))
      .then((results) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        const values = {};
        tabList.forEach((t, i) => { values[t] = Array.isArray(results[i]) ? results[i] : []; });
        setState({ loading: false, error: null, sessionExpired: false, timedOut: false, values });
      })
      .catch((e) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setState((s) => ({ ...s, loading: false, error: (e && e.message) || "Gagal memuat data.", sessionExpired: !!(e && e.code === "SESSION_EXPIRED"), timedOut: false }));
      });

    return () => { cancelled = true; clearTimeout(timeoutId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tabKey, reloadCount, timeoutMs]);

  return { ...state, reload };
}
