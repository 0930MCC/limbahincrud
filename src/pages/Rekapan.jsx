import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Calendar,
  CalendarRange,
  Scale,
  Truck,
  Receipt,
  Building2,
  Package,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { COL, parseNum } from "@/lib/sheets";
import { parseDate, formatRupiah } from "@/lib/format";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import TabLoader from "@/components/portal/TabLoader";

const INDO_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const INDO_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

function formatDateIndo(d) {
  if (!d) return "-";
  return `${d.getDate()} ${INDO_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateIndoFull(d) {
  if (!d) return "-";
  return `${d.getDate()} ${INDO_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Rekapan() {
  const { session } = useOutletContext();
  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData(
    ["branch", "mou", "data", "invoice", "ba"],
    session
  );

  const branches = values.branch || [];
  const mous = values.mou || [];
  const pickups = values.data || [];
  const invoices = values.invoice || [];

  // View mode: "tahunan" (Yearly) or "bulanan" (Monthly)
  const [viewMode, setViewMode] = useState("tahunan");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonthKey, setSelectedMonthKey] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMonths, setExpandedMonths] = useState({});

  const toggleMonthExpand = (key) => {
    setExpandedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Branch lookup map
  const branchMap = useMemo(() => {
    const map = {};
    branches.forEach((b) => {
      const id = String(b[COL.B_ID] || "").trim();
      if (id) {
        map[id] = {
          name: b[COL.B_NAME] || b[COL.B_FULLNAME] || id,
          short: b[COL.B_SINGKATAN] || b[COL.B_NAME] || id,
          city: b[COL.B_CITY] || "-",
          address: b[COL.B_ADDR] || "-",
        };
      }
    });
    return map;
  }, [branches]);

  // Normalized Pickups with parsed dates
  const parsedPickups = useMemo(() => {
    return pickups
      .map((p) => {
        const d = parseDate(p[COL.D_DATE]);
        const weight = parseNum(p[COL.D_WEIGHT]);
        const branchId = String(p[COL.D_BRANCH] || "").trim();
        const branchInfo = branchMap[branchId] || {
          name: branchId || "Cabang",
          short: branchId || "Cabang",
          city: "-",
        };
        const wasteCode = p[COL.D_ITEMCODE] || p[COL.D_WC] || "-";
        const wasteDef = p[COL.D_DEFINISI] || "Limbah Medis / B3";
        return {
          raw: p,
          date: d,
          year: d ? d.getFullYear() : null,
          month: d ? d.getMonth() : null,
          monthKey: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : null,
          weight,
          branchId,
          branchName: branchInfo.name,
          branchShort: branchInfo.short,
          branchCity: branchInfo.city,
          wasteCode,
          wasteDef,
          vehicle: p[COL.D_KENDARAAN] || "-",
        };
      })
      .filter((p) => p.date !== null);
  }, [pickups, branchMap]);

  // Normalized Invoices with parsed dates
  const parsedInvoices = useMemo(() => {
    return invoices
      .map((inv) => {
        const d = parseDate(inv[COL.I_DATE]);
        const grandTotal = parseNum(inv[COL.I_GRANDTOTAL]);
        const dpp = parseNum(inv[COL.I_DPP]);
        const paidAmount = parseNum(inv[COL.I_PAIDAMOUNT]);
        const status = String(inv[COL.I_STATUS] || "unpaid").toLowerCase();
        const periode = String(inv[COL.I_PERIODE] || "").trim();
        const id = inv[COL.I_ID] || "-";
        const jenis = inv[COL.I_JENIS] || "Limbah B3";
        const fileUrl = inv[COL.I_INVFILE];

        return {
          raw: inv,
          id,
          date: d,
          year: d ? d.getFullYear() : null,
          month: d ? d.getMonth() : null,
          monthKey: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : null,
          grandTotal,
          dpp,
          paidAmount,
          status,
          periode,
          jenis,
          fileUrl,
        };
      })
      .filter((inv) => inv.date !== null);
  }, [invoices]);

  // Discover all distinct years available across pickups & invoices
  const availableYears = useMemo(() => {
    const years = new Set();
    parsedPickups.forEach((p) => {
      if (p.year) years.add(p.year);
    });
    parsedInvoices.forEach((inv) => {
      if (inv.year) years.add(inv.year);
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    return arr.length > 0 ? arr : [new Date().getFullYear()];
  }, [parsedPickups, parsedInvoices]);

  // Active Year resolution
  const activeYear = selectedYear !== null ? selectedYear : availableYears[0];

  // ==========================================
  // YEARLY AGGREGATION & DATE BOUNDS DETECTION
  // ==========================================
  const yearlyData = useMemo(() => {
    const pickupsInYear = parsedPickups.filter((p) => p.year === activeYear);
    const invoicesInYear = parsedInvoices.filter((inv) => inv.year === activeYear);

    // Collect all timestamps to find true minDate and maxDate
    const allDates = [
      ...pickupsInYear.map((p) => p.date),
      ...invoicesInYear.map((inv) => inv.date),
    ].filter(Boolean);

    let minDate = null;
    let maxDate = null;
    let totalDays = 0;
    let isFullYear = false;

    if (allDates.length > 0) {
      const timestamps = allDates.map((d) => d.getTime());
      minDate = new Date(Math.min(...timestamps));
      maxDate = new Date(Math.max(...timestamps));
      totalDays = Math.round((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Full year is defined as covering January through December
      if (
        minDate.getMonth() === 0 &&
        minDate.getDate() <= 10 &&
        maxDate.getMonth() === 11 &&
        maxDate.getDate() >= 20
      ) {
        isFullYear = true;
      }
    }

    // Monthly breakdown inside this year (12 months: index 0..11)
    const monthlyBreakdown = Array.from({ length: 12 }, (_, monthIdx) => {
      const monthPickups = pickupsInYear.filter((p) => p.month === monthIdx);
      const monthInvoices = invoicesInYear.filter((inv) => inv.month === monthIdx);

      const weight = monthPickups.reduce((s, p) => s + p.weight, 0);
      const rit = monthPickups.length;
      const billed = monthInvoices.reduce((s, inv) => s + inv.grandTotal, 0);
      const paid = monthInvoices.reduce((s, inv) => s + inv.paidAmount, 0);

      const mDates = [
        ...monthPickups.map((p) => p.date),
        ...monthInvoices.map((inv) => inv.date),
      ].filter(Boolean);

      let mMin = null;
      let mMax = null;
      if (mDates.length > 0) {
        const ts = mDates.map((d) => d.getTime());
        mMin = new Date(Math.min(...ts));
        mMax = new Date(Math.max(...ts));
      }

      // Unique branches in this month
      const branchIds = new Set(monthPickups.map((p) => p.branchId));

      return {
        monthIndex: monthIdx,
        monthName: INDO_MONTHS[monthIdx],
        monthShort: INDO_MONTHS_SHORT[monthIdx],
        weight,
        rit,
        billed,
        paid,
        hasActivity: monthPickups.length > 0 || monthInvoices.length > 0,
        branchCount: branchIds.size,
        minDate: mMin,
        maxDate: mMax,
        pickups: monthPickups,
        invoices: monthInvoices,
      };
    });

    const activeMonthsCount = monthlyBreakdown.filter((m) => m.hasActivity).length;

    // Totals
    const totalWeight = pickupsInYear.reduce((s, p) => s + p.weight, 0);
    const totalRit = pickupsInYear.length;
    const totalBilled = invoicesInYear.reduce((s, inv) => s + inv.grandTotal, 0);
    const totalPaid = invoicesInYear.reduce((s, inv) => s + inv.paidAmount, 0);
    const totalOutstanding = Math.max(0, totalBilled - totalPaid);

    // Branch breakdown
    const branchStats = {};
    pickupsInYear.forEach((p) => {
      const bId = p.branchId || "Lainnya";
      if (!branchStats[bId]) {
        branchStats[bId] = {
          branchId: bId,
          name: p.branchName,
          short: p.branchShort,
          city: p.branchCity,
          weight: 0,
          rit: 0,
          wasteCodes: new Set(),
        };
      }
      branchStats[bId].weight += p.weight;
      branchStats[bId].rit += 1;
      if (p.wasteCode) branchStats[bId].wasteCodes.add(p.wasteCode);
    });

    const branchList = Object.values(branchStats).sort((a, b) => b.weight - a.weight);

    // Waste Type Breakdown
    const wasteStats = {};
    pickupsInYear.forEach((p) => {
      const code = p.wasteCode || "Umum";
      if (!wasteStats[code]) {
        wasteStats[code] = {
          code,
          definition: p.wasteDef,
          weight: 0,
          count: 0,
        };
      }
      wasteStats[code].weight += p.weight;
      wasteStats[code].count += 1;
    });

    const wasteList = Object.values(wasteStats).sort((a, b) => b.weight - a.weight);

    return {
      year: activeYear,
      minDate,
      maxDate,
      totalDays,
      isFullYear,
      activeMonthsCount,
      totalWeight,
      totalRit,
      totalBilled,
      totalPaid,
      totalOutstanding,
      monthlyBreakdown,
      branchList,
      wasteList,
      pickupsCount: pickupsInYear.length,
      invoicesCount: invoicesInYear.length,
    };
  }, [parsedPickups, parsedInvoices, activeYear]);

  // ==========================================
  // MONTHLY AGGREGATION & CONTINUOUS LIST
  // ==========================================
  const allMonthlyData = useMemo(() => {
    const map = {};

    parsedPickups.forEach((p) => {
      if (!p.monthKey) return;
      if (!map[p.monthKey]) {
        const [y, m] = p.monthKey.split("-");
        const monthIdx = parseInt(m, 10) - 1;
        const yearNum = parseInt(y, 10);
        map[p.monthKey] = {
          monthKey: p.monthKey,
          year: yearNum,
          monthIndex: monthIdx,
          monthName: `${INDO_MONTHS[monthIdx]} ${yearNum}`,
          pickups: [],
          invoices: [],
          dates: [],
        };
      }
      map[p.monthKey].pickups.push(p);
      if (p.date) map[p.monthKey].dates.push(p.date);
    });

    parsedInvoices.forEach((inv) => {
      if (!inv.monthKey) return;
      if (!map[inv.monthKey]) {
        const [y, m] = inv.monthKey.split("-");
        const monthIdx = parseInt(m, 10) - 1;
        const yearNum = parseInt(y, 10);
        map[inv.monthKey] = {
          monthKey: inv.monthKey,
          year: yearNum,
          monthIndex: monthIdx,
          monthName: `${INDO_MONTHS[monthIdx]} ${yearNum}`,
          pickups: [],
          invoices: [],
          dates: [],
        };
      }
      map[inv.monthKey].invoices.push(inv);
      if (inv.date) map[inv.monthKey].dates.push(inv.date);
    });

    const list = Object.values(map).map((item) => {
      const weight = item.pickups.reduce((s, p) => s + p.weight, 0);
      const rit = item.pickups.length;
      const billed = item.invoices.reduce((s, inv) => s + inv.grandTotal, 0);
      const paid = item.invoices.reduce((s, inv) => s + inv.paidAmount, 0);
      const outstanding = Math.max(0, billed - paid);

      let minDate = null;
      let maxDate = null;
      if (item.dates.length > 0) {
        const ts = item.dates.map((d) => d.getTime());
        minDate = new Date(Math.min(...ts));
        maxDate = new Date(Math.max(...ts));
      }

      // Branch breakdown for this month
      const branchSummary = {};
      item.pickups.forEach((p) => {
        const bId = p.branchId || "Lainnya";
        if (!branchSummary[bId]) {
          branchSummary[bId] = {
            id: bId,
            name: p.branchName,
            short: p.branchShort,
            city: p.branchCity,
            weight: 0,
            rit: 0,
          };
        }
        branchSummary[bId].weight += p.weight;
        branchSummary[bId].rit += 1;
      });

      return {
        ...item,
        weight,
        rit,
        billed,
        paid,
        outstanding,
        minDate,
        maxDate,
        branchSummary: Object.values(branchSummary).sort((a, b) => b.weight - a.weight),
        branchCount: Object.keys(branchSummary).length,
      };
    });

    // Sort descending by monthKey (e.g. 2026-03, 2026-02, ...)
    return list.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [parsedPickups, parsedInvoices]);

  // Filtered monthly data for Monthly View
  const filteredMonthlyData = useMemo(() => {
    let result = allMonthlyData;

    if (selectedYear !== null) {
      result = result.filter((m) => m.year === selectedYear);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => {
        const matchName = m.monthName.toLowerCase().includes(q);
        const matchBranch = m.branchSummary.some((b) =>
          b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q)
        );
        const matchInv = m.invoices.some((inv) =>
          inv.id.toLowerCase().includes(q) || inv.periode.toLowerCase().includes(q)
        );
        return matchName || matchBranch || matchInv;
      });
    }

    return result;
  }, [allMonthlyData, selectedYear, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Rekapan & Analitik"
        subtitle="Executive summary dan laporan historis komprehensif pengelolaan limbah B3"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Cetak Laporan / Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        }
      />

      <TabLoader
        loading={loading}
        error={error}
        sessionExpired={sessionExpired}
        timedOut={timedOut}
        reload={reload}
      >
        {/* Navigation / Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("tahunan")}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition ${
                viewMode === "tahunan"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Ringkasan Tahunan</span>
            </button>

            <button
              onClick={() => setViewMode("bulanan")}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition ${
                viewMode === "bulanan"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Ringkasan Bulanan</span>
            </button>
          </div>

          {/* Year Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            <span className="text-[11px] text-slate-500 font-medium px-2 shrink-0">Tahun:</span>
            {availableYears.map((yr) => {
              const isActive = (selectedYear === null ? availableYears[0] : selectedYear) === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums transition shrink-0 ${
                    isActive
                      ? "bg-brand-600 text-white font-semibold shadow-sm"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: RINGKASAN TAHUNAN (YEARLY VIEW)                   */}
        {/* ========================================================= */}
        {viewMode === "tahunan" && (
          <div className="space-y-6">
            {/* Dynamic Date Range Banner */}
            <div className="rounded-xl border border-brand-200 dark:border-brand-900/50 bg-gradient-to-r from-brand-50/70 via-white to-slate-50 dark:from-brand-950/20 dark:via-slate-900 dark:to-slate-900 p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                      Tahun Kalender {yearlyData.year}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        yearlyData.isFullYear
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {yearlyData.isFullYear ? "Data 1 Tahun Penuh" : "Data Berjalan (Parsial)"}
                    </span>
                  </div>
                  <div className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-1.5">
                    <span>Rentang Data Tercatat:</span>
                    <span className="font-mono tabular-nums text-brand-700 dark:text-brand-400 font-bold">
                      {yearlyData.minDate ? formatDateIndoFull(yearlyData.minDate) : "-"}
                    </span>
                    <span className="text-slate-500 font-normal">s/d</span>
                    <span className="font-mono tabular-nums text-brand-700 dark:text-brand-400 font-bold">
                      {yearlyData.maxDate ? formatDateIndoFull(yearlyData.maxDate) : "-"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mencakup <strong className="text-slate-700 dark:text-slate-300 font-mono tabular-nums">{yearlyData.activeMonthsCount} bulan aktif</strong> dengan total <strong className="text-slate-700 dark:text-slate-300 font-mono tabular-nums">{yearlyData.totalDays} hari</strong> aktivitas operasional dan penagihan.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800 text-right">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Total Transaksi</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {yearlyData.totalRit} Rit · {yearlyData.invoicesCount} Inv
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-Line KPI Strip (3 highlight cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Total Berat */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Berat Limbah</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-600 bg-brand-50 dark:bg-brand-600/10">
                    <Scale className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {yearlyData.totalWeight.toLocaleString("id-ID")} <span className="text-xs font-normal text-slate-500">Kg</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                    ≈ {(yearlyData.totalWeight / 1000).toFixed(2)} Ton terangkut
                  </div>
                </div>
              </div>

              {/* Total Rit */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Pengambilan</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {yearlyData.totalRit} <span className="text-xs font-normal text-slate-500">Rit Transaksi</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                    Rata-rata {yearlyData.activeMonthsCount > 0 ? (yearlyData.totalRit / yearlyData.activeMonthsCount).toFixed(1) : 0} rit / bulan
                  </div>
                </div>
              </div>

              {/* Total Tagihan (Invoices) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Nilai Tagihan</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {formatRupiah(yearlyData.totalBilled)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                    Dari {yearlyData.invoicesCount} invoice diterbitkan
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: RINCIAN BULANAN TAHUN INI */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    1. Rincian Performa per Bulan ({yearlyData.year})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Breakdown aktivitas operasional dan penerbitan invoice per bulan berjalan
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {yearlyData.activeMonthsCount} dari 12 Bulan Aktif
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Bulan</th>
                      <th className="py-2.5 px-4 font-semibold">Rentang Tanggal</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Rit</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Berat (Kg)</th>
                      <th className="py-2.5 px-4 font-semibold text-center">Cabang Aktif</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Total Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {yearlyData.monthlyBreakdown.map((m) => {
                      return (
                        <tr
                          key={m.monthIndex}
                          className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                            !m.hasActivity ? "opacity-45" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            {m.monthName}
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono tabular-nums text-[11px]">
                            {m.minDate && m.maxDate
                              ? `${formatDateIndo(m.minDate)} – ${formatDateIndo(m.maxDate)}`
                              : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                            {m.rit > 0 ? `${m.rit} rit` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                            {m.weight > 0 ? `${m.weight.toLocaleString("id-ID")} Kg` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600 dark:text-slate-400">
                            {m.branchCount > 0 ? `${m.branchCount} cabang` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                            {m.billed > 0 ? formatRupiah(m.billed) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Summary Footer */}
                  <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-100">Total Akumulasi {yearlyData.year}</td>
                      <td className="py-3 px-4 font-mono tabular-nums text-[11px] text-slate-500">
                        {yearlyData.minDate && yearlyData.maxDate
                          ? `${formatDateIndo(yearlyData.minDate)} – ${formatDateIndo(yearlyData.maxDate)}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {yearlyData.totalRit} rit
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {yearlyData.totalWeight.toLocaleString("id-ID")} Kg
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">-</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {formatRupiah(yearlyData.totalBilled)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* SECTION 2 & 3: GRID 2 COLUMNS (KONTRIBUSI CABANG & JENIS LIMBAH) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kontribusi Cabang */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-600" />
                      2. Kontribusi per Cabang
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Distribusi berat dan frekuensi pengangkutan per fasilitas
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {yearlyData.branchList.length} Cabang Aktif
                  </span>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Cabang</th>
                        <th className="py-2.5 px-4 font-semibold">Kota</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Rit</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Berat (Kg)</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Porsi (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {yearlyData.branchList.length > 0 ? (
                        yearlyData.branchList.map((b) => {
                          const pct =
                            yearlyData.totalWeight > 0
                              ? ((b.weight / yearlyData.totalWeight) * 100).toFixed(1)
                              : "0.0";
                          return (
                            <tr key={b.branchId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-4">
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{b.short}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{b.branchId}</div>
                              </td>
                              <td className="py-2.5 px-4 text-slate-500">{b.city}</td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                                {b.rit} rit
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                                {b.weight.toLocaleString("id-ID")}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-medium text-brand-600 dark:text-brand-400">
                                {pct}%
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            Belum ada transaksi pengambilan pada tahun {yearlyData.year}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Distribusi Jenis Limbah */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Package className="w-4 h-4 text-brand-600" />
                      3. Distribusi Karakteristik Limbah
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klasifikasi limbah B3 yang berhasil diangkut & dikelola
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {yearlyData.wasteList.length} Jenis Terdata
                  </span>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Kode Limbah</th>
                        <th className="py-2.5 px-4 font-semibold">Deskripsi / Definisi</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Transaksi</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Berat (Kg)</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Porsi (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {yearlyData.wasteList.length > 0 ? (
                        yearlyData.wasteList.map((w) => {
                          const pct =
                            yearlyData.totalWeight > 0
                              ? ((w.weight / yearlyData.totalWeight) * 100).toFixed(1)
                              : "0.0";
                          return (
                            <tr key={w.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-4 font-mono font-semibold text-brand-600 dark:text-brand-400">
                                {w.code}
                              </td>
                              <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate" title={w.definition}>
                                {w.definition}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                                {w.count}x
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                                {w.weight.toLocaleString("id-ID")}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-medium text-brand-600 dark:text-brand-400">
                                {pct}%
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            Belum ada data karakteristik limbah pada tahun {yearlyData.year}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: RINGKASAN BULANAN (MONTHLY VIEW)                  */}
        {/* ========================================================= */}
        {viewMode === "bulanan" && (
          <div className="space-y-4">
            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari bulan, cabang, atau invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Menampilkan <strong className="text-slate-900 dark:text-slate-100 font-bold">{filteredMonthlyData.length}</strong> periode bulan
              </div>
            </div>

            {/* Monthly Cards List */}
            <div className="space-y-3">
              {filteredMonthlyData.length > 0 ? (
                filteredMonthlyData.map((m) => {
                  const isExpanded = !!expandedMonths[m.monthKey];

                  return (
                    <div
                      key={m.monthKey}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition shadow-sm"
                    >
                      {/* Summary Banner Header */}
                      <div
                        onClick={() => toggleMonthExpand(m.monthKey)}
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                              {m.monthName}
                            </h3>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="text-xs font-mono text-slate-500">
                              {m.branchCount} Cabang Aktif
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 font-mono tabular-nums flex items-center gap-1.5">
                            <span>Tercatat:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {m.minDate ? formatDateIndo(m.minDate) : "-"}
                            </span>
                            <span>s/d</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {m.maxDate ? formatDateIndo(m.maxDate) : "-"}
                            </span>
                          </div>
                        </div>

                        {/* Metric summary badges */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                          <div className="text-right">
                            <span className="block text-[10px] uppercase font-semibold text-slate-400">Pengambilan</span>
                            <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
                              {m.rit} Rit
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="block text-[10px] uppercase font-semibold text-slate-400">Total Berat</span>
                            <span className="font-bold tabular-nums text-brand-600 dark:text-brand-400">
                              {m.weight.toLocaleString("id-ID")} Kg
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="block text-[10px] uppercase font-semibold text-slate-400">Nilai Tagihan</span>
                            <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
                              {m.billed > 0 ? formatRupiah(m.billed) : "-"}
                            </span>
                          </div>

                          <div className="pl-2 text-slate-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details Panel */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-4 space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Branch Breakdown for this month */}
                            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                                Rincian Cabang Terlayani
                              </h4>
                              <div className="space-y-1.5">
                                {m.branchSummary.map((b) => (
                                  <div
                                    key={b.id}
                                    className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                  >
                                    <div>
                                      <span className="font-medium text-slate-800 dark:text-slate-200">{b.short}</span>
                                      <span className="text-[10px] text-slate-400 ml-1.5">{b.city}</span>
                                    </div>
                                    <div className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                      <span className="font-semibold">{b.weight.toLocaleString("id-ID")} Kg</span>
                                      <span className="text-slate-400 text-[10px] ml-1.5">({b.rit} rit)</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Invoices in this month */}
                            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                                <Receipt className="w-3.5 h-3.5 text-brand-600" />
                                Invoice & Penagihan Terkait
                              </h4>
                              {m.invoices.length > 0 ? (
                                <div className="space-y-1.5">
                                  {m.invoices.map((inv) => {
                                    return (
                                      <div
                                        key={inv.id}
                                        className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                                      >
                                        <div>
                                          <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{inv.id}</span>
                                          {inv.periode && (
                                            <span className="text-[10px] text-slate-400 ml-2 font-mono">
                                              Periode {inv.periode}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-right font-mono tabular-nums">
                                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                                            {formatRupiah(inv.grandTotal)}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="py-4 text-center text-xs text-slate-400">
                                  Tidak ada invoice diterbitkan untuk periode ini.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  Tidak ditemukan data rekapan bulanan yang cocok dengan pencarian.
                </div>
              )}
            </div>
          </div>
        )}
      </TabLoader>
    </div>
  );
}
