import React from "react";
import Loader, { ErrorState, SessionExpiredState } from "./Loader";

// Wrap a page's content with this instead of each page re-implementing the
// loading/error branches. Only renders `children` once the tab(s) that page
// asked for (via useTabData) have actually loaded.
//
// `sessionExpired` (from useTabData) switches the generic "Gagal memuat data" screen for a clear
// "your session has expired — logout and login again" screen with a Logout button.
export default function TabLoader({ loading, error, sessionExpired, timedOut, reload, children }) {
  if (error && sessionExpired) return <SessionExpiredState />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading) return <Loader timedOut={timedOut} onRetry={reload} />;
  return children;
}
