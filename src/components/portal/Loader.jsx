import React from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, LogOut, Clock } from "lucide-react";
import { usePortalAuth } from "@/lib/PortalAuth";

// `timedOut` + `onRetry` are optional: pass them when the caller wants a
// manual refresh option to appear if loading takes too long (see
// useTabData's `timedOut` flag). Plain callers without those props behave
// exactly as before — just a spinner.
export default function Loader({ label = "Memuat data...", timedOut = false, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-brand-500 rounded-full animate-spin" />
      <div className="text-sm text-slate-400">{label}</div>
      {timedOut && (
        <div className="flex flex-col items-center gap-2 mt-1">
          <div className="text-xs text-slate-400 max-w-xs text-center">
            Ini butuh waktu lebih lama dari biasanya. Koneksi mungkin lambat, atau server sedang sibuk.
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ErrorState({ error, onRetry, onSignout }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-[50vh]">
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center">
        <RefreshCw className="w-5 h-5" />
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Gagal memuat data</div>
        <div className="text-xs text-slate-400 mt-1 max-w-xs">{error}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
        </button>
        {onSignout && (
          <button
            onClick={onSignout}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        )}
      </div>
    </div>
  );
}

// Shown instead of the generic "Gagal memuat data" when the login session has expired. The only
// real fix is a fresh login, so the one prominent button logs out and goes to the login page.
export function SessionExpiredState() {
  const { logout } = usePortalAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-[50vh] text-center px-4">
      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <div className="text-base font-semibold text-slate-800 dark:text-slate-100">Sesi Anda telah berakhir</div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
          Demi keamanan, sesi login Anda sudah kedaluwarsa. Silakan <b>logout</b> lalu <b>login kembali</b> untuk melihat data terbaru.
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium flex items-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" /> Logout &amp; Login Kembali
      </button>
    </div>
  );
}

export function EmptyState({ label = "Belum ada data." }) {
  return <div className="text-center py-12 text-sm text-slate-400">{label}</div>;
}