import React, { useState, useMemo } from "react";
import { COL } from "@/lib/sheets";
import { formatRupiah, parseDate, parseAmount, formatCurrency } from "@/lib/format";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import { EmptyState } from "./Loader";
import { ChevronRight } from "lucide-react";

export default function BelumKomisiTable({ belumkomisis, showCommission = false }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const filtered = useMemo(() => {
    if (!search.trim()) return belumkomisis;
    const q = search.trim().toLowerCase();
    return belumkomisis.filter((inv) =>
      String(inv[COL.BK_INVID] || "").toLowerCase().includes(q) ||
      String(inv[COL.BK_CUSTNAME] || "").toLowerCase().includes(q)
    );
  }, [belumkomisis, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "id") {
        cmp = String(a[COL.BK_INVID] || "").localeCompare(String(b[COL.BK_INVID] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else if (sort.key === "jenis") {
        cmp = String(a[COL.BK_INVTYPE] || "").localeCompare(String(b[COL.BK_INVTYPE] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else {
        const da = parseDate(a[COL.BK_INVDATE]);
        const db = parseDate(b[COL.BK_INVDATE]);
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
      if (s.key !== key) return { key, dir: key === "date" ? "desc" : "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  };

  const totalAmount = useMemo(() => {
    return belumkomisis.reduce((sum, inv) => sum + parseAmount(inv[COL.BK_CAMOUNT]), 0);
  }, [belumkomisis]);

  if (belumkomisis.length === 0) return <EmptyState label="Belum ada invoice." />;

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="font-bold text-[#2ba5ad]">Total Comission: {formatCurrency(totalAmount)}</span>
      </div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={belumkomisis.length}
        itemLabel="invoice"
        search={search}
        onSearchChange={(v) => setSearch(v)}
        searchPlaceholder="Cari Invoice ID / Nama Customer..."
        sorts={[
          {
            key: "id",
            label: "Urut: Invoice ID",
            active: sort.key === "id",
            direction: sort.key === "id" ? sort.dir : "asc",
            onClick: () => toggleSort("id"),
          },
          {
            key: "date",
            label: "Urut: Invoice Date",
            active: sort.key === "date",
            direction: sort.key === "date" ? sort.dir : "desc",
            onClick: () => toggleSort("date"),
          },
          {
            key: "jenis",
            label: "Urut: Jenis Invoice",
            active: sort.key === "jenis",
            direction: sort.key === "jenis" ? sort.dir : "asc",
            onClick: () => toggleSort("jenis"),
          },
        ]}
      />
      <TableScrollShell>
        <table className="table-fixed w-[1060px] text-xs">
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">Invoice ID</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Type</th>
              <th className="px-3 py-2.5 font-medium text-[10px] text-left">Nama Customer</th>
              <th className="px-3 py-2.5 font-medium text-[10px] text-right">Jumlah Invoice</th>
              <th className="px-3 py-2.5 font-medium text-[10px] text-right">Jumlah Komisi</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Jenis Invoice</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Tgl Invoice</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil untuk "{search}"</td>
              </tr>
            ) : sorted.map((inv, i) => {
              const d = parseDate(inv[COL.BK_INVDATE]);
              return (
                <tr
                  key={inv[COL.BK_INVID] + i}
                  onClick={() => setSelected(inv)}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
                >
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words" title={inv[COL.BK_INVID]}>{inv[COL.BK_INVID]}</td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words" title={inv[COL.BK_INVTYPE]}>{inv[COL.BK_INVTYPE]}</td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words" title={inv[COL.BK_CUSTNAME]}>{inv[COL.BK_CUSTNAME]}</td>
                  <td className="px-3 py-2.5 text-right whitespace-normal break-words text-slate-800 dark:text-slate-200">{inv[COL.BK_INVAMOUNT] ? formatRupiah(inv[COL.BK_INVAMOUNT]) : "-"}</td>
                  <td className="px-3 py-2.5 text-right whitespace-normal break-words text-brand-600 dark:text-brand-400 font-medium">{formatRupiah(inv[COL.BK_CAMOUNT])}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words" title={inv[COL.BK_INVTYPE]}>{inv[COL.BK_INVTYPE]}</td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-600 dark:text-slate-400">
                    {d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : inv[COL.BK_INVDATE] || "-"}
                  </td>
                  <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScrollShell>
    </div>
  );
}
