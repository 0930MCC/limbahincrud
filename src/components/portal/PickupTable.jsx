import React, { useState, useMemo } from "react";
import { COL } from "@/lib/sheets";
import { parseDate } from "@/lib/format";
import PickupDetailDialog from "./PickupDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import { EmptyState } from "./Loader";
import { ChevronRight } from "lucide-react";

// Potong teks definisi kalau kepanjangan, supaya tidak merusak layout tabel.
// Teks lengkap tetap ada lewat atribut title (muncul saat di-hover).
function truncateText(str, max = 60) {
  if (!str) return "-";
  const s = String(str);
  return s.length > max ? s.slice(0, max).trimEnd() + "…" : s;
}

export default function PickupTable({ pickups, title = "Data Pengambilan" }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  // Only one sort is active at a time: { key: "date" | "itemcode", dir: "asc" | "desc" }
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const filtered = useMemo(() => {
    if (!search.trim()) return pickups;
    const q = search.trim().toLowerCase();
    return pickups.filter((p) => String(p[COL.D_ITEMCODE] || "").toLowerCase().includes(q));
  }, [pickups, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "date") {
        const da = parseDate(a[COL.D_DATE]);
        const db = parseDate(b[COL.D_DATE]);
        cmp = (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
      } else if (sort.key === "itemcode") {
        const ca = String(a[COL.D_ITEMCODE] ?? "");
        const cb = String(b[COL.D_ITEMCODE] ?? "");
        cmp = ca.localeCompare(cb, undefined, { numeric: true, sensitivity: "base" });
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

  if (pickups.length === 0) return <EmptyState label="Belum ada pengambilan." />;

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={pickups.length}
        itemLabel="transaksi"
        search={search}
        onSearchChange={(v) => setSearch(v)}
        searchPlaceholder="Cari Item Code..."
        sorts={[
          {
            key: "date",
            label: "Urut: Tanggal",
            active: sort.key === "date",
            direction: sort.key === "date" ? sort.dir : "desc",
            onClick: () => toggleSort("date"),
          },
          {
            key: "itemcode",
            label: "Urut: Item Code",
            active: sort.key === "itemcode",
            direction: sort.key === "itemcode" ? sort.dir : "asc",
            onClick: () => toggleSort("itemcode"),
          },
        ]}
      />
      <TableScrollShell>
        <table className="table-fixed w-[920px] text-xs">
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 260 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">Tanggal</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Item Code</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Definisi</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Klien</th>
              <th className="px-3 py-2.5 font-medium text-[10px] text-right">Berat</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil untuk "{search}"</td>
              </tr>
            ) : sorted.map((p, i) => {
              const d = parseDate(p[COL.D_DATE]);
              return (
                <tr
                  key={p[COL.D_ID] + i}
                  onClick={() => setSelected(p)}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
                >
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-700 dark:text-slate-300">
                    {d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "-"}
                  </td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-700 dark:text-slate-300">{p[COL.D_ITEMCODE]}</td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-500 dark:text-slate-400">
                    {p[COL.D_DEFINISI] || "-"}
                  </td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-500 dark:text-slate-400" title={p[COL.D_KLIEN] || ""}>{p[COL.D_KLIEN]}</td>
                  <td className="px-3 py-2.5 text-right font-medium whitespace-normal break-words text-slate-800 dark:text-slate-200">
                    {p[COL.D_WEIGHT]} {p[COL.D_SATUAN]}
                  </td>
                  <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScrollShell>
      <PickupDetailDialog pickup={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
