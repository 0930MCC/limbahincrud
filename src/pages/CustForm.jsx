import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Copy, Check, FilePlus2, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import StepTile from '@/components/custform/StepTile';
import DataDasarLayer from '@/components/custform/DataDasarLayer';
import PelayananLayer from '@/components/custform/PelayananLayer';
import PerusahaanLayer, { REGISTRATION_INITIAL_FORM } from '@/components/custform/PerusahaanLayer';
import DocumentCards from '@/components/custform/DocumentCards';
import { LoadingOverlay, ConfirmEmailDialog } from '@/components/pricelist/fields';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import { parseRateMultiplier } from '@/lib/paramRule';
import { useSettings } from '@/settings/SettingsContext';
import { saveDataDasar, sendQuotation, sendContract, fetchCustform } from '@/lib/appsScript';
import {
  newCustformState, mapRowToState, dataDasarComplete,
  dataDasarSummary, pelayananSummary, perusahaanSummary, buildDocumentList,
} from '@/lib/custform';
import { getAppSearchParams } from '@/lib/urlParams';
import { buildWhatsAppLink } from '@/lib/contactConfig';
import { buildQuotationWhatsAppMessage, buildRegistrationWhatsAppMessage } from '@/lib/waMessages';
import { quotationEmailLimiter, registrationEmailLimiter, formatWaitTime } from '@/lib/rateLimiter';
import { formatDateDMY } from '@/lib/contractDates';
import { LOGO_BADGE_PNG } from '@/assets/logoBadgeBase64.js';
import TopBar from '@/components/portal/TopBar';

// Single page — one tab, three steps shown as a list of tiles. Each tile opens a full-screen
// layer ON TOP of this page (not a route change — see OverlayLayer.jsx), so nothing is ever lost
// switching between them.
//
// URL shape: /custform?id=&config=&rate=
//   id     — OPTIONAL. An existing custform row's id (6-char, all-caps). When present it wins
//            outright: `config` and `rate` are read FROM THAT ROW, and neither is asked for (any
//            config/rate also sitting in the URL is overwritten to match the stored row). This is
//            what the "Ubah / Lengkapi Data Saya" button in every email links to.
//   config — the `pricelist_configs` row to price against. MANDATORY when there's no `id`.
//   rate   — the price multiplier, must start with "r" (see lib/paramRule.js). MANDATORY when
//            there's no `id`.
// With no `id`, whichever of config/rate is missing gets an inline input on the gate below; the
// other is carried through untouched.
// Public URL the "Salin URL" button hands out after a save. Must match the deployed route and
// the EDIT_LINK_BASE in google-apps-script/Code.gs, so a link copied here and a link from an
// email land in exactly the same place.
// The app runs on BrowserRouter now (see App.jsx) — plain paths, no "#/" segment. Code.gs's
// EDIT_LINK_BASE must be updated to match (drop its own "#/") the next time it's deployed, or
// its emailed links will point at a path this app no longer serves under.
export const CUSTFORM_PUBLIC_BASE = 'https://www.mediacahayacerah.com/custform';

