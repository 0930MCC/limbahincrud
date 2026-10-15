import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import ClearableInput from "./ClearableInput";
import SortToggle from "./SortToggle";

export default function TableToolbar({
  shownCount,
  totalCount,
  itemLabel = "data",
  search,
  onSearchChange,
  searchPlaceholder = "Cari...",
  sorts = [],
  sortValue,
  onSortChange,
  sortOptions = [],
  extra = null,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
      <span className="text-[10px] text-slate-400">
        {shownCount} dari {totalCount} {itemLabel}
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {extra}

        {onSearchChange && (
          <ClearableInput
            icon={Search}
            value={search}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="w-40 sm:w-48"
          />
        )}

        {/* Minimalistic unified Sort Dropdown if sortValue/sortOptions provided */}
        {sortOptions.length > 0 && onSortChange ? (
          <div className="relative">
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-10 pl-8 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          sorts.map((s) => (
            <SortToggle
              key={s.key}
              label={s.label}
              active={s.active}
              direction={s.direction}
              onClick={s.onClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
