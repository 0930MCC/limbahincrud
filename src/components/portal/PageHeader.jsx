import React from "react";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}