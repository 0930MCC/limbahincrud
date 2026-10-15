import React, { useState, useMemo } from "react";
import { COL } from "@/lib/sheets";
import { parseDate } from "@/lib/format";
import PerizinanDetailDialog from "./PerizinanDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import { EmptyState } from "./Loader";
import { ChevronRight } from "lucide-react";

function expiryPill(dateVal) {
  const d = parseDate(dateVal);
  if (!d) return null;
  const now = new Date();
  const daysLeft = Math.round((d.getTime() - now.getTime()) / 86400000);
  const expired = daysLeft < 0;
  const soon = !expired && daysLeft <= 30;
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
      expired
        ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
        : soon
        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
    }`}>
      {expired ? "Expired" : soon ? "Segera Expired" : "Aktif"}
    </span>
  );
}

export default function PerizinanTable({ items }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "expired", dir: "asc" });

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((it) =>
      String(it[COL.PZ_NOMOR] || "").toLowerCase().includes(q) ||
      String(it[COL.PZ_JENISDOKUMEN] || "").toLowerCase().includes(q) ||
      String(it[COL.PZ_LEMBAGA] || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "nomor") {
        cmp = String(a[COL.PZ_NOMOR] || "").localeCompare(String(b[COL.PZ_NOMOR] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else {
        const da = parseDate(a[COL.PZ_TGLEXPIRED]);
        const db = parseDate(b[COL.PZ_TGLEXPIRED]);
        if (!da && !db) cmp = 0;
        else if (!da) cmp = 1;
        else if (!db) cmp = -1;
        else cmp = da.getTime() - db.getTime();
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort]);

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key !== key) return { key, dir: "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  };

  if (items.length === 0) return <EmptyState label="Belum ada data perizinan." />;

  return (
    <div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={items.length}
        itemLabel="perizinan"
        search={search}
        onSearchChange={(v) => setSearch(v)}
        searchPlaceholder="Cari Nomor / Jenis / Lembaga..."
        sorts={[
          {
            key: "nomor",
            label: "Urut: Nomor",
            active: sort.key === "nomor",
            direction: sort.key === "nomor" ? sort.dir : "asc",
            onClick: () => toggleSort("nomor"),
          },
          {
            key: "expired",
            label: "Urut: Tanggal Expired",
            active: sort.key === "expired",
            direction: sort.key === "expired" ? sort.dir : "asc",
            onClick: () => toggleSort("expired"),
          },
        ]}
      />
      <TableScrollShell>
        <table className="table-fixed w-[920px] text-xs">
          <colgroup>
            <col style={{ width: 140 }} />
            <col style={{ width: 220 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">Nomor</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Jenis Dokumen</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Lembaga</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Tgl Expired</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Status</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil untuk "{search}"</td>
              </tr>
            ) : sorted.map((item, i) => {
              const d = parseDate(item[COL.PZ_TGLEXPIRED]);
              return (
                <tr
                  key={(item[COL.PZ_NOMOR] || i) + "-" + i}
                  onClick={() => setSelected(item)}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
                >
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words" title={item[COL.PZ_NOMOR] || "-"}>{item[COL.PZ_NOMOR] || "-"}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words" title={item[COL.PZ_JENISDOKUMEN] || "-"}>{item[COL.PZ_JENISDOKUMEN] || "-"}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words" title={item[COL.PZ_LEMBAGA] || "-"}>{item[COL.PZ_LEMBAGA] || "-"}</td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-600 dark:text-slate-400">
                    {d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : item[COL.PZ_TGLEXPIRED] || "-"}
                  </td>
                  <td className="px-3 py-2.5">{expiryPill(item[COL.PZ_TGLEXPIRED])}</td>
                  <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScrollShell>
      <PerizinanDetailDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
