import React, { useState, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { COL } from "@/lib/sheets";
import { parseDate, formatDateShort } from "@/lib/format";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import WaButton from "@/components/portal/WaButton";
import SortToggle from "@/components/portal/SortToggle";
import ClearableInput from "@/components/portal/ClearableInput";
import { EmptyState } from "@/components/portal/Loader";
import TabLoader from "@/components/portal/TabLoader";
import { FileText, ChevronRight, CalendarDays, Minimize2, Search } from "lucide-react";

function extendedBadge(val) {
  const v = (val || "").trim().toLowerCase();
  const isLatest = v === "latest";
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${isLatest
      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
      : v && v !== "not latest"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}>
      {val && val.trim() ? val.trim() : "-"}
    </span>
  );
}

function MouCard({ mou, onClick, expired }) {
  return (
    <button onClick={onClick} className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-brand-400 hover:shadow-sm transition group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${expired ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-brand-50 dark:bg-brand-600/10 text-brand-500"}`}>
          <FileText className="w-4 h-4" />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500" />
      </div>
      <div className="mt-3 font-semibold text-sm text-slate-900 dark:text-slate-100">{mou[COL.M_NICK] || mou[COL.M_NAME]}</div>
      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mou[COL.M_JENIS]} - {mou[COL.M_DAERAH]}</div>
      <div className="flex items-center gap-1 text-xs text-slate-400 mt-2.5">
        <CalendarDays className="w-3 h-3" /> {formatDateShort(mou[COL.M_START])} — {formatDateShort(mou[COL.M_END])}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
        <span className="font-medium">Is Extended:</span> {extendedBadge(mou[COL.M_EXTENDED])}
      </div>
    </button>
  );
}

export default function Mou({ office = false }) {
  // @ts-ignore
  const { session } = useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [sortDir, setSortDir] = useState(null); // null | "asc" | "desc"
  const [search, setSearch] = useState("");
  const initialLimit = office ? 10 : 9999;
  const [limit, setLimit] = useState(initialLimit);

  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("mou", session);
  const mous = values.mou || [];

  const {
    active,
    expiring,
    telahdiperpanjang,
    tidakdiperpanjang,
    unknown,
  } = useMemo(() => {
    const active = [];
    const expiring = [];
    const telahdiperpanjang = [];
    const tidakdiperpanjang = [];
    const unknown = [];

    mous.forEach((m) => {
      const status = String(m[COL.M_STATUS_EXPIRY] || "").trim().toUpperCase();

      switch (status) {

        case "EXPIRED - EXTENDED":
          telahdiperpanjang.push(m);
          break;

        case "EXPIRED - NOT EXTENDED":
          tidakdiperpanjang.push(m);
          break;

        case "ACTIVE":
          active.push(m);
          break;

        case "EXPIRING":
          expiring.push(m);
          break;


        default:
          unknown.push(m);
          break;
      }
    });

    return {
      active,
      expiring,
      telahdiperpanjang,
      tidakdiperpanjang,
      unknown,
    };
  }, [mous]);

  // const { active, expiring, telahdiperpanjang, tidakdiperpanjang, unknown } = useMemo(() => {
  //   const now = new Date();
  //   const twoMonthsLater = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 60);
  //   // new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  //   const active = [], expiring = [], expired = [], unknown = [];
  //   data.mous.forEach((m) => {
  //     const rawEnd = m[COL.M_END];
  //     const endDate = parseDate(rawEnd);
  //     if (!endDate) {
  //       // Can't parse date — don't classify as kedaluwarsa
  //       unknown.push(m);
  //     } else if (endDate >= now && endDate <= twoMonthsLater) {
  //       expiring.push(m);
  //     } else if (endDate < now) {
  //       expired.push(m);
  //     } else {
  //       active.push(m);
  //     }
  //   });
  //   return { active, expiring, expired, unknown };
  // }, [data.mous]);



  const tabs = [
    { key: "active", label: `Aktif (${active.length})` },
    { key: "expiring", label: `Akan Jatuh Tempo (${expiring.length})` },
    { key: "tidakdiperpanjang", label: `Expired Belum Diperpanjang (${tidakdiperpanjang.length})` },
    { key: "telahdiperpanjang", label: `Expired Telah Diperpanjang (${telahdiperpanjang.length})` },
    { key: "unknown", label: `Unknown (${unknown.length})` },
  ];

  const listMap = { active, expiring, tidakdiperpanjang, telahdiperpanjang, unknown };
  const list = listMap[tab];

  const searched = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((m) =>
      String(m[COL.M_ID] || "").toLowerCase().includes(q) ||
      String(m[COL.M_NAME] || "").toLowerCase().includes(q) ||
      String(m[COL.M_NICK] || "").toLowerCase().includes(q) ||
      String(m[COL.M_DAERAH] || "").toLowerCase().includes(q)
    );
  }, [list, search]);

  const sorted = useMemo(() => {
    if (!sortDir) return searched;
    return [...searched].sort((a, b) => {
      const da = parseDate(a[COL.M_END]);
      const db = parseDate(b[COL.M_END]);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return sortDir === "asc" ? da.getTime() - db.getTime() : db.getTime() - da.getTime();
    });
  }, [searched, sortDir]);

  const shown = sorted.slice(0, limit);

  const toggleSort = () => {
    setSortDir((d) => (d === null ? "desc" : d === "desc" ? "asc" : null));
  };

  return (
    <div>
      <PageHeader
        title={office ? "Service & MOU" : "MOU & Service"}
        subtitle="Daftar kontrak layanan pengelolaan limbah"
        action={<WaButton code="BTN11" label="Tambah Pelayanan" message="Halo, saya ingin menambahkan pelayanan/service baru." />}
      />
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setLimit(initialLimit); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${tab === t.key
                ? "bg-brand-600 text-white"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <ClearableInput
            icon={Search}
            value={search}
            onChange={(v) => { setSearch(v); setLimit(initialLimit); }}
            placeholder="Cari MOU ID / Nama Customer / Lokasi..."
            className="w-48 sm:w-56"
          />
          <SortToggle label="Urut: Date End" active={sortDir !== null} direction={sortDir || "desc"} onClick={toggleSort} />
        </div>
      </div>
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        {list.length === 0 ? (
          <EmptyState label="Tidak ada data untuk filter ini." />
        ) : searched.length === 0 ? (
          <EmptyState label={`Tidak ada hasil untuk "${search}".`} />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shown.map((m) => (
                <MouCard
                  key={m[COL.M_ID]}
                  mou={m}
                  expired={tab === "expired"}
                  onClick={() => navigate(`${office ? "/app/service" : "/app/mou"}/${encodeURIComponent(m[COL.M_ID])}`)}
                />
              ))}
            </div>
            {office && (
              <div className="flex justify-center gap-2 mt-4">
                {limit < sorted.length && (
                  <button
                    onClick={() => setLimit((l) => l + 15)}
                    className="px-4 py-1.5 text-xs font-medium rounded-lg border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-600/10 transition"
                  >
                    Muat lagi
                  </button>
                )}
                {limit > initialLimit && (
                  <button
                    onClick={() => setLimit(initialLimit)}
                    className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <Minimize2 className="w-3 h-3" /> Ciutkan
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </TabLoader>
    </div>
  );
}