import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw, Save, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Stepper from '@/components/pricelist/Stepper';
import { LocationStep, WasteStep } from '@/components/pricelist/LocationWasteStep';
import ServiceStep from '@/components/pricelist/ServiceStep';
import ServiceParams from '@/components/pricelist/ServiceParams';
import QuoteDocument from '@/components/pricelist/QuoteDocument';
import { FieldLabel, StepIntro, LoadingOverlay } from '@/components/pricelist/fields';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import { buildPricelistSummaryText, computeQuote, serviceDefaults } from '@/lib/pricing';
import { getQuotePdfBase64, quotePdfFilename } from '@/lib/pdf';
import { fetchReferralByCode } from '@/lib/remoteConfig';
import { buildReferralQuote } from '@/lib/referralQuote';
import { savePelayanan } from '@/lib/appsScript';
import OverlayLayer from './OverlayLayer';

// Kode Referal is now its OWN first step (ask for a code, or skip), followed by Lokasi and Jenis
// Limbah as separate screens — 6 steps in the normal flow. A valid referral code short-circuits
// straight to Review, since the referral row already fixes location, waste and price.
const TITLES_FULL = ['Kode Referal', 'Lokasi', 'Jenis Limbah', 'Pilih Layanan', 'Parameter Tambahan', 'Review'];
const TITLES_REFERRAL = ['Kode Referal', 'Review'];

const BLANK = { location: '', waste: '', service: '', params: null };

