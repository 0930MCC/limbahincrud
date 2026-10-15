import React, { useState, useMemo } from "react";
import { COL } from "@/lib/sheets";
import { parseDate, formatDateShort } from "@/lib/format";
import { jadwalSource, jadwalStatus, jadwalStatusTone } from "@/lib/jadwal";
import JadwalDetailDialog from "./JadwalDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import FilterSelect from "./FilterSelect";
import { EmptyState } from "./Loader";
import { ChevronRight } from "lucide-react";

const TONE_CLASS = {
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  slate: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

// The status label is "Today" / "Upcoming" / "Completed", optionally followed by
// " - Reschedule to <ID or [Pending]>". A rescheduled row's chip used to be one long
// `whitespace-nowrap` pill that spilled out of the Status column; now the chip wraps around its
// text — base status on the first line, the reschedule note below it, and long IDs are allowed to
// break — so the chip (and with it the row) simply grows to the height it needs.
function statusPill(statusLabel) {
  const label = String(statusLabel || "").trim();
  if (!label) return null;
  const [base, ...rest] = label.split(/\s+-\s+/);
  const note = rest.join(" - ").trim();
  return (
    <span
      className={`inline-block max-w-full text-left text-[10px] leading-snug font-medium whitespace-normal [overflow-wrap:anywhere] ${
        note ? "rounded-xl px-2.5 py-1.5" : "rounded-full px-2 py-0.5"
      } ${TONE_CLASS[jadwalStatusTone(label)]}`}
    >
      <span className="block">{base}</span>
      {note && <span className="block opacity-80">{note}</span>}
    </span>
  );
}

// `locationOf(row)` resolves each row's Cust ID to a "Daerah" via the caller's branch-lookup map
// (Jadwal itself has no location column — see pages/JadwalCrm.jsx for how the lookup is built
// from the "branch" tab). Falls back to "-" when a Cust ID can't be matched to a branch.
export default function JadwalTable({ items, role, locationOf }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [reschedFilter, setReschedFilter] = useState("all");
  const [sortDir, setSortDir] = useState("desc");

  const locationOptions = useMemo(() => {
    const set = new Set();
    items.forEach((it) => { const l = locationOf(it); if (l) set.add(l); });
    return [{ value: "all", label: "Semua Lokasi" }, ...Array.from(set).sort().map((l) => ({ value: l, label: l }))];
  }, [items, locationOf]);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "Today", label: "Today" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Completed", label: "Completed" },
  ];

  const reschedOptions = [
    { value: "all", label: "Semua Jadwal" },
    { value: "resched", label: "Reschedule Saja" },
    { value: "normal", label: "Bukan Reschedule" },
  ];

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (search.trim() && !String(it[COL.J_ID] || "").toLowerCase().includes(search.trim().toLowerCase())) return false;
      if (statusFilter !== "all" && !jadwalStatus(it).startsWith(statusFilter)) return false;
      if (locationFilter !== "all" && locationOf(it) !== locationFilter) return false;
      const isResched = String(it[COL.J_RESCHEDPROBLEM] || "").trim() !== "";
      if (reschedFilter === "resched" && !isResched) return false;
      if (reschedFilter === "normal" && isResched) return false;
      return true;
    });
  }, [items, search, statusFilter, locationFilter, reschedFilter, locationOf]);

  // Sorted by ID rather than by parsing J_TANGGAL — the ID itself already encodes the date (and
  // sorts correctly as a string, numeric-aware), so this avoids any mismatch from a separately
  // stored date field being blank, differently formatted, or just out of sync with the ID.
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const cmp = String(a[COL.J_ID] || "").localeCompare(String(b[COL.J_ID] || ""), undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortDir]);

  if (items.length === 0) return <EmptyState label="Belum ada jadwal." />;

  return (
    <div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={items.length}
        itemLabel="jadwal"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari ID Jadwal..."
        sorts={[{
          key: "date", label: "Urut: ID", active: true, direction: sortDir,
          onClick: () => setSortDir((d) => (d === "asc" ? "desc" : "asc")),
        }]}
        extra={(
          <>
            <FilterSelect ariaLabel="Filter status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
            <FilterSelect ariaLabel="Filter lokasi" value={locationFilter} onChange={setLocationFilter} options={locationOptions} />
            <FilterSelect ariaLabel="Filter reschedule" value={reschedFilter} onChange={setReschedFilter} options={reschedOptions} />
          </>
        )}
      />
      <TableScrollShell>
        <table className="table-fixed w-[1030px] text-xs">
          <colgroup>
            <col style={{ width: 130 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">ID Jadwal</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Tanggal</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Urutan</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Cust ID</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Cust Name</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Source</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Status</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil.</td>
              </tr>
            ) : sorted.map((item, i) => (
              <tr
                key={(item[COL.J_ID] || i) + "-" + i}
                onClick={() => setSelected(item)}
                className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
              >
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words font-mono text-[10.5px]" title={item[COL.J_ID] || "-"}>{item[COL.J_ID] || "-"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-slate-600 dark:text-slate-400">{formatDateShort(item[COL.J_TANGGAL]) || "-"}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{item[COL.J_URUTAN] || "-"}</td>
                <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words">{item[COL.J_CUSTID] || "-"}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words">{item[COL.J_CUSTNAME] || "-"}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words">{jadwalSource(item) || "-"}</td>
                <td className="px-3 py-2.5">{statusPill(jadwalStatus(item))}</td>
                <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScrollShell>
      <JadwalDetailDialog item={selected} role={role} onClose={() => setSelected(null)} />
    </div>
  );
}
