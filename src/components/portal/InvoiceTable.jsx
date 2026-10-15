import React, { useState, useMemo } from "react";
import { COL, parseNum } from "@/lib/sheets";
import { formatRupiah, parseDate } from "@/lib/format";
import InvoiceDetailDialog from "./InvoiceDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import FileLinkButtons from "./FileLinkButtons";
import { EmptyState } from "./Loader";
import { ChevronRight, Filter } from "lucide-react";

function statusPill(status) {
  const paid = /paid|bayar|lunas/i.test(status || "") && !/not paid|belum/i.test(status || "");
  const issue = /issue/i.test(status || "");
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
      paid
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
        : issue
        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
        : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
    }`}>
      {paid ? "Paid" : issue ? "Issue" : "Unpaid"}
    </span>
  );
}

export default function InvoiceTable({ invoices, showCommission = false }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const jenisOptions = useMemo(() => {
    const set = new Set();
    invoices.forEach((inv) => {
      const v = String(inv[COL.I_JENIS] || "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [invoices]);

  const byJenis = useMemo(() => {
    if (jenisFilter === "all") return invoices;
    return invoices.filter((inv) => String(inv[COL.I_JENIS] || "").trim() === jenisFilter);
  }, [invoices, jenisFilter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return byJenis;
    const q = search.trim().toLowerCase();
    return byJenis.filter((inv) =>
      String(inv[COL.I_ID] || "").toLowerCase().includes(q) ||
      String(inv[COL.I_KLIEN] || "").toLowerCase().includes(q)
    );
  }, [byJenis, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "id") {
        cmp = String(a[COL.I_ID] || "").localeCompare(String(b[COL.I_ID] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else if (sort.key === "jenis") {
        cmp = String(a[COL.I_JENIS] || "").localeCompare(String(b[COL.I_JENIS] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else {
        const da = parseDate(a[COL.I_DATE]);
        const db = parseDate(b[COL.I_DATE]);
        if (!da && !db) cmp = 0;
        else if (!da) cmp = 1;
        else if (!db) cmp = -1;
        else cmp = da.getTime() - db.getTime();
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort]);

  // Sums always follow the current filtered result set (`sorted`), not just
  // the page that happens to be rendered — so it stays correct whether the
  // person has searched/filtered or not.
  const totalGrandTotal = useMemo(
    () => sorted.reduce((sum, inv) => sum + parseNum(inv[COL.I_GRANDTOTAL]), 0),
    [sorted]
  );
  const totalKomisi = useMemo(
    () => sorted.reduce((sum, inv) => sum + parseNum(inv[COL.I_KOMISI]), 0),
    [sorted]
  );

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key !== key) return { key, dir: key === "date" ? "desc" : "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  };

  if (invoices.length === 0) return <EmptyState label="Belum ada invoice." />;

  return (
    <div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={invoices.length}
        itemLabel="invoice"
        search={search}
        onSearchChange={(v) => setSearch(v)}
        searchPlaceholder="Cari Invoice ID / Klien..."
        extra={
          jenisOptions.length > 0 && (
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="h-10 pl-8 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition appearance-none"
              >
                <option value="all">Semua Jenis Invoice</option>
                {jenisOptions.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          )
        }
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

      {/* Rolled-up summary for the CURRENT filtered/searched set (`sorted`), not just what's on
          screen. Client view shows total invoice amount only; the worker/office view (showCommission)
          shows both — total invoice (revenue) AND total commission for that same filtered set — since
          per-row figures alone don't answer "how much, altogether, for what I've filtered to". */}
      {!showCommission && (
        <div className="mb-3 rounded-lg border border-brand-100 dark:border-brand-500/20 bg-brand-50/60 dark:bg-brand-600/5 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {search.trim() || jenisFilter !== "all" ? `Total Grand Total (${sorted.length} hasil terfilter)` : `Total Grand Total (${sorted.length} invoice)`}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {formatRupiah(totalGrandTotal)}
            </span>
          </div>
        </div>
      )}
      {showCommission && (
        <div className="mb-3 rounded-lg border border-brand-100 dark:border-brand-500/20 bg-brand-50/60 dark:bg-brand-600/5 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {search.trim() || jenisFilter !== "all" ? `Ringkasan (${sorted.length} hasil terfilter)` : `Ringkasan (${sorted.length} invoice)`}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Total Invoice: <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{formatRupiah(totalGrandTotal)}</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Total Komisi: <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{formatRupiah(totalKomisi*0.5)}</span>
            </span>
          </div>
        </div>
      )}

      <TableScrollShell>
        <table className="table-fixed w-[1020px] text-xs">
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: 190 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 140 }} />
            {showCommission && <col style={{ width: 130 }} />}
            <col style={{ width: 100 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium text-[10px]">Invoice ID</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Klien</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Invoice Date</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Jenis Invoice</th>
              <th className="px-3 py-2.5 font-medium text-[10px] text-right">Grand Total</th>
              {showCommission && <th className="px-3 py-2.5 font-medium text-[10px] text-right">Allocation</th>}
              <th className="px-3 py-2.5 font-medium text-[10px]">Status</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">File</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil untuk "{search}"</td>
              </tr>
            ) : sorted.map((inv, i) => {
              const d = parseDate(inv[COL.I_DATE]);
              return (
                <tr
                  key={inv[COL.I_ID] + i}
                  onClick={() => setSelected(inv)}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 cursor-pointer"
                >
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium whitespace-normal break-words" title={inv[COL.I_ID]}>{inv[COL.I_ID]}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words" title={inv[COL.I_KLIEN]}>{inv[COL.I_KLIEN]}</td>
                  <td className="px-3 py-2.5 whitespace-normal break-words text-slate-600 dark:text-slate-400">
                    {d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : inv[COL.I_DATE] || "-"}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-normal break-words" title={inv[COL.I_JENIS]}>{inv[COL.I_JENIS]}</td>
                  <td className="px-3 py-2.5 text-right whitespace-normal break-words text-slate-800 dark:text-slate-200">{formatRupiah(inv[COL.I_GRANDTOTAL])}</td>
                  {showCommission && <td className="px-3 py-2.5 text-right whitespace-normal break-words text-brand-600 dark:text-brand-400 font-medium">{formatRupiah(inv[COL.I_KOMISI])}</td>}
                  <td className="px-3 py-2.5">{statusPill(inv[COL.I_STATUS])}</td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <FileLinkButtons label="Invoice File" value={inv[COL.I_INVFILE]} variant="icon" />
                      <FileLinkButtons label="Faktur Pajak" value={inv[COL.I_ADJFILE1]} variant="icon" />
                      <FileLinkButtons label="File Lain" value={inv[COL.I_ADJFILE2]} variant="icon" />
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScrollShell>
      <InvoiceDetailDialog invoice={selected} showCommission={showCommission} onClose={() => setSelected(null)} />
    </div>
  );
}
