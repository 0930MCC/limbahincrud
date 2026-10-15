const line = (label, value) => `${label}: ${value || '-'}`;

// Everything about the chosen pelayanan is the ONE saved text block (`rincianPelayanan`, built by
// lib/pricing.js#buildPricelistSummaryText when step 2 is saved) — item names, price, unit, qty,
// subtotal and notes. The form's own id goes on top so CS can pull up the exact row.
function quoteSummaryLines(custformId, rincianPelayanan) {
  const lines = [];
  if (custformId) lines.push(line('ID Formulir', custformId));
  if (rincianPelayanan) lines.push(...String(rincianPelayanan).split('\n'));
  return lines;
}

// Sent right after the customer emails the quotation (Kirim Penawaran).
export function buildQuotationWhatsAppMessage({ company, rincianPelayanan, email, custformId }) {
  const parts = [
    'Halo CS LIMBAHIN, saya baru saja mengisi form Quotation di web dan meminta penawaran dikirim ke email.',
    '',
    '*Data Perusahaan*',
    line('Nama Perusahaan', company?.name),
    line('Nama Kontak', company?.contact),
    line('No. Kontak', company?.phone),
    line('Email', email),
    '',
    '*Detail Penawaran*',
    ...quoteSummaryLines(custformId, rincianPelayanan),
    '',
    'Mohon info lebih lanjut. Terima kasih.',
  ];
  return parts.join('\n');
}

// Sent right after the customer emails the contract draft (Kirim Draf Kontrak). Includes the
// saved pelayanan summary PLUS every field collected in the registration form so CS/kontrak team
// has the full picture without needing to ask again.
export function buildRegistrationWhatsAppMessage({ company, rincianPelayanan, registration, email, custformId }) {
  const r = registration || {};
  const picExtra = [];
  if (r.picOperasionalNama || r.picOperasionalTel) {
    picExtra.push(line('PIC Operasional', `${r.picOperasionalNama || '-'} (${r.picOperasionalTel || '-'})`));
  }
  if (r.picKeuanganNama || r.picKeuanganTel) {
    picExtra.push(line('PIC Keuangan', `${r.picKeuanganNama || '-'} (${r.picKeuanganTel || '-'})`));
  }

  const parts = [
    'Halo CS/Kontrak LIMBAHIN, saya sudah mengisi Form Pendaftaran (MOU/Kontrak) di web dan meminta draf kontrak dikirim ke email.',
    '',
    '*Ringkasan Penawaran*',
    ...quoteSummaryLines(custformId, rincianPelayanan),
    '',
    '*Data Perusahaan*',
    line('Nama Perusahaan', r.namaPerusahaan || company?.name),
    line('NPWP & Kode Faktur', r.npwp),
    line('Industri & Bidang', r.industriBidang),
    line('Alamat Limbah', r.alamatLimbah),
    line('Alamat Dokumen', r.alamatDokumen || 'Sama dengan alamat limbah'),
    line('No. Telp Perusahaan', r.telpPerusahaan),
    line('Email Perusahaan', r.emailPerusahaan || email),
    '',
    '*Penanggung Jawab Utama*',
    line('Nama Lengkap', r.pjNama),
    line('Jabatan', r.pjJabatan),
    '',
    '*Manifest / Festronik*',
    line('Pilihan', r.manifestPilihan === 'festronik' ? 'B. Menggunakan Festronik' : 'A. Hanya Manifest'),
    ...picExtra,
    '',
    '*Fisik Kontrak*',
    line('Fisik Kontrak', r.fisikKontrak === 'mekari' ? 'B. Mekari (E-Kontrak)' : 'A. Dicetak Fisik'),
    '',
    '*Tanggal & Durasi Kontrak*',
    line('Mulai', r.tanggalMulaiKontrak),
    line('Durasi', r.durasiKontrakTahun ? `${r.durasiKontrakTahun} Tahun` : ''),
    line('Akhir', r.tanggalAkhirKontrak),
    '',
    line('KODE INSTRUKSI', r.instructionCode),
    '',
    'Mohon dibuatkan draf kontrak & MOU-nya. Terima kasih.',
  ];
  return parts.join('\n');
}
