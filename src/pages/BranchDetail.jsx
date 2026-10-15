import React, { useMemo } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { COL, parseNum } from "@/lib/sheets";
import { formatKg } from "@/lib/format";
import { useTabData } from "@/lib/usePortalData";
import StatCard from "@/components/portal/StatCard";
import PickupTable from "@/components/portal/PickupTable";
import BranchCharts from "@/components/portal/BranchCharts";
import { EmptyState } from "@/components/portal/Loader";
import TabLoader from "@/components/portal/TabLoader";
import { Truck, Scale, MapPin, ArrowLeft, ExternalLink } from "lucide-react";

export default function BranchDetail() {
  const { session } = useOutletContext();
  const { branchId } = useParams();
  const navigate = useNavigate();
  const id = decodeURIComponent(branchId);

  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData(["branch", "data"], session);
  const branches = values.branch || [];
  const allPickups = values.data || [];

  const branch = branches.find((b) => b[COL.B_ID] === id);
  const pickups = useMemo(() => allPickups.filter((p) => p[COL.D_BRANCH] === id), [allPickups, id]);
  const totalWeight = pickups.reduce((s, p) => s + parseNum(p[COL.D_WEIGHT]), 0);

  return (
    <div>
      <button onClick={() => navigate("/app/cabang")} className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-500 mb-3">
        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Cabang
      </button>

      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        {!branch ? (
          <EmptyState label="Cabang tidak ditemukan." />
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4">
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">{branch[COL.B_SINGKATAN] || branch[COL.B_NAME]}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{branch[COL.B_NAME]}</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-xs">
                <InfoRow icon={MapPin} label="Alamat" value={branch[COL.B_ADDR]} />
                <InfoRow label="Jenis Pelayanan" value={branch[COL.B_JENIS] + ' ' + branch[COL.B_RINCIANPELAYANAN]} />
                <InfoRow label="Frekuensi" value={branch[COL.B_FREKUENSI]} />
                <InfoRow label="Branch ID" value={branch[COL.B_ID]} />
              </div>
              {branch[COL.B_GMAP] && /^https?:/.test(branch[COL.B_GMAP]) && (
                <a href={branch[COL.B_GMAP]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Lihat di Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <StatCard label="Total Pengambilan" value={pickups.length} icon={Truck} accent="green" />
              <StatCard label="Total Berat" value={`${formatKg(Math.round(totalWeight))} Kg`} icon={Scale} />
            </div>

            <BranchCharts pickups={pickups} />

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <PickupTable pickups={pickups} title="Rincian Pengambilan" />
            </div>
          </>
        )}
      </TabLoader>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-slate-400 flex items-center gap-1">{Icon && <Icon className="w-2.5 h-2.5" />}{label}</span>
      <span className="text-slate-700 dark:text-slate-300">{value}</span>
    </div>
  );
}