import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Database, FileText, Receipt, ChevronDown, ChevronRight, User,
  Briefcase, ClipboardCheck, Sun, Moon,
  ShieldCheck,
  CheckIcon,
  ClockIcon,
  FolderOpen,
  HardDrive,
  CalendarClock,
  BarChart3,
} from "lucide-react";
import Brand from "./Brand";
import { useTheme } from "@/lib/ThemeContext";
import { modeMeta, modeDashboardPath } from "./ModeSwitcherDialog";

// Only "b3" has real content today. Dashboard sits at the top, then everything else is grouped
// under two fixed sections, "Pelayanan" and "Dokumen" — both start expanded since with only one
// mode active there's nothing to gain by hiding them behind an extra click. Domestik/Ekonomis
// (chosen via the mode switcher — see ModeSwitcherDialog.jsx) just show a Dashboard link into
// their own /app/<mode>/dashboard (a coming-soon page for now); there's nothing else to nest yet.
const b3Dashboard = { to: modeDashboardPath("b3"), label: "Dashboard", icon: LayoutDashboard, end: true };
const b3Rekapan = { to: "/app/rekapan", label: "Rekapan", icon: BarChart3 };

const b3Sections = [
  {
    key: "pelayanan",
    label: "Pelayanan",
    items: [
      { to: "/app/cabang", label: "Cabang", icon: Database },
      { to: "/app/mou", label: "MOU & Service", icon: FileText },
      { to: "/app/jadwal-crm", label: "Jadwal & CRM", icon: CalendarClock },
    ],
  },
  {
    key: "dokumen",
    label: "Dokumen",
    items: [
      { to: "/app/berita-acara", label: "Berita Acara", icon: ClipboardCheck },
      { to: "/app/invoice", label: "Invoice", icon: Receipt },
      { to: "/app/dokumentasi", label: "File & Dokumen", icon: FolderOpen },
      { to: "/app/perizinan", label: "Perizinan", icon: ShieldCheck },
    ],
  },
];

const comingSoonDashboard = {
  domestik: { to: modeDashboardPath("domestik"), label: "Dashboard", icon: LayoutDashboard, end: true },
  ekonomis: { to: modeDashboardPath("ekonomis"), label: "Dashboard", icon: LayoutDashboard, end: true },
};

const officeNav = [
  { to: "/app/service", label: "Service & MOU", icon: Briefcase },
  { to: "/app/jadwal-crm", label: "Jadwal & CRM", icon: CalendarClock },
  { to: "/app/office-invoice", label: "Invoice & Allocation", icon: Receipt },
  { to: "/app/sudah-komisi", label: "Allocation Transfered", icon: CheckIcon },
  { to: "/app/belum-komisi", label: "Allocation Pending", icon: ClockIcon },
];

// Asset Records gets its own group rather than sitting in the flat Office list — it's a
// different system (worker-scoped records, its own session) that happens to be reachable from
// the same portal, and grouping it says so.
const officeAssetNav = [
  { to: "/app/ast", label: "Asset Record", icon: HardDrive, end: true },
  { to: "/app/ast2", label: "Asset Record 2", icon: HardDrive, end: true },
];

// `mode`/`onRequestModeChange` are only meaningful for role="client" — office/worker sessions
// don't have modes, so those props are simply unused when role="office".
export default function Sidebar({ role, mode, onRequestModeChange, onNavigate }) {
  const { theme, toggle } = useTheme();
  const [openSections, setOpenSections] = useState({ pelayanan: true, dokumen: true });
  const toggleSection = (key) => setOpenSections((o) => ({ ...o, [key]: !o[key] }));

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition ${isActive
      ? "bg-brand-600 text-white font-medium shadow-sm shadow-brand-600/30"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  const activeModeMeta = role === "client" ? modeMeta(mode) : null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r  border-slate-200 dark:border-slate-800">
      <div className="px-4 py-5 border-b-0 border-slate-100 dark:border-slate-800 shrink-0">
        <Brand size={45} subtitle={role === "office" ? "Office Portal" : "Client Portal"} textClass="text-sm" />
      </div>

      {role === "client" && (
        <div className="px-3 pt-1 pb-2 shrink-0">
          <button
            onClick={onRequestModeChange}
            className="w-full flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 hover:border-brand-300 dark:hover:border-brand-700 transition"
          >
            {activeModeMeta && (
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${activeModeMeta.tint} text-white`}>
                <activeModeMeta.icon className="w-4 h-4" />
              </span>
            )}
            <span className="flex-1 text-left min-w-0">
              <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                {activeModeMeta ? activeModeMeta.label : "Pilih Mode"}
              </span>
              <span className="block text-[10px] text-slate-400">Ganti mode</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {role === "client" ? (
          mode === "b3" ? (
            <>
              <NavLink to={b3Dashboard.to} end={b3Dashboard.end} className={linkClass} onClick={onNavigate}>
                <b3Dashboard.icon className="w-3.5 h-3.5" /> {b3Dashboard.label}
              </NavLink>
              <NavLink to={b3Rekapan.to} className={linkClass} onClick={onNavigate}>
                <b3Rekapan.icon className="w-3.5 h-3.5" /> {b3Rekapan.label}
              </NavLink>

              {b3Sections.map((section) => (
                <div key={section.key} className="pt-1">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <span className="flex-1 text-left">{section.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${openSections[section.key] ? "" : "-rotate-90"}`} />
                  </button>
                  {openSections[section.key] && (
                    <div className="space-y-1.5 mt-1 pl-2 border-l border-slate-100 dark:border-slate-800 ml-3">
                      {section.items.map((n) => (
                        <NavLink key={n.to} to={n.to} end={n.end} className={linkClass} onClick={onNavigate}>
                          <n.icon className="w-3.5 h-3.5" /> {n.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : mode && comingSoonDashboard[mode] ? (
            <NavLink to={comingSoonDashboard[mode].to} end className={linkClass} onClick={onNavigate}>
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </NavLink>
          ) : (
            <p className="px-3 py-6 text-center text-[11px] text-slate-400">Pilih mode di atas untuk melanjutkan.</p>
          )
        ) : (
          <>
            <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Office</div>
            {officeNav.map((n) => (
              <NavLink key={n.to} to={n.to} className={linkClass} onClick={onNavigate}>
                <n.icon className="w-3.5 h-3.5" /> {n.label}
              </NavLink>
            ))}
            <div className="px-2 pb-1.5 pt-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Asset</div>
            {officeAssetNav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={linkClass} onClick={onNavigate}>
                <n.icon className="w-3.5 h-3.5" /> {n.label}
              </NavLink>
            ))}
          </>
        )}

        <div className="pt-3">
          <NavLink to="/app/profile" className={linkClass} onClick={onNavigate}>
            <User className="w-3.5 h-3.5" /> Profile
          </NavLink>
        </div>
      </nav>

      <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 py-1"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
          <span className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${theme === "dark" ? "bg-brand-600" : "bg-slate-300"}`}>
            <span
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm transition-all"
              style={{ left: theme === "dark" ? "1.125rem" : "0.125rem" }}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
