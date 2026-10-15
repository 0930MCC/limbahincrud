import React, { useState, useMemo } from "react";
import { COL } from "@/lib/sheets";
import { parseDate, formatDateShort } from "@/lib/format";
import CrmDetailDialog from "./CrmDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import FilterSelect from "./FilterSelect";
import { EmptyState } from "./Loader";
import { ChevronRight } from "lucide-react";

export default function CrmTable({ items, role }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [sortDir, setSortDir] = useState("desc");

  const jenisOptions = useMemo(() => {
    const set = new Set();
    items.forEach((it) => { const j = String(it[COL.C_JENIS] || "").trim(); if (j) set.add(j); });
    return [{ value: "all", label: "Semua Jenis" }, ...Array.from(set).sort().map((j) => ({ value: j, label: j }))];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (search.trim() && !String(it[COL.C_ID] || "").toLowerCase().includes(search.trim().toLowerCase())) return false;
      if (jenisFilter !== "all" && String(it[COL.C_JENIS] || "").trim() !== jenisFilter) return false;
      return true;
    });
  }, [items, search, jenisFilter]);

  // Sorted by ID rather than by parsing C_TANGGAL — same reasoning as JadwalTable.jsx: the ID
  // already encodes the date and sorts correctly as a string, without depending on a separate
  // date field being present/consistent.
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const cmp = String(a[COL.C_ID] || "").localeCompare(String(b[COL.C_ID] || ""), undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortDir]);

  if (items.length === 0) return <EmptyState label="Belum ada request CRM." />;

  return (
    <div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={items.length}
        itemLabel="request"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari ID Request..."
        sorts={[{
          key: "date", label: "Urut: ID", active: true, direction: sortDir,
          onClick: () => setSortDir((d) => (d === "asc" ? "desc" : "asc")),
        }]}
        extra={<FilterSelect ariaLabel="Filter jenis request" value={jenisFilter} onChange={setJenisFilter} options={jenisOptions} />}
      />
      <TableScrollShell>
        <table className="table-fixed w-[990px] text-xs">
          <colgroup>
            <col style={{ width: 130 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 220 }} />
            <col style={{ width: 220 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">ID Request</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Tanggal Req</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Jenis Req</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">ID Klien</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Data Klien</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Catatan Request</th>
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
                key={(item[COL.C_ID] || i) + "-" + i}
                onClick={() => setSelected(item)}
                className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
              >
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words font-mono text-[10.5px]" title={item[COL.C_ID] || "-"}>{item[COL.C_ID] || "-"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-slate-600 dark:text-slate-400">{formatDateShort(item[COL.C_TANGGAL]) || "-"}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words">{item[COL.C_JENIS] || "-"}</td>
                <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words">{item[COL.C_CUSTID] || "-"}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words">{item[COL.C_CUSTDATA] || "-"}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words line-clamp-2">{item[COL.C_CATATAN] || "-"}</td>
                <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScrollShell>
      <CrmDetailDialog item={selected} role={role} onClose={() => setSelected(null)} />
    </div>
  );
}
