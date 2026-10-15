import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getWorker, saveWorker } from "@/lib/ast/workerSession";
import { usePortalAuth } from "@/lib/PortalAuth";
import WorkerLogin from "@/pages/ast/WorkerLogin";

// Route guard for the Asset Records pages. The session is a simple localStorage worker record
// (see lib/ast/workerSession.js), separate from the sheet-based office/client PortalAuth used by
// the rest of the app.
//
// Two modes:
//   default  — standalone /ast for field workers: bounce to the full-page /ast/login.
//   portal   — /app/ast inside the office sidebar. An office login IS a worker login under the
//              hood (PortalAuth.jsx logs office users in against the same "2.Worker" sheet/tab
//              that this worker session is keyed by — see PortalAuth.jsx's `workerId`), so an
//              office user who is already signed into the portal should never be asked to log in
//              again here: this auto-provisions the worker session from the portal session so
//              Asset Records is usable right away. Only a client-role portal session (or no
//              portal session at all) falls back to the inline worker code login below.
export default function WorkerRoute({ portal = false }) {
  const [, forceRender] = useState(0);
  const { session: portalSession } = usePortalAuth() || {};
  const worker = getWorker();

  useEffect(() => {
    if (!portal || worker || !portalSession || portalSession.role !== "office") return;
    // Bridge: office portal session -> worker session, no separate login/password needed since
    // both come from the exact same worker table row.
    saveWorker({
      workerId: portalSession.workerId,
      name: portalSession.name,
      jabatan: portalSession.jabatan,
      email: portalSession.email,
    });
    forceRender((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal, worker, portalSession]);

  if (!worker) {
    if (portal && portalSession?.role === "office") {
      // Bridging effect above is about to run/has just run — avoid flashing the login form.
      return null;
    }
    if (!portal) return <Navigate to="/ast/login" replace />;
    return (
      <div className="mx-auto w-full max-w-sm py-10">
        <p className="mb-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Asset Records menggunakan kode pekerja tersendiri. Masuk dengan Worker ID Anda untuk
          melihat dan membuat data aset.
        </p>
        <WorkerLogin embedded onSuccess={() => forceRender((n) => n + 1)} />
      </div>
    );
  }

  return <Outlet />;
}
