import React, { useEffect, useState } from 'react';
import {
  Building2, MapPin, Phone, Mail, User, Briefcase, CalendarDays,
  ExternalLink, PlusCircle, X, ArrowLeft, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, AreaField, ChoiceCard, SectionTitle, StepIntro, LoadingOverlay } from '@/components/pricelist/fields';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import { normalizeIndoPhone } from '@/lib/phone';
import { isValidEmail, isValidIndoPhone } from '@/lib/validation';
import { saveRegistration } from '@/lib/appsScript';
import { addYearsAsDate, formatDateDMY, formatDateLong, todayInputValue } from '@/lib/contractDates';
import OverlayLayer from './OverlayLayer';

const INSTRUCTION_CODE_OPTIONS = [
  { id: 'PKSTJS', label: 'PKSTJS', desc: 'Membuat: SPK + PKS Jasa (TJS)' },
  { id: 'PKSTPA', label: 'PKSTPA', desc: 'Membuat: SPK + PKS TPA' },
  { id: 'PKSPLIB', label: 'PKSPLIB', desc: 'Membuat: SPK + PKS Limbah B3 (PLIB)' },
  { id: 'PKSB', label: 'PKSB', desc: 'Membuat: PKSB saja' },
  { id: 'SPK', label: 'SPK', desc: 'Membuat: SPK saja' },
];
const KNOWN_INSTRUCTION_CODES = INSTRUCTION_CODE_OPTIONS.map((o) => o.id);

// Company name / email / phone are NOT part of this form — they live in Data Dasar and are edited
// here through the `company` copy below (the phone is the SAME field as Data Dasar's, which is the
// contract's "No. Telp Perusahaan").
export const REGISTRATION_INITIAL_FORM = {
  npwp: '',
  industriBidang: '',
  alamatLimbah: '',
  alamatDokumen: '', // only asked when the contract is printed (fisikKontrak = 'cetak')
  pjNama: '',
  pjJabatan: '',
  manifestPilihan: '',
  showPicOperasional: false,
  picOperasionalNama: '',
  picOperasionalTel: '',
  showPicKeuangan: false,
  picKeuanganNama: '',
  picKeuanganTel: '',
  fisikKontrak: '',
  instructionCode: '',
  tanggalMulaiKontrak: '',
  durasiKontrakTahun: '',
};

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
const digitsOf = (s) => String(s ?? '').replace(/[^\d]/g, '');

