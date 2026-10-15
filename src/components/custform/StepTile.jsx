import React from 'react';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';

// One row in the 3-item step list on CustForm.jsx. `summary` is whatever one-line recap of the
// data already saved for this step should show under the title (blank while nothing's filled in
// yet). `locked` disables the tile entirely (with a lock icon) until the step before it is done.
export default function StepTile({ index, title, subtitle, summary, done, locked, onClick }) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-xl border p-4 text-left shadow-sm transition-colors ${
        locked
          ? 'cursor-not-allowed border-border bg-muted/40 opacity-60'
          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
          done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'
        }`}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : index}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="font-display text-sm font-bold leading-tight">{title}</span>
        </span>
        {summary ? (
          // Saved-data recap. Capped at ~5 lines and scrollable inside the tile so a long
          // rincian pelayanan stays fully readable without stretching the list out of shape.
          <span
            className="mt-1 block max-h-[6.5rem] overflow-y-auto whitespace-pre-line text-xs leading-relaxed text-muted-foreground"
          >
            {summary}
          </span>
        ) : (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{subtitle}</span>
        )}
      </span>
      {locked ? (
        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
