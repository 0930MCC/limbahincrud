import React from "react";
import { Search } from "lucide-react";
import ClearableInput from "./ClearableInput";
import SortToggle from "./SortToggle";

// Universal search + sort + count bar used above every portal table, so every
// table (Pickup, Invoice, BA, Komisi, Perizinan, ...) looks and behaves the
// same way instead of each having its own one-off layout.
//
// sorts: [{ key, label, active, direction, onClick }]
export default function TableToolbar({
  shownCount,
  totalCount,
  itemLabel = "data",
  search,
  onSearchChange,
  searchPlaceholder = "Cari...",
  sorts = [],
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
        {sorts.map((s) => (
          <SortToggle
            key={s.key}
            label={s.label}
            active={s.active}
            direction={s.direction}
            onClick={s.onClick}
          />
        ))}
      </div>
    </div>
  );
}
