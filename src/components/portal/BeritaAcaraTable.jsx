import React, { useState, useMemo } from "react";
import { COL } from "@/lib/sheets";
import { parseDate } from "@/lib/format";
import BeritaAcaraDetailDialog from "./BeritaAcaraDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import { EmptyState } from "./Loader";
import { ChevronRight } from "lucide-react";

export default function BeritaAcaraTable({ items }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((it) =>
      String(it[COL.BA_ID] || "").toLowerCase().includes(q) ||
      String(it[COL.BA_KLIEN] || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "id") {
        cmp = String(a[COL.BA_ID] || "").localeCompare(String(b[COL.BA_ID] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else {
        const da = parseDate(a[COL.BA_DATE]);
        const db = parseDate(b[COL.BA_DATE]);
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

  if (items.length === 0) return <EmptyState label="Belum ada berita acara." />;

  return (
    <div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={items.length}
        itemLabel="berita acara"
        search={search}
        onSearchChange={(v) => setSearch(v)}
        searchPlaceholder="Cari BA ID / Nama Klien..."
        sorts={[
          {
            key: "id",
            label: "Urut: BA ID",
            active: sort.key === "id",
            direction: sort.key === "id" ? sort.dir : "asc",
            onClick: () => toggleSort("id"),
          },
          {
            key: "date",
            label: "Urut: Tanggal BA",
            active: sort.key === "date",
            direction: sort.key === "date" ? sort.dir : "desc",
            onClick: () => toggleSort("date"),
          },
        ]}
      />
      <TableScrollShell>
        <table className="table-fixed w-[860px] text-xs">
          <colgroup>
            <col style={{ width: 140 }} />
            <col style={{ width: 220 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">BA ID</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Nama Klien</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Tanggal BA</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Frekuensi</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil untuk "{search}"</td>
              </tr>
            ) : sorted.map((item, i) => {
              const d = parseDate(item[COL.BA_DATE]);
              return (
                <tr
                  key={(item[COL.BA_ID] || i) + "-" + i}
                  onClick={() => setSelected(item)}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
                >
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words" title={item[COL.BA_ID] || "-"}>{item[COL.BA_ID] || "-"}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words" title={item[COL.BA_KLIEN] || "-"}>{item[COL.BA_KLIEN] || "-"}</td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-600 dark:text-slate-400">
                    {d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : item[COL.BA_DATE] || "-"}
                  </td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-500 dark:text-slate-400">{item[COL.BA_FREKUENSI] || "-"}</td>
                  <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScrollShell>
      <BeritaAcaraDetailDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
