import React from "react";

// Shared "spreadsheet" scroll container used by every portal data table.
// - Vertical: body scrolls after ~20 rows (max-h below), header stays pinned.
// - Horizontal: each table defines its own <colgroup> with a fixed width per
//   column (table-fixed), so the table's total width can exceed the
//   container on narrow screens and the whole grid scrolls sideways instead
//   of columns disappearing behind responsive "hidden" classes.
export default function TableScrollShell({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-[720px] ${className}`}
    >
      {children}
    </div>
  );
}
