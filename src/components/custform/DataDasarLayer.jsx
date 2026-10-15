import React, { useState } from 'react';
import { Building2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, StepIntro, LoadingOverlay } from '@/components/pricelist/fields';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import { normalizeIndoPhone } from '@/lib/phone';
import { isValidEmail, isValidIndoPhone } from '@/lib/validation';
import OverlayLayer from './OverlayLayer';

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
const digits = (s) => String(s ?? '').replace(/[^\d]/g, '');

// Step 1. "Simpan Data" writes straight to the row (the FIRST save is what creates it and hands
// out the ID Formulir). `onSave(form)` is async and throws on failure — the message is shown here.
//
// `hasQuotation` / `hasContract`: whether a Quotation / contract documents already exist. Changing
// the company name or phone makes the quotation PDF and the contract documents stale, and changing
// the email makes the contract documents stale — the server deletes whatever no longer matches, so
// this layer says so up front instead of surprising anyone.
export default function DataDasarLayer({ open, initial, hasQuotation, hasContract, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  useBeforeUnloadWarning(saving);

  // Reset to whatever's currently saved every time the layer is (re)opened, so a close-without-
  // saving never leaves stray edits lying around in local state.
  React.useEffect(() => {
    if (open) {
      setForm(initial);
      setAttempted(false);
      setSaveError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setPhone = (key) => (e) => setForm((f) => ({ ...f, [key]: normalizeIndoPhone(e.target.value) }));

  // Phone fields auto-insert "+62 " on focus, so `.trim()` alone would treat a merely-clicked
  // field as filled. Validate the actual content instead — see lib/validation.js.
  const emailValid = isValidEmail(form.companyEmail);
  const phoneValid = isValidIndoPhone(form.companyPhone);
  const complete = !!(form.companyName.trim() && emailValid && phoneValid);

  const nameOrPhoneChanged =
    norm(form.companyName) !== norm(initial.companyName) || digits(form.companyPhone) !== digits(initial.companyPhone);
  const emailChanged = norm(form.companyEmail) !== norm(initial.companyEmail);
  const willDeleteQuotation = hasQuotation && nameOrPhoneChanged;
  const willDeleteContract = hasContract && (nameOrPhoneChanged || emailChanged);

  const handleSave = async () => {
    setAttempted(true);
    if (!complete || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setSaveError(err?.message || 'Gagal menyimpan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <OverlayLayer
      open={open}
      onClose={onClose}
      title="Data Dasar"
      subtitle="Langkah 1 dari 3"
      footer={
        <div className="space-y-2">
          {saveError && <p className="text-center text-[11px] font-medium text-destructive">{saveError}</p>}
          {attempted && !complete && (
            <p className="text-center text-[11px] font-medium text-destructive">
              Lengkapi semua field wajib bertanda merah sebelum lanjut.
            </p>
          )}
          {(willDeleteQuotation || willDeleteContract) && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              Perubahan ini akan menghapus{' '}
              {[willDeleteQuotation && 'Quotation', willDeleteContract && 'Draf Kontrak'].filter(Boolean).join(' dan ')}{' '}
              yang sudah dibuat, karena isinya tidak lagi sesuai. Anda perlu menyimpan ulang langkah terkait.
            </p>
          )}
          <Button type="button" className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </div>
      }
    >
      <LoadingOverlay show={saving} message="Menyimpan data..." />
      <div className="space-y-4">
        <StepIntro
          title="Data Dasar"
          subtitle="Data ini akan digunakan pada penawaran maupun draf kontrak Anda — bisa diubah lagi kapan saja."
        />
        <Field
          label="Nama Perusahaan"
          icon={Building2}
          value={form.companyName}
          onChange={set('companyName')}
          placeholder="PT Contoh Sejahtera"
          required
          invalid={attempted && !form.companyName.trim()}
        />
        <Field
          label="Email Perusahaan"
          icon={Mail}
          type="email"
          value={form.companyEmail}
          onChange={set('companyEmail')}
          placeholder="nama@perusahaan.com"
          required
          invalid={attempted && !emailValid}
        />
        {form.companyEmail.trim() && !emailValid && (
          <p className="-mt-2 text-[11px] font-medium text-destructive">Format email belum valid.</p>
        )}
        <Field
          label="Nomor Telepon / WhatsApp"
          icon={Phone}
          type="tel"
          value={form.companyPhone}
          onChange={setPhone('companyPhone')}
          onFocus={() => {
            if (!form.companyPhone) setForm((f) => ({ ...f, companyPhone: '+62 ' }));
          }}
          placeholder="+62 812-3456-7890"
          required
          invalid={attempted && !phoneValid}
        />
        {form.companyPhone.trim() && !phoneValid && (
          <p className="-mt-2 text-[11px] font-medium text-destructive">
            Nomor belum lengkap — minimal 6 angka setelah +62.
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          Nomor ini juga menjadi No. Telp Perusahaan pada draf kontrak.
        </p>
      </div>
    </OverlayLayer>
  );
}
