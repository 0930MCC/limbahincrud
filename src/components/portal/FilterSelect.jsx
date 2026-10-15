import React from "react";

// Plain <select> styled to sit next to ClearableInput/SortToggle inside a TableToolbar's `extra`
// slot. `options` is [{ value, label }]; the first entry is expected to be the "all" option.
export default function FilterSelect({ value, onChange, options, ariaLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs px-2.5 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
