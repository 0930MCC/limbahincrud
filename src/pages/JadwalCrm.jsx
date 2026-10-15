import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarClock, MessageSquare } from "lucide-react";
import { COL } from "@/lib/sheets";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import TabLoader from "@/components/portal/TabLoader";
import JadwalTable from "@/components/portal/JadwalTable";
import CrmTable from "@/components/portal/CrmTable";

// NOTE on row filtering (see also PortalAuth.jsx's security note): every other tab in this portal
// (mou, invoice, ba, ...) already comes back from the `portal-data` edge function pre-filtered to
// the signed-in session — the client never even sees another account's rows. The `jadwal` and
// `crm` tables are brand new, so until the edge function is taught to filter them the same way
// server-side, the filtering below is done here on the client as a stopgap. That means a client
// role user with direct access to the network response could technically see other customers'
// rows — treat this as UI-only scoping, not real access control, until the backend catches up.
// Client (role: "user") -> match the row's USER column against session.userId.
// Office/worker (role: "office") -> match the row's MARKETING column against the signed-in worker.
//
// The MARKETING / Marketing cell is NOT just the worker's name. In the sheet it is a composed label,
// e.g. "Ali - Marketing Staff" + a line break + "EMPY-GHZL6" (name - jabatan, then the Worker ID).
// The old check compared the whole cell to session.name ("Ali"), which can never be equal, so every
// office user got an empty Jadwal and CRM. The Worker ID is the one stable, unique part of that
// label, so it is matched first (as a whole token, so EMPY-GHZL6 doesn't match EMPY-GHZL61); the
// name is only a fallback for rows that still hold a bare name or a "name - jabatan" label.
const norm = (v) => String(v ?? "").replace(/\s+/g, " ").trim().toLowerCase();
const escapeRe = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function marketingMatchesWorker(cell, session) {
  const c = norm(cell);
  if (!c) return false;

  const id = norm(session.workerId);
  if (id && new RegExp(`(^|[^a-z0-9-])${escapeRe(id)}($|[^a-z0-9-])`).test(c)) return true;

  const name = norm(session.name);
  if (!name) return false;
  return c === name || c.startsWith(`${name} - `);
}

function scopeByRole(items, role, session, userCol, marketingCol) {
  if (role === "client") {
    const uid = String(session.userId || "").trim().toLowerCase();
    if (!uid) return items;
    return items.filter((it) => String(it[userCol] || "").trim().toLowerCase() === uid);
  }
  if (!norm(session.workerId) && !norm(session.name)) return items;
  return items.filter((it) => marketingMatchesWorker(it[marketingCol], session));
}

export default function JadwalCrm() {
  const { session } = useOutletContext();
  const role = session.role === "office" ? "office" : "client";
  const [tab, setTab] = useState("jadwal");

  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData(["jadwal", "crm", "branch"], session);

  const branchLookup = useMemo(() => {
    const map = {};
    (values.branch || []).forEach((b) => {
      const id = String(b[COL.B_ID] || "").trim();
      if (id) map[id] = b[COL.B_DAERAH] || "";
    });
    return map;
  }, [values.branch]);

  const locationOf = (row) => branchLookup[String(row[COL.J_CUSTID] || "").trim()] || "";

  const jadwal = useMemo(
    () => scopeByRole(values.jadwal || [], role, session, COL.J_USER, COL.J_MARKETING),
    [values.jadwal, role, session]
  );
  const crm = useMemo(
    () => scopeByRole(values.crm || [], role, session, COL.C_USER, COL.C_MARKETING),
    [values.crm, role, session]
  );

  const TAB_META = {
    jadwal: { title: "Jadwal", subtitle: "Penjadwalan" },
    crm: { title: "CRM", subtitle: "Kebutuhan dan Permintaan Klien" },
  };

  return (
    <div>
      {/* Mode toggle sits above the title (matches the app-mode switcher's visual language) —
          a bold two-segment pill rather than small tab buttons, since this decides which whole
          dataset/title the rest of the page shows, not just a filter. */}
      <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-1 mb-3">
        {[
          ["jadwal", "Jadwal", CalendarClock, jadwal.length],
          ["crm", "CRM", MessageSquare, crm.length],
        ].map(([key, label, Icon, count]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === key
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${tab === key ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <PageHeader title={TAB_META[tab].title} subtitle={TAB_META[tab].subtitle} />

      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        {tab === "jadwal"
          ? <JadwalTable items={jadwal} role={role} locationOf={locationOf} />
          : <CrmTable items={crm} role={role} />}
      </TabLoader>
    </div>
  );
}
