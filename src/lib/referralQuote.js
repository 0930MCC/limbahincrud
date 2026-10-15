import { formatIDR } from '@/lib/pricing';

// Turns a single `referal_model` Supabase row into the same `quote` shape that computeQuote()
// produces, so QuoteDocument.jsx and lib/pdf.js can render it with zero changes.
//
// `row.items` is a JSON array (jsonb column) — ONE referral code can now bundle multiple priced
// items (e.g. "Angkut Limbah B3" + "Biaya Dokumen"), each with its own item/description/price/
// unit/qty/subtotal. Every item in the array flows straight into `quote.items`, exactly like the
// normal pricing engine already does for multi-item quotes (PTPB, etc.) — nothing else downstream
// (QuoteDocument, the WhatsApp/email summary, the contract's {rinc} field) needed to change.
//
// `multiplier` is the ?param= price modifier (see lib/paramRule.js) — applied the same way it is
// for the normal pricing engine, so a referral quote link still respects ?param=.
export function buildReferralQuote(row, multiplier = 1) {
  if (!row) return null;

  const rawItems = Array.isArray(row.items) ? row.items : [];
  const items = rawItems.map((it) => {
    const harga = Math.round(Number(it.harga || 0) * multiplier);
    const qty = it.qty != null && it.qty !== '' ? Number(it.qty) : null;
    const jumlahRaw = it.jumlah != null && it.jumlah !== ''
      ? Number(it.jumlah)
      : qty != null
        ? Number(it.harga || 0) * qty
        : Number(it.harga || 0);
    return {
      item: it.item_title || it.item || 'Item',
      definisi: it.item_description || it.definisi || '',
      harga,
      unit: it.unit || '-',
      qty,
      amount: Math.round(jumlahRaw * multiplier),
    };
  });

  const total = items.reduce((sum, it) => sum + (it.amount || 0), 0);

  return {
    service: 'REFERAL',
    serviceLabel: 'Penawaran Kode Referal',
    code: `LIMBAHIN-REF-${(row.code || '').toUpperCase()}`,
    vehicle: null,
    definisi: items[0]?.definisi || 'Penawaran khusus berdasarkan kode referal.',
    summary: [
      { label: 'Kode Referal', value: (row.code || '').toUpperCase() },
      { label: 'Lokasi Pelayanan', value: row.lokasi_pelayanan || '-' },
      { label: 'Jenis Limbah', value: row.jenis_limbah || '-' },
    ],
    items,
    total,
    totalLabel: 'Total',
    notes: {
      pelayananTitle: 'Catatan Pelayanan',
      pelayanan: row.catatan_pelayanan || '',
      limbah: row.catatan_limbah || '',
      global: '',
    },
    // Kept for the WhatsApp / email summary text.
    _referralRow: row,
    _totalDisplay: formatIDR(total),
  };
}
