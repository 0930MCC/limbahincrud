import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, FlaskConical, Trash2, Recycle } from "lucide-react";

// The three modes a client can pick — Logistik is intentionally left out for now (per product
// decision; re-add here + MODE_META below if it comes back). Each mode's actual nav content is
// defined in Sidebar.jsx (B3_NAV) — this file only knows about the picker itself.
//
// The mode lives in the URL, not in component state: every mode has its own dashboard at
// /app/<slug>/dashboard, and `modeFromPathname()` reads the active mode straight back off the
// current path. That keeps the address bar, the sidebar and the page in sync by construction —
// picking a mode just navigates to that mode's dashboard.
export const MODES = [
  { key: "b3", slug: "limbahb3", label: "Limbah B3", icon: FlaskConical, soon: false, tint: "from-teal-500 to-teal-700" },
  { key: "domestik", slug: "limbah-domestik", label: "Limbah Domestik", icon: Trash2, soon: true, tint: "from-amber-500 to-amber-700" },
  { key: "ekonomis", slug: "limbah-ekonomis", label: "Limbah Ekonomis", icon: Recycle, soon: true, tint: "from-sky-500 to-sky-700" },
];

export function modeMeta(key) {
  return MODES.find((m) => m.key === key) || MODES[0];
}

export function modeDashboardPath(key) {
  return `/app/${modeMeta(key).slug}/dashboard`;
}

// Active mode for a given location.pathname. Anything that isn't under another mode's prefix
// (including the B3-only pages like /app/cabang or /app/mou) belongs to Limbah B3, which is also
// the mode a client always lands in right after login.
export function modeFromPathname(pathname) {
  const p = String(pathname || "").toLowerCase();
  const hit = MODES.find((m) => m.key !== "b3" && (p === `/app/${m.slug}` || p.startsWith(`/app/${m.slug}/`)));
  return hit ? hit.key : "b3";
}

// `forced`: true when the person has never picked a mode yet (fresh login) — the dialog can't be
// dismissed without choosing in that case (no X button, no backdrop-close). Once a mode exists,
// this same dialog is reachable anytime from the sidebar's mode chip to switch, and behaves like
// a normal dismissible dialog.
export default function ModeSwitcherDialog({ open, current, forced, onSelect, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !forced) onClose(); }}>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => forced && e.preventDefault()}
        onEscapeKeyDown={(e) => forced && e.preventDefault()}
        hideCloseButton={forced}
      >
        <DialogHeader>
          <DialogTitle>Pilih Mode Layanan</DialogTitle>
          <DialogDescription>
            {forced
              ? "Pilih salah satu mode untuk mulai menggunakan portal."
              : "Beralih ke mode lain kapan saja — Dashboard selalu tersedia, menu lainnya menyesuaikan mode yang aktif."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2.5 mt-1">
          {MODES.map((m) => {
            const active = current === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onSelect(m.key)}
                className={`relative flex items-center gap-3 rounded-xl p-3.5 text-left border transition overflow-hidden ${
                  active
                    ? "border-brand-600 ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700"
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${m.tint} text-white`}>
                  <m.icon className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{m.label}</span>
                    {m.soon && (
                      <span className="text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shrink-0">Coming Soon</span>
                    )}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    {m.soon ? "Fitur lengkap segera hadir" : "Dashboard, Pelayanan & Dokumen"}
                  </span>
                </span>
                {active && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
