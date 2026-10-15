import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function SortToggle({ label, active, direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition border ${
        active
          ? "border-brand-300 dark:border-brand-600/30 bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500"
      }`}
    >
      {label}
      {active
        ? (direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)
        : <ArrowUpDown className="w-3 h-3" />}
    </button>
  );
}