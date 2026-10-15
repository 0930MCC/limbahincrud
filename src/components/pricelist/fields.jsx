import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Mail } from 'lucide-react';
import { isValidEmail } from '@/lib/validation';

export function FieldLabel({ icon: Icon, required, children }) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
      {required && <span className="text-destructive normal-case">*</span>}
    </span>
  );
}

// Shared "this is missing/invalid" ring — applied on top of the normal `pl-input` look whenever
// a required field is still empty/invalid AFTER the person tried to move on (Next/Send clicked).
// Kept as one constant so every field in the app gets exactly the same red outline treatment.
export const INVALID_RING = 'border-destructive ring-2 ring-destructive/30 focus:ring-destructive/40';

export function Field({ label, icon, required, className = '', invalid, ...props }) {
  return (
    <label className="block">
      <FieldLabel icon={icon} required={required}>{label}</FieldLabel>
      <input
        className={`pl-input ${invalid ? INVALID_RING : ''} ${className}`}
        required={required}
        {...props}
      />
    </label>
  );
}

export function AreaField({ label, icon, required, rows = 3, invalid, className = '', ...props }) {
  return (
    <label className="block">
      <FieldLabel icon={icon} required={required}>{label}</FieldLabel>
      <textarea
        rows={rows}
        className={`pl-input resize-none ${invalid ? INVALID_RING : ''} ${className}`}
        required={required}
        {...props}
      />
    </label>
  );
}

export function SelectField({ label, icon, required, children, invalid, className = '', ...props }) {
  return (
    <label className="block">
      <FieldLabel icon={icon} required={required}>{label}</FieldLabel>
      <select className={`pl-input ${invalid ? INVALID_RING : ''} ${className}`} required={required} {...props}>
        {children}
      </select>
    </label>
  );
}

export function ToggleRow({ checked, onCheckedChange, title, description }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5 shrink-0" />
    </div>
  );
}

export function InfoCard({ children }) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

// Reusable A/B (or more) choice-card group — same visual language as ServiceStep's service
// cards, used throughout the registration/contract wizard (manifest, jenis kontrak, fisik
// kontrak, etc.) so those choices look consistent with the rest of the app.
//
// Clicking the already-active option unselects it (calls onChange('')) — per product requirement
// that every selection in the Pilih Pelayanan / Detil Perusahaan layers can be tapped again to
// clear it. Pass `allowUnselect={false}` for the rare case where a blank value isn't valid.
export function ChoiceCard({ options, value, onChange, allowUnselect = true, invalid }) {
  // `invalid` (nothing picked yet, but a Next/Send was attempted) puts a red ring on every card
  // in the group — there's no single input to outline, so the whole group gets the treatment.
  return (
    <div className={`grid gap-2.5 sm:grid-cols-2 ${invalid ? 'rounded-xl ring-2 ring-destructive/30' : ''}`}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(active && allowUnselect ? '' : opt.id)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              active
                ? 'border-primary bg-primary/5'
                : invalid
                  ? 'border-destructive/60 bg-card hover:border-destructive'
                  : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <p className="text-sm font-bold leading-tight">{opt.label}</p>
            {opt.desc && <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{opt.desc}</p>}
          </button>
        );
      })}
    </div>
  );
}