// Step 3 of CustForm.jsx — sections, in order: Formulir Pendaftaran (info) -> Rincian Pelayanan ->
// Perusahaan -> Manifest -> Penanggung Jawab (PJ + PIC merged) -> Kontrak (tanggal & durasi +
// fisik + kode instruksi). The only action is "Simpan Data": it writes the row and generates the
// contract documents server-side. Emailing them is the "Kirim Draf Kontrak" button under the
// contract cards on the form page.
//
// `rincianPelayanan` is the text saved by step 2 (this step is locked until it exists). `initial`
// is the saved registration (or REGISTRATION_INITIAL_FORM). `company` is a local editable copy of
// Data Dasar — the parent only changes when the save comes back.
export default function PerusahaanLayer({
  open,
  onClose,
  initial,
  dataDasar,
  rincianPelayanan,
  custformId,
  hasQuotation,
  onSaved,
  onRequestEditPelayanan,
}) {
  const [form, setForm] = useState({ ...REGISTRATION_INITIAL_FORM, ...initial });
  const [company, setCompany] = useState(dataDasar);
  // Set the first time "Simpan Data" is clicked with something still missing — from that point
  // on, every required field/card that's still empty gets a red outline (see the
  // `invalid={attempted && !...}` props below) so it's obvious what to fix.
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  useBeforeUnloadWarning(saving);

  useEffect(() => {
    if (!open) return;
    setForm({ ...REGISTRATION_INITIAL_FORM, ...initial });
    setCompany(dataDasar);
    setAttempted(false);
    setSaveError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setPhone = (key) => (e) => setForm((f) => ({ ...f, [key]: normalizeIndoPhone(e.target.value) }));

  const removePic = (kind) => {
    if (kind === 'operasional') {
      setForm((f) => ({ ...f, showPicOperasional: false, picOperasionalNama: '', picOperasionalTel: '' }));
    } else {
      setForm((f) => ({ ...f, showPicKeuangan: false, picKeuanganNama: '', picKeuanganTel: '' }));
    }
  };

  const instructionCodeValid = KNOWN_INSTRUCTION_CODES.includes(form.instructionCode.trim().toUpperCase());
  // Durasi is a free "how many years" number — any whole number of years, 1 or more. The end date
  // is always start date + N years, minus 1 day (see lib/contractDates.js's addYearsAsDate).
  const durasiValid = Number.isInteger(Number(form.durasiKontrakTahun)) && Number(form.durasiKontrakTahun) >= 1;
  const tanggalAkhirKontrakIso = addYearsAsDate(form.tanggalMulaiKontrak, form.durasiKontrakTahun);

  // Changing name/phone here changes Data Dasar, which makes an existing Quotation stale.
  const companyChangesQuotation =
    norm(company.companyName) !== norm(dataDasar.companyName) ||
    digitsOf(company.companyPhone) !== digitsOf(dataDasar.companyPhone);

  const requiredOk =
    !!rincianPelayanan &&
    company.companyName.trim() &&
    form.alamatLimbah.trim() &&
    form.industriBidang.trim() &&
    // Phone/email are content-validated, not just non-empty — the phone field auto-fills "+62 "
    // on focus, so a merely-clicked field would otherwise count as filled. See lib/validation.js.
    isValidIndoPhone(company.companyPhone) &&
    isValidEmail(company.companyEmail) &&
    form.pjNama.trim() &&
    form.pjJabatan.trim() &&
    form.manifestPilihan &&
    form.fisikKontrak &&
    form.tanggalMulaiKontrak &&
    durasiValid &&
    form.instructionCode.trim();

  // Both PIC blocks are optional on the form, but the contract templates and the stored row always
  // need SOMEONE in those slots. When either is left blank, the (mandatory) penanggung jawab
  // utama / company phone stands in.
  const picFallback = () => ({
    picOperasionalNama: form.picOperasionalNama.trim() || form.pjNama,
    picOperasionalTel: form.picOperasionalTel.trim() || company.companyPhone,
    picKeuanganNama: form.picKeuanganNama.trim() || form.pjNama,
    picKeuanganTel: form.picKeuanganTel.trim() || company.companyPhone,
  });

  // Dates go to the backend as dd/mm/yyyy — the format the sheet and the contract templates use.
  const buildRegistrationPayload = () => ({
    npwp: form.npwp,
    industriBidang: form.industriBidang,
    alamatLimbah: form.alamatLimbah,
    alamatDokumen: form.fisikKontrak === 'cetak' ? form.alamatDokumen : '',
    pjNama: form.pjNama,
    pjJabatan: form.pjJabatan,
    manifestPilihan: form.manifestPilihan,
    ...picFallback(),
    fisikKontrak: form.fisikKontrak,
    instructionCode: form.instructionCode.trim().toUpperCase(),
    tanggalMulaiKontrak: formatDateDMY(form.tanggalMulaiKontrak),
    durasiKontrakTahun: form.durasiKontrakTahun,
    tanggalAkhirKontrak: formatDateDMY(tanggalAkhirKontrakIso),
  });

  // "Simpan Data" can't run with required data missing — clicking it then just marks the form
  // "attempted" (which lights up every empty required field in red) instead of saving.
  const handleSave = async () => {
    setAttempted(true);
    if (!requiredOk || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await saveRegistration({
        custformId,
        dataDasar: company,
        registration: buildRegistrationPayload(),
      });
      onSaved(res.row, res.failures || []);
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
      title="Detil Perusahaan"
      subtitle="Langkah 3 dari 3"
      footer={
        <div className="space-y-2">
          {saveError && <p className="text-center text-[11px] font-medium text-destructive">{saveError}</p>}
          {!requiredOk && attempted && rincianPelayanan && (
            <p className="text-center text-[11px] font-medium text-destructive">
              Lengkapi semua field wajib bertanda merah sebelum menyimpan.
            </p>
          )}
          <Button type="button" onClick={handleSave} disabled={!rincianPelayanan || saving} className="w-full">
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Draf kontrak dibuat otomatis saat disimpan. Untuk mengirimnya ke email, gunakan tombol{' '}
            <strong>Kirim Draf Kontrak</strong> di bawah dokumen pada halaman formulir.
          </p>
        </div>
      }
    >
      <LoadingOverlay show={saving} message="Menyimpan & membuat draf kontrak..." />
      <div className="space-y-6">
        {!rincianPelayanan && (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Belum ada harga terpilih. Selesaikan langkah <strong>Pilih Pelayanan</strong> terlebih dahulu, atau
              masukkan <strong>Kode Referal</strong> di sana.
            </p>
            <Button type="button" size="sm" variant="outline" onClick={onRequestEditPelayanan} className="shrink-0">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Ke Pilih Pelayanan
            </Button>
          </div>
        )}

        {/* Formulir Pendaftaran */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
          <StepIntro
            title="Formulir Pendaftaran"
            subtitle="Halo Pelanggan LIMBAHIN MCC, kami menggunakan kontrak elektronik melalui Mekari."
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Kontrak elektronik itu sama ya, bermaterai juga (materai elektronik) dan dianggap sebagai dokumen resmi.
            Untuk diawal, jika tidak punya akun Mekari, maka harus registrasi dulu ya — namun untuk selanjutnya
            tinggal pakai, jadi menjadi sangat simpel dan mudah (bisa digunakan untuk vendor lain juga).
          </p>
          <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
            <li>• Silakan download aplikasi Mekari jika tanda tangan melalui HP (akan lebih mudah).</li>
            <li>• Silakan siapkan logo instansi/perusahaan/merek untuk diupload menjadi bentuk ttd.</li>
            <li>
              • Jika suatu saat kontrak elektronik tidak diterima, LIMBAHIN akan bertanggung jawab melalui 2
              alternatif: (1) mencoba meyakinkan dan membuktikan bahwa dokumen tersebut valid, atau (2) mencetak
              dokumen fisik dari dokumen yang dimaksud tanpa biaya tambahan.
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-medium">
            <a href="https://www.youtube.com/watch?v=6Z1e1g8wGSU&t=2s" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Video Tutorial Mekari
            </a>
            <a href="https://drive.google.com/file/d/1qdDfMOLmvMEugvDXUzTyQ4dphWdRu-o1/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Formulir Pendaftaran (PDF)
            </a>
          </div>
        </div>

        {/* Rincian Pelayanan */}
        {rincianPelayanan && (
          <div className="space-y-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>Rincian Pelayanan &amp; Harga</SectionTitle>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestEditPelayanan();
                }}
                className="shrink-0 text-[11px] font-semibold text-primary hover:underline"
              >
                Ubah Pelayanan
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Ini akan menjadi rincian layanan yang tercantum di dalam kontrak/PKS Anda. Mohon dicek kembali sebelum
              mengirim.
            </p>
            <div className="whitespace-pre-line rounded-lg border border-border bg-background p-4 text-xs leading-relaxed text-foreground">
              {rincianPelayanan}
            </div>
          </div>
        )}

        {/* Perusahaan */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionTitle>Perusahaan</SectionTitle>
          <Field
            label="Nama Perusahaan"
            icon={Building2}
            value={company.companyName}
            onChange={(e) => setCompany((c) => ({ ...c, companyName: e.target.value }))}
            required
            invalid={attempted && !company.companyName.trim()}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="NPWP & Kode Faktur" value={form.npwp} onChange={set('npwp')} placeholder="Kosongkan jika belum ada" />
            <Field
              label="Industri & Bidang"
              icon={Briefcase}
              value={form.industriBidang}
              onChange={set('industriBidang')}
              required
              invalid={attempted && !form.industriBidang.trim()}
            />
          </div>
          <AreaField
            label="Alamat Limbah (jika ada beberapa lokasi, sebutkan semua)"
            icon={MapPin}
            rows={2}
            value={form.alamatLimbah}
            onChange={set('alamatLimbah')}
            required
            invalid={attempted && !form.alamatLimbah.trim()}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="No. Telp Perusahaan (usahakan WA & tidak berubah)"
              icon={Phone}
              value={company.companyPhone}
              onChange={(e) => setCompany((c) => ({ ...c, companyPhone: normalizeIndoPhone(e.target.value) }))}
              onFocus={() => {
                if (!company.companyPhone) setCompany((c) => ({ ...c, companyPhone: '+62 ' }));
              }}
              placeholder="+62 812-3456-7890"
              required
              invalid={attempted && !isValidIndoPhone(company.companyPhone)}
            />
            <Field
              label="Email Perusahaan (dokumen softcopy dikirim ke sini)"
              icon={Mail}
              type="email"
              value={company.companyEmail}
              onChange={(e) => setCompany((c) => ({ ...c, companyEmail: e.target.value }))}
              required
              invalid={attempted && !isValidEmail(company.companyEmail)}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Nama, email, dan nomor telepon ini sama dengan Data Dasar — mengubahnya di sini juga mengubah Data Dasar.
            {hasQuotation && companyChangesQuotation && (
              <span className="font-semibold text-amber-700">
                {' '}Perubahan nama/telepon akan menghapus Quotation yang sudah dibuat.
              </span>
            )}
          </p>
        </div>

        {/* Manifest */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionTitle required>Manifest / Festronik</SectionTitle>
          <ChoiceCard
            value={form.manifestPilihan}
            onChange={(v) => setForm((f) => ({ ...f, manifestPilihan: v }))}
            invalid={attempted && !form.manifestPilihan}
            options={[
              { id: 'manifest', label: 'A. Saya hanya ingin menggunakan manifest.' },
              { id: 'festronik', label: 'B. Saya menggunakan Festronik.', desc: 'Aplikasi resmi KLHK untuk pelaporan limbah (perlu NIB).' },
            ]}
          />
          {form.manifestPilihan === 'festronik' && (
            <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground">Persyaratan Akun Festronik</p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>NIB/OSS & akses login ke OSS.id</li>
                <li>Dokumen Izin Lingkungan (opsional)</li>
                <li>Diagram operasional (opsional)</li>
              </ul>
              <div className="flex flex-wrap gap-3 pt-1 font-medium">
                <a href="https://youtu.be/u10GCVAxKjI?si=LVPwn1EMNwgqmA8h" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> Tutorial Setup & Registrasi
                </a>
                <a href="https://youtu.be/FEeUnZMsTt4?si=z3imFuocRcvjoXay" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> Tutorial Input Data
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Penanggung Jawab (PJ utama + PIC tambahan merged) */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionTitle required>Penanggung Jawab</SectionTitle>
          <p className="text-[11px] text-muted-foreground">Penanggung Jawab Utama — biasanya anggota direksi, yang menyetujui.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap" icon={User} value={form.pjNama} onChange={set('pjNama')} required invalid={attempted && !form.pjNama.trim()} />
            <Field label="Jabatan" icon={Briefcase} value={form.pjJabatan} onChange={set('pjJabatan')} required invalid={attempted && !form.pjJabatan.trim()} />
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-[11px] font-semibold text-foreground">PIC Tambahan (opsional)</p>
            <p className="text-[11px] text-muted-foreground">Tidak perlu diisi jika sama dengan Penanggung Jawab Utama.</p>

            {!form.showPicOperasional ? (
              <button type="button" onClick={() => setForm((f) => ({ ...f, showPicOperasional: true }))} className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <PlusCircle className="h-3.5 w-3.5" /> Tambah PIC Operasional (penjadwalan & lapangan)
              </button>
            ) : (
              <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-foreground">PIC Operasional</p>
                  <button type="button" onClick={() => removePic('operasional')} className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                    <X className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nama PIC Operasional" value={form.picOperasionalNama} onChange={set('picOperasionalNama')} />
                  <Field label="Tel/WA PIC Operasional" value={form.picOperasionalTel} onChange={setPhone('picOperasionalTel')} placeholder="+62 812-3456-7890" />
                </div>
              </div>
            )}

            {!form.showPicKeuangan ? (
              <button type="button" onClick={() => setForm((f) => ({ ...f, showPicKeuangan: true }))} className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <PlusCircle className="h-3.5 w-3.5" /> Tambah PIC Keuangan (penagihan)
              </button>
            ) : (
              <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-foreground">PIC Keuangan</p>
                  <button type="button" onClick={() => removePic('keuangan')} className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                    <X className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nama PIC Keuangan" value={form.picKeuanganNama} onChange={set('picKeuanganNama')} />
                  <Field label="Tel/WA PIC Keuangan" value={form.picKeuanganTel} onChange={setPhone('picKeuanganTel')} placeholder="+62 812-3456-7890" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kontrak — tanggal & durasi, fisik kontrak, kode instruksi */}
        <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionTitle required>Kontrak</SectionTitle>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-foreground">Tanggal &amp; Durasi Kontrak</p>
            <p className="text-[11px] text-muted-foreground">
              Tanggal mulai berlaku (biasanya tanggal tanda tangan) dan lama kontrak — tanggal akhir dihitung otomatis.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Tanggal Mulai Kontrak"
                icon={CalendarDays}
                type="date"
                value={form.tanggalMulaiKontrak}
                onChange={set('tanggalMulaiKontrak')}
                min={todayInputValue()}
                required
                invalid={attempted && !form.tanggalMulaiKontrak}
              />
              {/* Free-form, not a fixed 1/2/3-year dropdown — any whole number of years is fine.
                  The end date always follows the same rule: start date + N years, minus 1 day. */}
              <Field
                label="Durasi Kontrak (tahun)"
                icon={CalendarDays}
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="mis. 2"
                value={form.durasiKontrakTahun}
                onChange={set('durasiKontrakTahun')}
                required
                invalid={attempted && !durasiValid}
              />
            </div>
            {form.durasiKontrakTahun && !durasiValid && (
              <p className="text-[11px] font-medium text-destructive">Durasi harus angka bulat, minimal 1 tahun.</p>
            )}
            {form.tanggalMulaiKontrak && durasiValid && (
              <p className="text-[11px] font-medium text-foreground">
                Tanggal akhir kontrak: <span className="text-primary">{formatDateLong(tanggalAkhirKontrakIso) || '-'}</span>
              </p>
            )}
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-[11px] leading-relaxed text-amber-800">
              <span className="font-semibold">Catatan: </span>
              Jika layanan Anda menggunakan skema Paket Tahunan (PTPB) atau biaya kontrak lainnya yang dihitung per
              tahun, memilih durasi lebih dari 1 tahun berarti biaya tersebut akan dikenakan untuk setiap tahun sesuai
              durasi yang dipilih (mis. durasi 2 tahun = biaya tahunan dikenakan 2×).
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-[11px] font-semibold text-foreground">Fisik Kontrak</p>
            <ChoiceCard
              value={form.fisikKontrak}
              onChange={(v) => setForm((f) => ({ ...f, fisikKontrak: v }))}
              invalid={attempted && !form.fisikKontrak}
              options={[
                { id: 'cetak', label: 'A. Saya ingin kontrak dicetak', desc: '10–14 hari (kontrak 3 pihak) · 4 hari (kontrak 2 pihak)' },
                { id: 'mekari', label: 'B. Saya ingin menggunakan Mekari (e-kontrak)', desc: '2–4 hari (kontrak 3 pihak) · 1 hari (kontrak 2 pihak). Tutorial akan dipandu.' },
              ]}
            />
            {form.fisikKontrak === 'cetak' && (
              <AreaField
                label="Alamat Pengiriman Dokumen Cetak (kosongkan jika sama dengan alamat limbah)"
                icon={MapPin}
                rows={2}
                value={form.alamatDokumen}
                onChange={set('alamatDokumen')}
              />
            )}
            <div className="rounded-lg border border-border bg-background p-3.5 text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Info pembayaran: </span>
              Paket Tahunan/Bulanan (PTPB) — biaya kontrak dibayar di awal. SPK / Rutin — dibayar setelah pengambilan
              atau di akhir bulan.
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-[11px] font-semibold text-foreground">Kode Instruksi</p>
            <p className="text-[11px] text-muted-foreground">Kode instruksi LIMBAHIN</p>
            <Field
              label="Kode Instruksi"
              value={form.instructionCode}
              onChange={set('instructionCode')}
              placeholder="Kode instruksi LIMBAHIN"
              required
              invalid={attempted && !form.instructionCode.trim()}
            />
            {attempted && form.instructionCode.trim() && !instructionCodeValid && (
              <p className="text-[11px] font-medium text-amber-700">Format kode ini belum kami kenali.</p>
            )}
          </div>
        </div>
      </div>

    </OverlayLayer>
  );
}
