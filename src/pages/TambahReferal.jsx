import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Ticket, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, AreaField, StepIntro } from '@/components/pricelist/fields';
import { insertReferralModel } from '@/lib/remoteConfig';

const EMPTY_ITEM = { item_title: '', item_description: '', harga: '', unit: '', qty: '', jumlah: '' };

const EMPTY = {
  code: '',
  lokasi_pelayanan: '',
  jenis_limbah: '',
  catatan_limbah: '',
  catatan_pelayanan: '',
};

import { LOGO_BADGE_PNG } from '@/assets/logoBadgeBase64.js';

// Unlisted/"hidden" route — see App.jsx comment. Not linked anywhere in the customer-facing UI;
// staff reach it by typing /tambahreferal directly. Writes a new row to Supabase table
// `referal_model` (see supabase/schema.sql). A customer who later types this row's `code` into
// Step 1's "Kode Referal" field skips straight to a final quote built from this row.
//
// One referral code can now bundle MULTIPLE priced items (the "+ Tambah Item" button below) —
// stored as the `items` jsonb array column — instead of just one, matching how a normal quote can
// have several line items (see lib/referralQuote.js).
export default function TambahReferal() {
  const [form, setForm] = useState(EMPTY);
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setItem = (index, key) => (e) => {
    const value = e.target.value;
    setItems((list) => list.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  };

  const autoJumlah = (index) => () => {
    setItems((list) =>
      list.map((it, i) => {
        if (i !== index) return it;
        const harga = Number(it.harga || 0);
        const qty = Number(it.qty || 0);
        return harga && qty ? { ...it, jumlah: String(harga * qty) } : it;
      })
    );
  };

  const addItem = () => setItems((list) => [...list, { ...EMPTY_ITEM }]);
  const removeItem = (index) => setItems((list) => (list.length > 1 ? list.filter((_, i) => i !== index) : list));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = items.filter((it) => it.item_title.trim());
    if (!form.code.trim() || validItems.length === 0) {
      setStatus('error');
      setErrorMsg('Kode Referal dan minimal satu Item Title wajib diisi.');
      return;
    }
    setStatus('saving');
    setErrorMsg('');
    const payload = {
      code: form.code.trim(),
      lokasi_pelayanan: form.lokasi_pelayanan.trim(),
      jenis_limbah: form.jenis_limbah.trim(),
      catatan_limbah: form.catatan_limbah.trim(),
      catatan_pelayanan: form.catatan_pelayanan.trim(),
      items: validItems.map((it) => ({
        item_title: it.item_title.trim(),
        item_description: it.item_description.trim(),
        harga: it.harga === '' ? null : Number(it.harga),
        unit: it.unit.trim(),
        qty: it.qty === '' ? null : Number(it.qty),
        jumlah: it.jumlah === '' ? null : Number(it.jumlah),
      })),
    };
    const res = await insertReferralModel(payload);
    if (res.status === 'ok') {
      setStatus('saved');
      setForm(EMPTY);
      setItems([{ ...EMPTY_ITEM }]);
    } else {
      setStatus('error');
      setErrorMsg(res.message || 'Supabase belum terhubung / gagal menyimpan.');
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-8 w-auto shrink-0 object-contain" />
          <div>
            <p className="font-display text-base font-bold tracking-tight text-primary">LIMBAHIN</p>
            <p className="text-[11px] text-muted-foreground">Tambah Kode Referal</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke halaman utama
        </Link>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <StepIntro
            title="Tambah Kode Referal"
            subtitle="Kode ini bisa dimasukkan pelanggan di Step 1 (Kode Referal) untuk langsung menerima penawaran khusus ini, tanpa melalui wizard normal. Satu kode bisa berisi lebih dari satu item."
          />

          <Field label="Kode Referal" icon={Ticket} value={form.code} onChange={set('code')} placeholder="mis. PROMOAGT26" required />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lokasi Pelayanan" value={form.lokasi_pelayanan} onChange={set('lokasi_pelayanan')} placeholder="mis. Cikarang" />
            <Field label="Jenis Limbah" value={form.jenis_limbah} onChange={set('jenis_limbah')} placeholder="mis. MEDIS" />
          </div>

          <div className="space-y-4">
            {items.map((it, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-primary">Item {index + 1}</p>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive hover:underline"
                    >
                      <X className="h-3.5 w-3.5" /> Hapus
                    </button>
                  )}
                </div>
                <Field label="Item Title" value={it.item_title} onChange={setItem(index, 'item_title')} placeholder="Nama item pada dokumen" required />
                <AreaField
                  label="Item Description"
                  rows={2}
                  value={it.item_description}
                  onChange={setItem(index, 'item_description')}
                  placeholder="Deskripsi/definisi item"
                />
                <div className="grid gap-4 sm:grid-cols-4">
                  <Field label="Harga" type="number" value={it.harga} onChange={setItem(index, 'harga')} onBlur={autoJumlah(index)} placeholder="0" />
                  <Field label="Unit" value={it.unit} onChange={setItem(index, 'unit')} placeholder="per Kg / per Ritase" />
                  <Field label="Qty" type="number" value={it.qty} onChange={setItem(index, 'qty')} onBlur={autoJumlah(index)} placeholder="0" />
                  <Field label="Jumlah" type="number" value={it.jumlah} onChange={setItem(index, 'jumlah')} placeholder="Harga × Qty" />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <PlusCircle className="h-4 w-4" /> Tambah Item
            </button>
          </div>

          <AreaField label="Catatan Limbah" rows={2} value={form.catatan_limbah} onChange={set('catatan_limbah')} />
          <AreaField label="Catatan Pelayanan" rows={2} value={form.catatan_pelayanan} onChange={set('catatan_pelayanan')} />

          {status === 'error' && <p className="text-[12px] font-medium text-destructive">{errorMsg}</p>}
          {status === 'saved' && (
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Kode referal tersimpan.
            </p>
          )}

          <Button type="submit" disabled={status === 'saving'} className="w-full">
            {status === 'saving' ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Kode Referal'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