// Generic "this will email <target>, are you sure?" confirmation — used by the "Kirim Penawaran" and
// "Kirim Draf Kontrak" buttons under the document cards on CustForm.jsx, so the customer always
// sees exactly which address is about to receive the document before it actually sends.
// Confirmation shown before either send action actually sends. Names the destination
// address explicitly, and lets the customer redirect this one send to a different address
// ("Kirim ke email lain") without having to go back and edit their Data Dasar — useful when the
// document needs to reach, say, a finance or procurement mailbox instead.
//
// `onConfirm` receives the address finally chosen, so the caller never has to read this dialog's
// internal state.
export function ConfirmEmailDialog({ open, onOpenChange, email, sending, onConfirm, title, description, confirmLabel }) {
  const [useOther, setUseOther] = React.useState(false);
  const [otherEmail, setOtherEmail] = React.useState('');

  // Reset the override every time the dialog reopens — an address typed for a previous send
  // should never silently carry over into the next one.
  React.useEffect(() => {
    if (open) {
      setUseOther(false);
      setOtherEmail('');
    }
  }, [open]);

  const target = useOther ? otherEmail.trim() : email;
  const targetValid = isValidEmail(target);

  return (
    <Dialog open={open} onOpenChange={(next) => !sending && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} Dokumen akan dikirim ke:{' '}
            <strong className="text-foreground">{target || '-'}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {!useOther ? (
            <button
              type="button"
              onClick={() => setUseOther(true)}
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              Kirim ke email lain
            </button>
          ) : (
            <div className="space-y-1.5">
              <FieldLabel icon={Mail}>Kirim ke email lain</FieldLabel>
              <input
                className="pl-input w-full"
                type="email"
                autoFocus
                placeholder="nama@perusahaan.com"
                value={otherEmail}
                onChange={(e) => setOtherEmail(e.target.value)}
              />
              {otherEmail.trim() && !isValidEmail(otherEmail) && (
                <p className="text-[11px] font-medium text-destructive">Format email belum valid.</p>
              )}
              <button
                type="button"
                onClick={() => {
                  setUseOther(false);
                  setOtherEmail('');
                }}
                className="text-[11px] font-medium text-muted-foreground hover:underline"
              >
                Batal, kirim ke {email || 'email utama'}
              </button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onConfirm(target)} disabled={sending || !targetValid} className="w-full">
            {sending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              confirmLabel || 'Ya, Kirim Sekarang'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// "You have unsaved changes" guard, shown when the back/close control on any layer is pressed.
// Every layer keeps its edits in local state until "Simpan Data" is pressed, so backing out really
// does throw them away — worth one confirmation.
export function ConfirmDiscardDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kembali tanpa menyimpan?</DialogTitle>
          <DialogDescription>
            Perubahan yang belum Anda simpan dengan tombol "Simpan Data" akan hilang. Lanjutkan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" className="w-full" onClick={onConfirm}>
            Ya, Kembali
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SectionTitle({ children, required }) {
  return (
    <p className="font-display text-sm font-bold text-primary">
      {children}
      {required && <span className="text-destructive"> *</span>}
    </p>
  );
}

// Shown while a submission is in flight. Fully blocks interaction (pointer-events + covers the
// whole viewport) so nothing on the form can be changed mid-submit — used by both the quotation
// email popup and the registration submit button.
// Shown while a submission is in flight. Fully blocks interaction (pointer-events + covers the
// whole viewport) so nothing on the form can be changed mid-submit — used by both the quotation
// email popup and the registration submit button. Also carries the "don't refresh" warning
// (see NoRefreshWarning below) right at the one moment it actually matters, since that's also
// exactly when useBeforeUnloadWarning is active and would otherwise pop its own native dialog
// with no visible explanation on screen.
export function LoadingOverlay({ show, message = 'Memproses...' }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-white/70 px-6 text-center backdrop-blur-sm">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />
      <p className="text-sm font-semibold text-foreground">{message}</p>
      <div className="max-w-xs">
        <NoRefreshWarning />
      </div>
    </div>
  );
}

// Shown near the top of long, unsaved forms (the quotation wizard, the registration form) so
// people don't lose their progress by refreshing/closing the tab mid-way — nothing here is saved
// until the final "Kirim" button succeeds.
export function NoRefreshWarning() {
  return (
    <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
      ⚠️ Data belum tersimpan sampai proses selesai — jangan refresh atau tutup halaman ini, isian dapat hilang.
    </p>
  );
}

export function StepIntro({ title, subtitle }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}