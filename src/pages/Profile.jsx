import React from "react";
import { useOutletContext } from "react-router-dom";
import { usePortalAuth } from "@/lib/PortalAuth";
import PageHeader from "@/components/portal/PageHeader";
import { LogOut } from "lucide-react";

export default function Profile() {
  const { session } = useOutletContext();
  const { logout } = usePortalAuth();
  const initials = (session.name || session.userId || session.workerId || "U").slice(0, 2).toUpperCase();

  const fields = session.role === "client"
    ? [["User ID", session.userId], ["Nama", session.name], ["PIC", session.pic], ["Jabatan", session.jabatan], ["Email", session.email]]
    : [["Worker ID", session.workerId], ["Nama", session.name], ["Jabatan", session.jabatan], ["Email", session.email]];

  return (
    <div className="max-w-lg">
      <PageHeader title="Profile" subtitle="Informasi akun Anda" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-14 h-14 rounded-full bg-brand-600 text-white text-lg font-semibold flex items-center justify-center">{initials}</div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{session.name}</div>
            <div className="text-sm text-slate-400 capitalize">{session.role} Portal</div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {fields.map(([label, value]) => value ? (
            <div key={label} className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
            </div>
          ) : null)}
        </div>
        <button onClick={logout} className="mt-6 w-full h-10 rounded-lg border border-red-200 dark:border-red-500/30 text-red-500 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </div>
  );
}