import React, { useState } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { usePortalAuth } from "@/lib/PortalAuth";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ModeSwitcherDialog, { modeDashboardPath, modeFromPathname } from "./ModeSwitcherDialog";
import { Menu, X, LogOut } from "lucide-react";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

// NOTE: this layout no longer prefetches every tab (branch/mou/data/invoice/
// ba/komisi/perizinan/dokumentasi) up front. That used to mean: one slow or
// failing tab held up the whole portal, and a single Promise.all() failure
// could quietly leave some pages empty after a refresh. Now each page pulls
// only the tab(s) it actually renders via useTabData(), lazily, the first
// time it's visited (see src/lib/usePortalData.js + individual pages).
export default function PortalLayout() {
  const { session, loading, logout } = usePortalAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Mode only exists for client sessions, and it is read straight off the URL (see
  // modeFromPathname in ModeSwitcherDialog.jsx): a client always starts in Limbah B3
  // (/app/limbahb3/dashboard) after login, and every other mode has its own dashboard path.
  // Nothing is stored — so the address bar, sidebar and page can't drift out of sync.
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const mode = modeFromPathname(location.pathname);

  // Picking a mode jumps to THAT mode's dashboard right away. Re-picking the mode you're already
  // in just closes the dialog and leaves you on the page you were on.
  const setMode = (key) => {
    setModeDialogOpen(false);
    if (key !== mode) navigate(modeDashboardPath(key));
  };

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;

  const isClient = session.role === "client";
  const showModeDialog = isClient && modeDialogOpen;

  const initials = (session.name || session.userId || session.workerId || "U").slice(0, 2).toUpperCase();
  const subLine = session.pic
    ? `${session.pic} · ${session.jabatan || ""}`
    : session.jabatan || (session.role === "office" ? "Office" : "Client");

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0 h-full">
          <Sidebar role={session.role} mode={mode} onRequestModeChange={() => setModeDialogOpen(true)} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-60 h-full">
              <Sidebar
                role={session.role}
                mode={mode}
                onRequestModeChange={() => { setModeDialogOpen(true); setMobileOpen(false); }}
                onNavigate={() => setMobileOpen(false)}
              />
              <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-slate-500" onClick={() => setMobileOpen(true)}><Menu className="w-4 h-4" /></button>
              <div>
                <div className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100">{session.name || session.userId || session.workerId}</div>
                <div className="text-xs text-slate-400">{subLine}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center">{initials}</div>
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-500/30 rounded-lg px-3 py-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <div className="px-4 md:px-6 pt-6 pb-8 max-w-6xl mx-auto">
            <Outlet context={{ session, mode }} />
          </div>
        </main>
      </div>

      {isClient && (
        <ModeSwitcherDialog
          open={showModeDialog}
          current={mode}
          forced={false}
          onSelect={setMode}
          onClose={() => setModeDialogOpen(false)}
        />
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari sesi ini dan perlu login kembali untuk mengakses portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}