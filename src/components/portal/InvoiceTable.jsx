import React, { useState, useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { COL, parseNum } from "@/lib/sheets";
import { formatRupiah, parseDate } from "@/lib/format";
import InvoiceDetailDialog from "./InvoiceDetailDialog";
import TableToolbar from "./TableToolbar";
import TableScrollShell from "./TableScrollShell";
import FileLinkButtons from "./FileLinkButtons";
import { EmptyState } from "./Loader";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronRight, Filter, ArrowUp, ArrowDown, ArrowUpDown, Calendar, DollarSign, RotateCcw, SlidersHorizontal } from "lucide-react";

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

// Normalizes periods like "2606-1" or "2606-2" to base period "2606"
function getBasePeriod(p) {
  if (!p) return "";
  return String(p).trim().split("-")[0].trim();
}

// Fixed amount stops requested: 0, 2, 5, 10, 20, 50, 100, max (in Millions)
const AMOUNT_STOPS = [
  { label: "0", display: "Rp 0", value: 0 },
  { label: "2M", display: "Rp 2 Juta", value: 2000000 },
  { label: "5M", display: "Rp 5 Juta", value: 5000000 },
  { label: "10M", display: "Rp 10 Juta", value: 10000000 },
  { label: "20M", display: "Rp 20 Juta", value: 20000000 },
  { label: "50M", display: "Rp 50 Juta", value: 50000000 },
  { label: "100M", display: "Rp 100 Juta", value: 100000000 },
  { label: "Max", display: "Max", value: Infinity },
];

