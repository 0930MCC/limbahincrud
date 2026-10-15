import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ConfirmDiscardDialog } from '@/components/pricelist/fields';
import { LOGO_BADGE_PNG } from '@/assets/logoBadgeBase64.js';

// A full-screen layer that opens ON TOP of CustForm.jsx (fixed positioning — nothing here is a
// route change, so whatever's underneath is untouched and instantly there again once this
// closes). `footer` is rendered sticky at the bottom for the layer's action buttons (Pilih Data /
// Kirim Email, etc.) so they're always reachable without scrolling to the very end.
//
// The single back arrow is the ONLY way out (no duplicate close X — it did the same thing), and
// it asks for confirmation first, since a layer's edits live in local state until "Pilih Data" is
// pressed. Pass `confirmOnClose={false}` to skip that prompt — used right after a successful
// save/send, where there's nothing left to lose.
export default function OverlayLayer({ open, onClose, title, subtitle, children, footer, confirmOnClose = true }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => (confirmOnClose ? setConfirmOpen(true) : onClose())}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-6 w-auto shrink-0 object-contain" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold leading-tight text-foreground">{title}</p>
          {subtitle && <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-2xl">{children}</div>
      </div>

      {footer && (
        <div className="shrink-0 border-t border-border bg-card px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
          <div className="mx-auto max-w-2xl">{footer}</div>
        </div>
      )}

      <ConfirmDiscardDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
