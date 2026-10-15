// Shared helpers for the `custform` model — turning the ONE flat row the backend returns
// (snake_case columns, see supabase/schema-custform.sql) into the state CustForm.jsx renders, plus
// the small "is this step filled in" summaries shown on the step tiles.
//
// The row is the single source of truth. Nothing about the pricing wizard is kept besides the
// finished `rincian_pelayanan` text and the generated files, so a reopened form shows step 2 as
// done (with that text) and offers "Mulai Ulang" rather than a half-editable wizard.

export function newCustformState() {
  return {
    custformId: '',
    meta: { configName: '', rate: '', quotationSentAt: '', contractSentAt: '' },
    dataDasar: { companyName: '', companyEmail: '', companyPhone: '' },
    referralCode: '',
    rincianPelayanan: '',
    registration: null, // null until step 3 has been saved once
    documents: { quotationPdfUrl: '', contractDocUrls: {}, contractPdfUrls: {} },
  };
}

// ---- Generated documents ---------------------------------------------------------------------
const DOC_LABELS = {
  SPK: 'Surat Perintah Kerja (SPK)',
  PKS: 'Perjanjian Kerja Sama (PKS)',
  PKB: 'Perjanjian Kerja Sama (PKSB)',
  PKSB: 'Perjanjian Kerja Sama (PKSB)',
  TJS: 'PKS Jasa (TJS)',
  TPA: 'PKS TPA',
  PLIB: 'PKS Limbah B3 (PLIB)',
  MOU: 'MOU',
};

function docLabel(key) {
  return DOC_LABELS[String(key).toUpperCase()] || String(key);
}

// The backend stores contract links as "SPK: https://... | TJS: https://..." — pipe-separated
// "Type: URL" pairs. -> { SPK: 'https://...', TJS: 'https://...' }
export function parseUrlMap(value) {
  const map = {};
  String(value || '')
    .split('|')
    .forEach((part) => {
      const m = part.trim().match(/^([^:]+):\s*(https?:\/\/\S+)$/i);
      if (m) map[m[1].trim()] = m[2].trim();
    });
  return map;
}

// state.documents -> the flat card list DocumentCards renders. The quotation always comes first;
// `kind` is what decides which email button a card belongs under.
export function buildDocumentList(documents) {
  const list = [];
  if (documents?.quotationPdfUrl) {
    list.push({ key: 'QUOTATION', kind: 'quotation', label: 'Quotation / Price List', pdfUrl: documents.quotationPdfUrl });
  }
  const pdfs = documents?.contractPdfUrls || {};
  const docs = documents?.contractDocUrls || {};
  const keys = Array.from(new Set([...Object.keys(pdfs), ...Object.keys(docs)]));
  keys.forEach((k) => {
    if (!pdfs[k] && !docs[k]) return;
    list.push({ key: k, kind: 'contract', label: docLabel(k), pdfUrl: pdfs[k] || '', docUrl: docs[k] || '' });
  });
  return list;
}

// ---- row -> state ----------------------------------------------------------------------------
function phoneWithPlus(v) {
  const digits = String(v ?? '').replace(/[^\d]/g, '');
  return digits ? `+${digits}` : '';
}

function dmyToIso(dmy) {
  if (!dmy) return '';
  const m = String(dmy).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  return `${m[3]}-${m[2]}-${m[1]}`;
}

export function mapRowToState(row) {
  if (!row) return null;
  const s = (v) => String(v ?? '');

  // Step 3 counts as saved once it has an instruction code (the form can't be saved without one).
  const registration = row.instruction_code
    ? {
        npwp: s(row.npwp),
        industriBidang: s(row.industri_bidang),
        alamatLimbah: s(row.alamat_limbah),
        alamatDokumen: s(row.alamat_dokumen),
        pjNama: s(row.pj_nama),
        pjJabatan: s(row.pj_jabatan),
        manifestPilihan: s(row.manifest),
        showPicOperasional: !!(row.pic_operasional_nama || row.pic_operasional_tel),
        picOperasionalNama: s(row.pic_operasional_nama),
        picOperasionalTel: phoneWithPlus(row.pic_operasional_tel),
        showPicKeuangan: !!(row.pic_keuangan_nama || row.pic_keuangan_tel),
        picKeuanganNama: s(row.pic_keuangan_nama),
        picKeuanganTel: phoneWithPlus(row.pic_keuangan_tel),
        fisikKontrak: s(row.fisik_kontrak),
        instructionCode: s(row.instruction_code),
        // Sheet convention is dd/mm/yyyy; the date <input> needs yyyy-mm-dd.
        tanggalMulaiKontrak: dmyToIso(row.tanggal_mulai),
        durasiKontrakTahun: s(row.durasi_tahun),
        tanggalAkhirKontrak: s(row.tanggal_akhir), // dd/mm/yyyy, display only
      }
    : null;

  return {
    custformId: s(row.custform_id).toUpperCase(),
    meta: {
      configName: s(row.config_name),
      rate: s(row.rate),
      quotationSentAt: s(row.quotation_sent_at),
      contractSentAt: s(row.contract_sent_at),
    },
    dataDasar: {
      companyName: s(row.company_name),
      companyEmail: s(row.company_email),
      companyPhone: phoneWithPlus(row.company_phone),
    },
    referralCode: s(row.referral_code),
    rincianPelayanan: s(row.rincian_pelayanan),
    registration,
    documents: {
      quotationPdfUrl: s(row.quotation_pdf_url),
      contractDocUrls: parseUrlMap(row.contract_doc_urls),
      contractPdfUrls: parseUrlMap(row.contract_pdf_urls),
    },
  };
}

export function dataDasarComplete(dataDasar) {
  return !!(dataDasar?.companyName?.trim() && dataDasar?.companyEmail?.trim() && dataDasar?.companyPhone?.trim());
}

// ---- Step-tile summaries ---------------------------------------------------------------------
// Multi-line strings are fine — StepTile renders them with whitespace-pre-line inside a capped,
// scrollable box.
export function dataDasarSummary(dataDasar) {
  if (!dataDasarComplete(dataDasar)) return '';
  return [dataDasar.companyName, dataDasar.companyEmail].filter(Boolean).join('\n');
}

// The full rincian pelayanan — the tile scrolls, so the customer can confirm every detail without
// reopening the layer.
export function pelayananSummary(rincianPelayanan) {
  return String(rincianPelayanan || '').trim();
}

const FISIK_LABELS = { mekari: 'Mekari (E-Kontrak)', cetak: 'Dicetak Fisik' };

// Leads with the penanggung jawab utama (name + role), then the contract settings chosen.
export function perusahaanSummary(registration) {
  if (!registration) return '';
  const lines = [];
  if (registration.pjNama) {
    lines.push(`${registration.pjNama}${registration.pjJabatan ? ' — ' + registration.pjJabatan : ''}`);
  }
  const contractBits = [];
  if (registration.instructionCode) contractBits.push(registration.instructionCode);
  if (registration.durasiKontrakTahun) contractBits.push(`${registration.durasiKontrakTahun} tahun`);
  if (registration.fisikKontrak) contractBits.push(FISIK_LABELS[registration.fisikKontrak] || registration.fisikKontrak);
  if (contractBits.length) lines.push(contractBits.join(' · '));
  return lines.join('\n');
}