export default function InvoiceTable({ invoices, showCommission = false }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [periodeFilter, setPeriodeFilter] = useState("all");
  const [amountRangeIndex, setAmountRangeIndex] = useState([0, AMOUNT_STOPS.length - 1]);
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const jenisOptions = useMemo(() => {
    const set = new Set();
    invoices.forEach((inv) => {
      const v = String(inv[COL.I_JENIS] || "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [invoices]);

  // Extracts base periods (e.g., 2606-1 and 2606-2 merge into 2606)
  const periodOptions = useMemo(() => {
    const set = new Set();
    invoices.forEach((inv) => {
      const baseP = getBasePeriod(inv[COL.I_PERIODE]);
      if (baseP) set.add(baseP);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));
  }, [invoices]);

  const minAmountValue = AMOUNT_STOPS[amountRangeIndex[0]].value;
  const maxAmountValue = AMOUNT_STOPS[amountRangeIndex[1]].value;
  const isAmountFiltered = amountRangeIndex[0] > 0 || amountRangeIndex[1] < AMOUNT_STOPS.length - 1;

  const byFilters = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Jenis Filter
      if (jenisFilter !== "all" && String(inv[COL.I_JENIS] || "").trim() !== jenisFilter) {
        return false;
      }
      // 2. Base Periode Filter (2606 matches 2606, 2606-1, 2606-2)
      if (periodeFilter !== "all" && getBasePeriod(inv[COL.I_PERIODE]) !== periodeFilter) {
        return false;
      }
      // 3. Amount Range Slider Filter
      const amt = parseNum(inv[COL.I_GRANDTOTAL]);
      if (amt < minAmountValue) return false;
      if (maxAmountValue !== Infinity && amt > maxAmountValue) return false;

      return true;
    });
  }, [invoices, jenisFilter, periodeFilter, minAmountValue, maxAmountValue]);

  const filtered = useMemo(() => {
    if (!search.trim()) return byFilters;
    const q = search.trim().toLowerCase();
    return byFilters.filter((inv) =>
      String(inv[COL.I_ID] || "").toLowerCase().includes(q) ||
      String(inv[COL.I_KLIEN] || "").toLowerCase().includes(q) ||
      String(inv[COL.I_PERIODE] || "").toLowerCase().includes(q)
    );
  }, [byFilters, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "id") {
        cmp = String(a[COL.I_ID] || "").localeCompare(String(b[COL.I_ID] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else if (sort.key === "jenis") {
        cmp = String(a[COL.I_JENIS] || "").localeCompare(String(b[COL.I_JENIS] || ""), undefined, { numeric: true, sensitivity: "base" });
      } else if (sort.key === "amount") {
        cmp = parseNum(a[COL.I_GRANDTOTAL]) - parseNum(b[COL.I_GRANDTOTAL]);
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

  const totalGrandTotal = useMemo(
    () => sorted.reduce((sum, inv) => sum + parseNum(inv[COL.I_GRANDTOTAL]), 0),
    [sorted]
  );

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key !== key) return { key, dir: key === "amount" || key === "date" ? "desc" : "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  };

  const currentSortValue = `${sort.key}-${sort.dir}`;
  const sortOptions = [
    { value: "date-desc", label: "Urut: Tanggal (Terbaru)" },
    { value: "date-asc", label: "Urut: Tanggal (Terlama)" },
    { value: "amount-desc", label: "Urut: Jumlah (Tertinggi)" },
    { value: "amount-asc", label: "Urut: Jumlah (Terendah)" },
    { value: "id-asc", label: "Urut: Invoice ID (A-Z)" },
    { value: "id-desc", label: "Urut: Invoice ID (Z-A)" },
    { value: "jenis-asc", label: "Urut: Jenis Invoice" },
  ];

  const handleSortSelect = (val) => {
    const [key, dir] = val.split("-");
    setSort({ key, dir });
  };

  const hasActiveFilters = jenisFilter !== "all" || periodeFilter !== "all" || isAmountFiltered || search.trim() !== "";

  const resetAllFilters = () => {
    setJenisFilter("all");
    setPeriodeFilter("all");
    setAmountRangeIndex([0, AMOUNT_STOPS.length - 1]);
    setSearch("");
  };

  const HeaderSortIcon = ({ colKey }) => {
    if (sort.key !== colKey) return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />;
    return sort.dir === "asc" ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />;
  };

  const getAmountButtonText = () => {
    if (!isAmountFiltered) return "Nominal: Semua";
    const minStr = AMOUNT_STOPS[amountRangeIndex[0]].display;
    const maxStr = AMOUNT_STOPS[amountRangeIndex[1]].display;
    return `${minStr} – ${maxStr}`;
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
        searchPlaceholder="Cari Invoice ID / Klien / Periode..."
        sortValue={currentSortValue}
        onSortChange={handleSortSelect}
        sortOptions={sortOptions}
        extra={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Base Periode Filter (2606 merges 2606-1 and 2606-2) */}
            {periodOptions.length > 0 && (
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={periodeFilter}
                  onChange={(e) => setPeriodeFilter(e.target.value)}
                  className="h-10 pl-8 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition appearance-none cursor-pointer font-medium"
                >
                  <option value="all">Semua Periode</option>
                  {periodOptions.map((p) => (
                    <option key={p} value={p}>Periode {p}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Jenis Invoice Filter */}
            {jenisOptions.length > 0 && (
              <div className="relative">
                <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                  className="h-10 pl-8 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition appearance-none cursor-pointer font-medium"
                >
                  <option value="all">Semua Jenis</option>
                  {jenisOptions.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Draggable Min & Max Amount Range Popover Slider */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`h-10 px-3 rounded-lg border text-xs font-medium flex items-center gap-2 transition ${
                    isAmountFiltered
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span>{getAmountButtonText()}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-brand-600" />
                      Rentang Nominal (Min – Maks)
                    </span>
                    {isAmountFiltered && (
                      <button
                        onClick={() => setAmountRangeIndex([0, AMOUNT_STOPS.length - 1])}
                        className="text-[11px] text-brand-600 hover:underline font-medium"
                      >
                        Reset Range
                      </button>
                    )}
                  </div>

                  {/* Summary Value Badge */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {AMOUNT_STOPS[amountRangeIndex[0]].display} s/d {AMOUNT_STOPS[amountRangeIndex[1]].display}
                    </span>
                  </div>

                  {/* Dual Thumb Draggable Slider */}
                  <div className="px-1 py-2">
                    <SliderPrimitive.Root
                      min={0}
                      max={AMOUNT_STOPS.length - 1}
                      step={1}
                      value={amountRangeIndex}
                      onValueChange={(val) => {
                        // Ensure min <= max
                        if (val[0] <= val[1]) setAmountRangeIndex(val);
                      }}
                      className="relative flex w-full touch-none select-none items-center py-2 cursor-pointer"
                    >
                      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <SliderPrimitive.Range className="absolute h-full bg-brand-600 dark:bg-brand-500" />
                      </SliderPrimitive.Track>
                      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-brand-600 bg-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-grab active:cursor-grabbing" />
                      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-brand-600 bg-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-grab active:cursor-grabbing" />
                    </SliderPrimitive.Root>

                    {/* Step Stops Labels underneath slider */}
                    <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-mono">
                      {AMOUNT_STOPS.map((stop, i) => (
                        <span
                          key={stop.label}
                          className={
                            i >= amountRangeIndex[0] && i <= amountRangeIndex[1]
                              ? "text-brand-600 dark:text-brand-400 font-semibold"
                              : "text-slate-400 opacity-60"
                          }
                        >
                          {stop.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Reset All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="h-10 px-3 rounded-lg border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium flex items-center gap-1 transition"
                title="Reset Semua Filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        }
      />

      {/* Rolled-up summary for the CURRENT filtered/searched set (`sorted`), not just what's on screen. */}
      <div className="mb-3 rounded-lg border border-brand-100 dark:border-brand-500/20 bg-brand-50/60 dark:bg-brand-600/5 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {hasActiveFilters ? `Total Grand Total (${sorted.length} hasil terfilter)` : `Total Grand Total (${sorted.length} invoice)`}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {formatRupiah(totalGrandTotal)}
          </span>
        </div>
      </div>

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
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 select-none">
            <tr className="text-left">
              <th
                onClick={() => toggleSort("id")}
                className="px-3 py-2.5 font-medium text-[10px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
              >
                <div className="flex items-center gap-1">
                  <span>Invoice ID</span>
                  <HeaderSortIcon colKey="id" />
                </div>
              </th>
              <th className="px-3 py-2.5 font-medium text-[10px]">Klien</th>
              <th
                onClick={() => toggleSort("date")}
                className="px-3 py-2.5 font-medium text-[10px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
              >
                <div className="flex items-center gap-1">
                  <span>Invoice Date</span>
                  <HeaderSortIcon colKey="date" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("jenis")}
                className="px-3 py-2.5 font-medium text-[10px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
              >
                <div className="flex items-center gap-1">
                  <span>Jenis Invoice</span>
                  <HeaderSortIcon colKey="jenis" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("amount")}
                className="px-3 py-2.5 font-medium text-[10px] text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Grand Total</span>
                  <HeaderSortIcon colKey="amount" />
                </div>
              </th>
              {showCommission && <th className="px-3 py-2.5 font-medium text-[10px] text-right">Allocation</th>}
              <th className="px-3 py-2.5 font-medium text-[10px]">Status</th>
              <th className="px-3 py-2.5 font-medium text-[10px]">File</th>
              <th className="px-2 py-2.5 w-7" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={99} className="px-3 py-6 text-center text-slate-400 text-xs">Tidak ada hasil yang sesuai filter.</td>
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
