import React from "react";

export default function StatCard({ label, value, sub, icon: Icon, accent = "teal" }) {
  const accentClass = {
    teal: "text-brand-500 bg-brand-50 dark:bg-brand-600/10",
    green: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
    slate: "text-slate-500 bg-slate-100 dark:bg-slate-700/40",
  }[accent];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClass}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}