export default function CustForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Router-agnostic: under HashRouter the query string lives in the hash, not in
  // window.location.search. See lib/urlParams.js.
  const urlParams = getAppSearchParams();
  const idParam = urlParams.get('id') || '';
  const configParam = urlParams.get('config') || '';
  const rateParam = urlParams.get('rate') || '';

  // The whole page is one flat row's worth of state (see lib/custform.js#mapRowToState). It is only
  // ever replaced by what the backend hands back after a save/send, so what's on screen is what's
  // stored.
  const [state, setState] = useState(newCustformState());
  const custformId = state.custformId;
  const [rowStatus, setRowStatus] = useState(idParam ? 'loading' : 'none'); // loading | found | notfound | none
  const [openLayer, setOpenLayer] = useState(null); // 'dataDasar' | 'pelayanan' | 'perusahaan' | null
  const [savedId, setSavedId] = useState(''); // drives the "first save" success dialog
  const [confirmDialog, setConfirmDialog] = useState(null); // 'buatBaru' | null
  const [emailTarget, setEmailTarget] = useState(null); // 'quotation' | 'contract' | null
  const [sendingEmail, setSendingEmail] = useState(false);
  useBeforeUnloadWarning(sendingEmail);
  // Id of the row `state` currently reflects — stops the ?id= effect below from re-fetching a row
  // this page just created or saved itself.
  const loadedIdRef = useRef('');

  const applyRow = (row) => {
    const mapped = mapRowToState(row);
    loadedIdRef.current = mapped.custformId;
    setState(mapped);
    return mapped;
  };

  // ---- ?id= prefill: fetch the row, then adopt ITS config/rate --------------------------------
  useEffect(() => {
    if (!idParam || idParam.toUpperCase() === loadedIdRef.current) return undefined;
    let cancelled = false;
    fetchCustform(idParam).then((row) => {
      if (cancelled) return;
      if (!row) {
        setRowStatus('notfound');
        return;
      }
      const mapped = applyRow(row);
      setRowStatus('found');
      // Push the row's own config/rate onto the URL, since useSettings() and the gate below both
      // read straight off window.location.search. This is what makes `id` alone sufficient.
      const next = getAppSearchParams();
      if (mapped.meta.configName) next.set('config', mapped.meta.configName);
      if (mapped.meta.rate) next.set('rate', mapped.meta.rate);
      navigate({ pathname: '/custform', search: next.toString() }, { replace: true });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  const { constants, content, loading, error, configName } = useSettings();

  // What actually gets stored on the row: the URL's ?config= when given, otherwise the name of
  // whichever config Supabase resolved as active. Storing the resolved name (rather than an empty
  // string) is what lets a later ?id= visit reprice against the same config it was quoted on.
  const effectiveConfigName = configParam || configName || '';

  // ---- config / rate gate (only when there's no id) -------------------------------------------
  const multiplier = parseRateMultiplier(rateParam);
  const rateOk = multiplier != null;
  const configOk = !!configParam.trim();
  // A row that's still loading, or that loaded successfully, supplies both itself — don't gate.
  const idSupplies = !!idParam && rowStatus !== 'notfound';
  const needsGate = !idSupplies && (!rateOk || !configOk);

  const [gateConfig, setGateConfig] = useState(configParam);
  const [gateRate, setGateRate] = useState(rateParam);
  const [gateTouched, setGateTouched] = useState(false);
  // "existing" (enter an ID) is the default — see the gate's comment below.
  const [gateTab, setGateTab] = useState('existing');
  const [gateId, setGateId] = useState('');

  const handleGateIdSubmit = () => {
    setGateTouched(true);
    const id = gateId.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(id)) return;
    // Only `id` goes on the URL — config/rate are then read off the row itself.
    navigate({ pathname: '/custform', search: new URLSearchParams({ id }).toString() });
    window.location.reload(); // re-run the ?id= prefill effect from a clean state
  };

  const handleGateSubmit = () => {
    setGateTouched(true);
    const nextConfig = configOk ? configParam : gateConfig.trim();
    const nextRate = rateOk ? rateParam : gateRate.trim();
    if (!nextConfig || !parseRateMultiplier(nextRate)) return;
    const next = getAppSearchParams();
    next.set('config', nextConfig);
    next.set('rate', nextRate);
    navigate({ pathname: '/custform', search: next.toString() }, { replace: true });
  };

  // ---- step completeness / locking ------------------------------------------------------------
  // Step 1 counts as done once it has been SAVED (the row, and its id, exist) — every later step
  // writes to that row.
  const dataDasarDone = dataDasarComplete(state.dataDasar) && !!custformId;
  const pelayananDone = !!state.rincianPelayanan;
  const perusahaanDone = !!state.registration?.instructionCode;

  const documents = buildDocumentList(state.documents);
  const hasQuotation = !!state.documents.quotationPdfUrl;
  const hasContract = documents.some((d) => d.kind === 'contract');

  // ---- layer callbacks --------------------------------------------------------------------------
  // Each layer's "Simpan Data" talks to the backend itself and reports the saved row back here.
  // The backend also deletes any file the change made stale (see Code.gs), so the row that comes
  // back — and therefore the cards below — is already correct.
  const handleDataDasarSave = async (form) => {
    const wasNew = !custformId;
    const res = await saveDataDasar({
      custformId: custformId || undefined,
      configName: effectiveConfigName,
      rate: rateParam,
      dataDasar: form,
    });
    applyRow(res.row);
    if (wasNew) {
      const next = getAppSearchParams();
      next.set('id', res.id);
      navigate({ pathname: '/custform', search: next.toString() }, { replace: true });
      setSavedId(res.id); // opens the success dialog below
    }
  };

  const handlePelayananSaved = (row) => {
    applyRow(row);
    toast({
      title: 'Pelayanan tersimpan',
      description: 'PDF penawaran sudah dibuat. Gunakan tombol "Kirim Penawaran" di bawah dokumen untuk mengirimnya ke email.',
    });
  };

  const handleRegistrationSaved = (row, failures) => {
    const mapped = applyRow(row);
    const madeCount = Object.keys(mapped.documents.contractPdfUrls).length;
    if (failures.length) {
      toast({
        title: madeCount ? 'Sebagian dokumen gagal dibuat' : 'Data tersimpan, tetapi dokumen gagal dibuat',
        description: failures.map((f) => `${f.docType}: ${f.error}`).join(' • '),
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Detil Perusahaan tersimpan',
        description: 'Draf kontrak sudah dibuat. Gunakan tombol "Kirim Draf Kontrak" di bawah dokumen untuk mengirimnya ke email.',
      });
    }
  };

  // "Buat Baru" — a clean form carrying over the SAME config/rate currently in effect (which,
  // when an id was loaded, means the ones stored on that row). Deliberately drops `id` so the
  // next save creates a new row rather than overwriting the one just finished.
  const handleBuatBaru = () => {
    const next = new URLSearchParams();
    if (configParam) next.set('config', configParam);
    if (rateParam) next.set('rate', rateParam);
    loadedIdRef.current = '';
    setState(newCustformState());
    setRowStatus('none');
    setOpenLayer(null);
    navigate({ pathname: '/custform', search: next.toString() }, { replace: true });
  };

  // ---- email buttons (under the document cards) ----------------------------------------------------
  const limiterFor = (kind) => (kind === 'quotation' ? quotationEmailLimiter : registrationEmailLimiter);

  const openEmailDialog = (kind) => {
    const limiter = limiterFor(kind);
    if (!limiter.canSend()) {
      toast({
        title: 'Batas pengiriman tercapai',
        description: `Maksimal 3 kali per 30 menit. Coba lagi dalam ${formatWaitTime(limiter.msUntilNext())}.`,
        variant: 'destructive',
      });
      return;
    }
    setEmailTarget(kind);
  };

  // WhatsApp message to CS, opened right after a successful send (same as before, minus the
  // separate "success screen" — the page itself now shows what was sent and when).
  const openWhatsApp = (kind, emailTo, row) => {
    const fresh = mapRowToState(row);
    const company = {
      name: fresh.dataDasar.companyName,
      contact: fresh.dataDasar.companyName,
      phone: fresh.dataDasar.companyPhone,
    };
    const message =
      kind === 'quotation'
        ? buildQuotationWhatsAppMessage({
            company,
            rincianPelayanan: fresh.rincianPelayanan,
            email: emailTo,
            custformId: fresh.custformId,
          })
        : buildRegistrationWhatsAppMessage({
            company,
            rincianPelayanan: fresh.rincianPelayanan,
            custformId: fresh.custformId,
            email: emailTo,
            registration: {
              ...(fresh.registration || {}),
              namaPerusahaan: fresh.dataDasar.companyName,
              telpPerusahaan: fresh.dataDasar.companyPhone,
              emailPerusahaan: fresh.dataDasar.companyEmail,
              tanggalMulaiKontrak: formatDateDMY(fresh.registration?.tanggalMulaiKontrak),
            },
          });
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  const handleConfirmSend = async (emailTo) => {
    const kind = emailTarget;
    if (!kind || sendingEmail) return;
    setSendingEmail(true);

    let res;
    try {
      res = await (kind === 'quotation' ? sendQuotation : sendContract)({ custformId, emailTo });
    } catch (err) {
      toast({
        title: kind === 'quotation' ? 'Gagal mengirim penawaran' : 'Gagal mengirim draf kontrak',
        description: err?.message || 'Silakan coba lagi.',
        variant: 'destructive',
      });
      setSendingEmail(false);
      return;
    }

    // The email is out at this point. Everything below is follow-up UI and must never be reported
    // as a send failure.
    limiterFor(kind).recordSend();
    applyRow(res.row);
    setEmailTarget(null);
    setSendingEmail(false);
    toast({
      title: kind === 'quotation' ? 'Penawaran terkirim' : 'Draf kontrak terkirim',
      description: `Dikirim ke ${emailTo}. Cek juga folder SPAM/Promosi jika belum muncul dalam beberapa menit.`,
    });
    try {
      openWhatsApp(kind, emailTo, res.row);
    } catch (waErr) {
      console.warn('WhatsApp link gagal dibuat (email sudah terkirim):', waErr);
    }
  };

  // ---- gates ------------------------------------------------------------------------------------
  if (loading || rowStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (error && !needsGate) {
    const messages = {
      'not-configured': 'Supabase belum terhubung ke aplikasi ini.',
      'no-active-row': 'Tidak ada konfigurasi pricelist yang aktif di Supabase (atau nama config pada tautan tidak ditemukan).',
      error: `Gagal memuat data dari Supabase: ${error.message || 'terjadi kesalahan.'}`,
    };
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center font-body text-foreground">
        <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-11 w-auto object-contain" />
        <div className="mt-5 flex items-center gap-2 text-destructive">
          <FileQuestion className="h-5 w-5" />
          <p className="font-display text-lg font-bold">Data pricelist tidak tersedia</p>
        </div>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{messages[error.status] || messages.error}</p>
      </div>
    );
  }

  if (needsGate) {
    const gateIdValid = /^[A-Z0-9]{6}$/.test(gateId.trim().toUpperCase());
    const configReady = configOk || gateConfig.trim();
    const rateReady = rateOk || parseRateMultiplier(gateRate);

    return (
      <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
        <TopBar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-11 w-auto object-contain" />
          <p className="font-display text-lg font-bold">Customer Form</p>

          {rowStatus === 'notfound' && (
            <p className="max-w-sm text-center text-sm text-destructive">
              ID formulir pada tautan ini tidak ditemukan. Cek kembali ID Anda, atau buat formulir baru.
            </p>
          )}

          {/* ID-first: most people arriving here without URL parameters are coming back to a form
            they already started (from the ID in their email), so "Lanjutkan" is the default tab.
            Creating a new form needs the config + rate pair, which only CS hands out. */}
          <div className="w-full max-w-xs space-y-4">
            <div className="flex rounded-lg border border-border bg-card p-1">
              {[
                { id: 'existing', label: 'Lanjutkan' },
                { id: 'new', label: 'Buat Baru' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setGateTab(t.id)}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${gateTab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {gateTab === 'existing' ? (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-foreground">ID Formulir</label>
                <input
                  className="pl-input w-full uppercase tracking-widest"
                  placeholder="mis. A1B2C3"
                  maxLength={6}
                  value={gateId}
                  onChange={(e) => setGateId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleGateIdSubmit()}
                />
                <p className="text-[11px] text-muted-foreground">
                  6 karakter, ada di email penawaran/kontrak Anda atau pada tombol "Ubah / Lengkapi Data Saya".
                </p>
                {gateTouched && !gateIdValid && (
                  <p className="text-[11px] font-medium text-destructive">ID harus 6 karakter huruf/angka.</p>
                )}
                <Button type="button" className="w-full" onClick={handleGateIdSubmit}>
                  Lanjutkan
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {!configOk && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-foreground">Nama Config Pricelist</label>
                    <input
                      className="pl-input w-full"
                      placeholder="mis. default"
                      value={gateConfig}
                      onChange={(e) => setGateConfig(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGateSubmit()}
                    />
                    {gateTouched && !gateConfig.trim() && (
                      <p className="text-[11px] font-medium text-destructive">Nama config wajib diisi.</p>
                    )}
                  </div>
                )}

                {!rateOk && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-foreground">Rate</label>
                    <input
                      className="pl-input w-full"
                      placeholder="mis. r15"
                      value={gateRate}
                      onChange={(e) => setGateRate(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGateSubmit()}
                    />
                    {gateTouched && !parseRateMultiplier(gateRate) && (
                      <p className="text-[11px] font-medium text-destructive">
                        Harus diawali huruf "r" diikuti angka (mis. "r15").
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full"
                  onClick={handleGateSubmit}
                  disabled={!configReady || !rateReady}
                >
                  Mulai Formulir Baru
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  Config dan rate diberikan oleh CS LIMBAHIN.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- main page ---------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <LoadingOverlay show={sendingEmail} message="Mengirim email..." />

      <TopBar />
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-8 w-auto shrink-0 object-contain" />
          <div>
            <p className="font-display text-base font-bold tracking-tight text-primary">LIMBAHIN</p>
            <p className="text-[11px] text-muted-foreground">Customer Form</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <CustformIdBanner custformId={custformId || (rowStatus === 'notfound' ? idParam : '')} rowStatus={rowStatus} />

        <div className="space-y-3">
          <StepTile
            index={1}
            title="Data Dasar"
            subtitle="Nama perusahaan, email, dan nomor telepon."
            summary={dataDasarSummary(state.dataDasar)}
            done={dataDasarDone}
            locked={false}
            onClick={() => setOpenLayer('dataDasar')}
          />
          <StepTile
            index={2}
            title="Pilih Pelayanan (Buat Penawaran & Daftar Harga)"
            subtitle="Kode referal, lokasi, jenis limbah, layanan, dan parameter harga."
            summary={pelayananSummary(state.rincianPelayanan)}
            done={pelayananDone}
            locked={!dataDasarDone}
            onClick={() => dataDasarDone && setOpenLayer('pelayanan')}
          />
          <StepTile
            index={3}
            title="Detil Perusahaan (Buat Draf Kontrak)"
            subtitle="Data pendaftaran untuk draf kontrak/MOU."
            summary={perusahaanSummary(state.registration)}
            done={perusahaanDone}
            locked={!pelayananDone}
            onClick={() => pelayananDone && setOpenLayer('perusahaan')}
          />
        </div>

        {/* No document = no card = no email button. */}
        <DocumentCards
          documents={documents}
          quotationSentAt={state.meta.quotationSentAt}
          contractSentAt={state.meta.contractSentAt}
          onSendQuotation={() => openEmailDialog('quotation')}
          onSendContract={() => openEmailDialog('contract')}
        />

        <div className="mt-8 space-y-2">
          {/* Every step saves itself ("Simpan Data" inside each layer), so the only page-level
              action left is starting over. It confirms first since it drops the form from screen
              (what's already saved stays safe under its ID). */}
          <Button
            type="button"
            className="w-full bg-primary/15 text-primary hover:bg-primary/25"
            onClick={() => setConfirmDialog('buatBaru')}
          >
            <FilePlus2 className="mr-1.5 h-4 w-4" />
            Buat Baru
          </Button>
        </div>
      </main>

      <Dialog open={confirmDialog === 'buatBaru'} onOpenChange={(o) => !o && setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat form baru?</DialogTitle>
            <DialogDescription>
              Halaman ini akan diganti dengan form kosong. Data yang sudah tersimpan tetap aman di ID sebelumnya
              {custformId ? ` (${custformId})` : ''} dan bisa dibuka kembali lewat tautannya.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setConfirmDialog(null)}>
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => {
                setConfirmDialog(null);
                handleBuatBaru();
              }}
            >
              Ya, Buat Baru
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataDasarLayer
        open={openLayer === 'dataDasar'}
        initial={state.dataDasar}
        hasQuotation={hasQuotation}
        hasContract={hasContract}
        onClose={() => setOpenLayer(null)}
        onSave={handleDataDasarSave}
      />

      <PelayananLayer
        open={openLayer === 'pelayanan'}
        onClose={() => setOpenLayer(null)}
        dataDasar={state.dataDasar}
        constants={constants}
        content={content}
        custformId={custformId}
        multiplier={multiplier}
        rincianPelayanan={state.rincianPelayanan}
        hasQuotation={hasQuotation}
        hasContract={hasContract}
        onSaved={handlePelayananSaved}
      />

      <PerusahaanLayer
        open={openLayer === 'perusahaan'}
        onClose={() => setOpenLayer(null)}
        initial={state.registration || REGISTRATION_INITIAL_FORM}
        dataDasar={state.dataDasar}
        rincianPelayanan={state.rincianPelayanan}
        custformId={custformId}
        hasQuotation={hasQuotation}
        onSaved={handleRegistrationSaved}
        onRequestEditPelayanan={() => setOpenLayer('pelayanan')}
      />

      {/* Same confirm-the-destination dialog for both send buttons (with "Kirim ke email lain"). */}
      <ConfirmEmailDialog
        open={!!emailTarget}
        onOpenChange={(o) => !o && setEmailTarget(null)}
        email={state.dataDasar.companyEmail}
        sending={sendingEmail}
        onConfirm={handleConfirmSend}
        title={emailTarget === 'contract' ? 'Kirim Draf Kontrak ke Email' : 'Kirim Penawaran ke Email'}
        description={
          emailTarget === 'contract'
            ? 'Draf dokumen kontrak yang sudah dibuat akan dikirimkan.'
            : 'PDF penawaran yang sudah dibuat akan dikirimkan.'
        }
        confirmLabel={
          <>
            <Send className="mr-1.5 h-4 w-4" />
            Ya, Kirim Sekarang
          </>
        }
      />

      <SaveSuccessDialog savedId={savedId} onClose={() => setSavedId('')} />
    </div>
  );
}

// Shown once, right after the FIRST "Simpan Data" (Data Dasar) creates the row: confirms it is
// stored, shows the id, and offers the link that reopens the page at ?id=<id> — the same URL the
// email's edit button uses.
function SaveSuccessDialog({ savedId, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = savedId ? `${CUSTFORM_PUBLIC_BASE}?id=${savedId}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (older browser or non-secure origin) — the URL is printed in
      // full below, so it can still be selected and copied by hand.
    }
  };

  return (
    <Dialog open={!!savedId} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Data Tersimpan
          </DialogTitle>
          <DialogDescription>
            Data Anda sudah tersimpan dengan ID Formulir{' '}
            <strong className="font-display tracking-widest text-foreground">{savedId}</strong>. Simpan tautan di
            bawah untuk membuka dan mengubah data ini kapan saja.
          </DialogDescription>
        </DialogHeader>

        <p className="break-all rounded-lg border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
          {url}
        </p>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Tutup
          </Button>
          <Button className="w-full" onClick={handleCopy}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? 'Tersalin' : 'Salin URL'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Shown at the very top once there's something worth referencing again — either an id from the
// URL (a saved/emailed submission being reopened) or one just handed back by "Simpan Data" /
// a first save.
function CustformIdBanner({ custformId, rowStatus }) {
  const [copied, setCopied] = useState(false);
  if (!custformId) return null;

  const handleCopy = async () => {
    try {
      // Copies the full shareable URL (mediacahayacerah.com/custform?id=...) rather than just
      // the bare ID, so pasting it anywhere (WA, email) is a working link, same as the
      // post-save success dialog below.
      await navigator.clipboard.writeText(`${CUSTFORM_PUBLIC_BASE}?id=${custformId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (older browser, or a non-secure origin) — the id is printed
      // right there anyway, so there's nothing useful to report.
    }
  };

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">ID Formulir Anda</p>
        <p className="font-display text-lg font-bold tracking-widest text-primary">{custformId}</p>
        {rowStatus === 'notfound' && (
          <p className="mt-0.5 text-[11px] text-destructive">ID ini tidak ditemukan — mulai dari awal di bawah.</p>
        )}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-card px-3 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Tersalin' : 'Salin'}
      </button>
    </div>
  );
}