// Step 2 of CustForm.jsx.
//
// Nothing about the wizard is stored besides what "Simpan Data" writes: the finished
// `rincian_pelayanan` text (+ the referral code) and the quotation PDF. So the layer has two modes:
//   'view'   — a pelayanan is already saved (also the case whenever a form is reopened by its ID):
//              shows the saved rincian, with "Mulai Ulang" to run the wizard again.
//   'wizard' — the 6 steps. Always starts blank; the last step's only action is "Simpan Data",
//              which builds the quotation PDF in the browser and sends it, together with the
//              rincian text, to the backend. No email is sent from here — "Kirim Penawaran" lives
//              under the Quotation card on the form page.
export default function PelayananLayer({
  open,
  onClose,
  dataDasar,
  constants,
  content,
  custformId,
  multiplier,
  rincianPelayanan,
  hasQuotation,
  hasContract,
  onSaved,
}) {
  const [mode, setMode] = useState('wizard');
  const [state, setState] = useState(BLANK);
  const [step, setStep] = useState(1);
  // Set the first time "Lanjut" is clicked while the current step isn't done yet — lights up
  // that step's required field(s) in red instead of the button just staying disabled with no
  // explanation. Cleared again whenever the step actually changes.
  const [attempted, setAttempted] = useState(false);
  const [referral, setReferral] = useState('');
  const [referralLookup, setReferralLookup] = useState('idle');
  const [referralRow, setReferralRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  useBeforeUnloadWarning(saving);

  const resetWizard = () => {
    setState(BLANK);
    setReferral('');
    setReferralLookup('idle');
    setReferralRow(null);
    setStep(1);
    setAttempted(false);
    setSaveError('');
  };

  useEffect(() => {
    if (!open) return;
    resetWizard();
    setMode(rincianPelayanan ? 'view' : 'wizard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const showAll = referral.trim().toUpperCase() === 'MCC';

  useEffect(() => {
    const trimmed = referral.trim();
    if (!trimmed || showAll) {
      setReferralLookup('idle');
      setReferralRow(null);
      return undefined;
    }
    let cancelled = false;
    setReferralLookup('checking');
    const t = setTimeout(async () => {
      const res = await fetchReferralByCode(trimmed);
      if (cancelled) return;
      if (res.status === 'ok') {
        setReferralRow(res.data);
        setReferralLookup('found');
      } else if (res.status === 'not-found') {
        setReferralRow(null);
        setReferralLookup('notfound');
      } else {
        setReferralRow(null);
        setReferralLookup('error');
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [referral, showAll]);

  const referralFound = referralLookup === 'found' && !!referralRow;
  const referralChecking = referral.trim() !== '' && !showAll && (referralLookup === 'checking' || referralLookup === 'idle');
  const referralError = referral.trim() !== '' && !showAll && (referralLookup === 'notfound' || referralLookup === 'error');
  // Empty (= skip), the special MCC code, or a code that was actually found. Anything else blocks
  // "Lanjut" until it is fixed or cleared.
  const referralOk = referral.trim() === '' || showAll || referralFound;

  const referralQuote = useMemo(
    () => (referralFound ? buildReferralQuote(referralRow, multiplier) : null),
    [referralFound, referralRow, multiplier]
  );
  const quote = useMemo(
    () => (!referralFound ? computeQuote(state, constants, content, multiplier, showAll) : null),
    [referralFound, state, constants, content, multiplier, showAll]
  );
  const activeQuote = referralFound ? referralQuote : quote;

  const totalSteps = referralFound ? 2 : 6;
  const titles = referralFound ? TITLES_REFERRAL : TITLES_FULL;

  const paramsDone =
    showAll ||
    (!!state.params &&
      (state.service === 'SPK'
        ? state.params.needContract != null
        : state.service === 'PTPB'
          ? !!(state.params.option && state.params.monthly != null && state.params.visits != null)
          : state.service === 'RUTIN'
            ? state.params.kg != null
            : true));

  const done = referralFound
    ? [true, true]
    : [referralOk && !referralChecking, !!state.location, !!state.waste, !!state.service, paramsDone, true];

  const patch = (p) => setState((s) => ({ ...s, ...p }));
  const handlers = {
    location: (location) => patch({ location, waste: '', service: '', params: null }),
    waste: (waste) => patch({ waste, service: '', params: null }),
    service: (service) => setState((s) => ({ ...s, service, params: showAll ? null : serviceDefaults(service, s.location, content) })),
    params: (params) => patch({ params }),
  };

  // "Simpan Data": rincian text + quotation PDF -> backend. Closes the layer on success.
  const handleSave = async () => {
    if (!activeQuote || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const rincian = buildPricelistSummaryText(activeQuote).trim();
      if (!rincian) throw new Error('Rincian pelayanan belum terisi. Periksa kembali pilihan layanan Anda.');

      const pdfBase64 = getQuotePdfBase64(activeQuote, {
        name: dataDasar.companyName,
        contact: dataDasar.companyName,
        phone: dataDasar.companyPhone,
        address: '',
      });
      const res = await savePelayanan({
        custformId,
        // Only a code that actually matched (or the special MCC code) is stored.
        referralCode: referralFound || showAll ? referral.trim() : '',
        rincianPelayanan: rincian,
        pdfBase64,
        filename: quotePdfFilename(activeQuote),
      });
      onSaved(res.row);
      onClose();
    } catch (err) {
      setSaveError(err?.message || 'Gagal menyimpan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Step 1 — Kode Referal (or skip).
  const referralStep = (
    <div className="space-y-5">
      <StepIntro
        title="Kode Referal"
        subtitle="Punya kode referal? Masukkan di sini untuk penawaran khusus. Jika tidak, lewati saja."
      />
      <div>
        <FieldLabel icon={Ticket}>Kode Referal</FieldLabel>
        <input
          className={`pl-input ${attempted && !done[0] ? 'border-destructive ring-2 ring-destructive/30' : ''}`}
          placeholder="Kosongkan jika tidak ada"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
        />
        {referralChecking ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Memeriksa kode referal...
          </p>
        ) : referralFound ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Kode referal ditemukan — lanjut untuk melihat penawaran khusus Anda.
          </p>
        ) : referralError ? (
          <p className="mt-1.5 text-[11px] font-medium text-destructive">
            {referralLookup === 'error'
              ? 'Kode referal belum bisa diperiksa saat ini. Coba lagi, atau kosongkan kolom ini untuk melewati.'
              : 'Kode referal tidak ditemukan. Perbaiki kodenya, atau kosongkan kolom ini untuk melewati.'}
          </p>
        ) : (
          <p className="mt-1.5 text-[11px] text-muted-foreground">Isi Kode Referal Anda untuk fitur tambahan.</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setReferral('');
          setAttempted(false);
          setStep(2);
        }}
        className="text-xs font-semibold text-primary hover:underline"
      >
        Tidak punya kode referal — lewati →
      </button>
    </div>
  );

  const locationStep = (
    <LocationStep
      location={state.location}
      onLocation={handlers.location}
      content={content}
      invalid={attempted && !state.location}
    />
  );

  const wasteStep = (
    <WasteStep waste={state.waste} onWaste={handlers.waste} content={content} invalid={attempted && !state.waste} />
  );

  const willReplace = hasQuotation || hasContract;
  const reviewStep = (
    <div className="space-y-4">
      <StepIntro title="Review" subtitle="Periksa dokumen price list Anda, lalu tekan Simpan Data." />
      <QuoteDocument
        quote={activeQuote}
        company={{ name: dataDasar.companyName, address: '', contact: dataDasar.companyName, phone: dataDasar.companyPhone }}
      />
    </div>
  );

  const fullStepContent = [
    referralStep,
    locationStep,
    wasteStep,
    <ServiceStep
      key="s"
      location={state.location}
      waste={state.waste}
      service={state.service}
      onService={handlers.service}
      content={content}
      invalid={attempted && !state.service}
    />,
    showAll ? (
      <div key="p" className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm text-foreground">
        <p className="font-display font-bold">Kode Referal</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Masukan Kode</p>
      </div>
    ) : state.service ? (
      <div key="p" className="space-y-2">
        <ServiceParams
          service={state.service}
          waste={state.waste}
          location={state.location}
          params={state.params}
          onChange={handlers.params}
          constants={constants}
          content={content}
        />
        {attempted && !done[4] && (
          <p className="text-[11px] font-medium text-destructive">Lengkapi parameter yang diperlukan terlebih dahulu.</p>
        )}
      </div>
    ) : (
      <div key="p" className="rounded-lg border border-dashed border-border bg-background p-6 text-center text-xs text-muted-foreground">
        Pilih layanan terlebih dahulu.
      </div>
    ),
    reviewStep,
  ];

  const stepContent = referralFound ? [referralStep, reviewStep] : fullStepContent;

  // ---- View mode: a pelayanan is already saved ------------------------------------------------
  if (mode === 'view') {
    return (
      <OverlayLayer
        open={open}
        onClose={onClose}
        confirmOnClose={false}
        title="Pilih Pelayanan"
        subtitle="Langkah 2 dari 3 — Tersimpan"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Tutup
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                resetWizard();
                setMode('wizard');
              }}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Mulai Ulang
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <StepIntro
            title="Rincian Pelayanan & Harga"
            subtitle="Ini pelayanan yang sudah tersimpan untuk formulir Anda."
          />
          <div className="whitespace-pre-line rounded-xl border border-border bg-card p-5 text-xs leading-relaxed text-foreground shadow-sm">
            {rincianPelayanan}
          </div>
          <p className="rounded-lg border border-border bg-background p-3.5 text-[11px] leading-relaxed text-muted-foreground">
            Ingin mengubahnya? Tekan <strong className="text-foreground">Mulai Ulang</strong> untuk memilih pelayanan dari
            awal. Setelah Anda menyimpan yang baru, Quotation diganti
            {hasContract ? ' dan Draf Kontrak yang sudah dibuat dihapus (simpan ulang Detil Perusahaan untuk membuatnya lagi)' : ''}.
          </p>
        </div>
      </OverlayLayer>
    );
  }

  // ---- Wizard mode ----------------------------------------------------------------------------
  return (
    <OverlayLayer
      open={open}
      onClose={onClose}
      title="Pilih Pelayanan"
      subtitle={`Langkah 2 dari 3 — ${titles[step - 1]}`}
      footer={
        step < totalSteps ? (
          // "Lanjut" is never `disabled` — clicking it while something required is missing marks
          // the step "attempted" (red outline on the missing field) instead of silently doing nothing.
          <div className="space-y-2">
            {attempted && !done[step - 1] && (
              <p className="text-center text-[11px] font-medium text-destructive">
                {step === 1
                  ? 'Perbaiki kode referal, atau kosongkan untuk melewati.'
                  : 'Lengkapi bagian yang bertanda merah di atas sebelum lanjut.'}
              </p>
            )}
            <div className="flex items-stretch gap-3">
              <Button
                variant="outline"
                className="h-12 flex-1 text-sm"
                disabled={step === 1}
                onClick={() => {
                  setAttempted(false);
                  setStep(step - 1);
                }}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Kembali
              </Button>
              <Button
                className="h-12 flex-[2] text-sm"
                onClick={() => {
                  if (!done[step - 1]) {
                    setAttempted(true);
                    return;
                  }
                  setAttempted(false);
                  setStep(step + 1);
                }}
              >
                {step === 1 && referral.trim() === '' ? 'Lewati' : 'Lanjut'}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {saveError && <p className="text-center text-[11px] font-medium text-destructive">{saveError}</p>}
            {willReplace && (
              <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                Menyimpan akan mengganti Quotation yang sudah ada
                {hasContract ? ' dan menghapus Draf Kontrak yang sudah dibuat (simpan ulang Detil Perusahaan untuk membuatnya lagi)' : ''}.
              </p>
            )}
            <Button className="w-full" onClick={handleSave} disabled={!activeQuote || saving}>
              <Save className="mr-1.5 h-4 w-4" />
              {saving ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
            <button
              type="button"
              onClick={() => {
                setAttempted(false);
                setStep(step - 1);
              }}
              className="block w-full text-center text-[11px] font-medium text-muted-foreground hover:underline"
            >
              <ArrowLeft className="mr-1 inline h-3 w-3" />
              Kembali ke langkah sebelumnya
            </button>
          </div>
        )
      }
    >
      <LoadingOverlay show={saving} message="Menyimpan & membuat PDF penawaran..." />
      <div className="mb-5 hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:block">
        <Stepper
          current={step}
          done={done}
          onJump={(n) => {
            setAttempted(false);
            setStep(n);
          }}
          titles={titles}
        />
      </div>
      {stepContent[step - 1]}
    </OverlayLayer>
  );
}
