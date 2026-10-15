import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, Recycle, Truck, Sparkles, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/portal/PageHeader";

const FEATURES = {
  "limbah-domestik": {
    label: "Limbah Domestik",
    icon: Trash2,
    desc: "Modul pengelolaan limbah domestik sedang kami siapkan.",
  },
  "limbah-ekonomis": {
    label: "Limbah Ekonomis",
    icon: Recycle,
    desc: "Modul pengelolaan limbah ekonomis sedang kami siapkan.",
  },
  logistik: {
    label: "Logistik",
    icon: Truck,
    desc: "Modul logistik & armada sedang kami siapkan.",
  },
};

// `feature` comes from the route element (e.g. <ComingSoon feature="limbah-domestik" /> at
// /app/limbah-domestik/dashboard); the :feature URL param is only a fallback.
export default function ComingSoon({ feature: featureProp }) {
  const params = useParams();
  const feature = featureProp || params.feature;
  const navigate = useNavigate();
  const info = FEATURES[feature] || { label: "Fitur Ini", icon: Sparkles, desc: "Fitur ini sedang kami siapkan." };
  const Icon = info.icon;

  return (
    <div className="max-w-lg">
      <PageHeader title={info.label} subtitle="Segera hadir" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-600/10 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
        </div>
        <span className="text-[10px] font-semibold tracking-wide uppercase bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full mb-3">
          Coming Soon
        </span>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{info.label}</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-xs">{info.desc}</p>
        <button
          onClick={() => navigate("/app/limbahb3/dashboard")}
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Limbah B3
        </button>
      </div>
    </div>
  );
}
