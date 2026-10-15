import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Pencil, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOGO_BADGE_PNG } from '@/assets/logoBadgeBase64.js';

// Landing page after either "Kirim Email" action on CustForm.jsx (Pelayanan layer's "Kirim Email
// Penawaran" or Perusahaan layer's "Kirim Email Draf Kontrak"). Both flows already open WhatsApp
// in a new tab before getting here — this page is what's left in the original tab, confirming the
// email went out and reminding the customer they can reopen/edit this exact submission any time,
// either from the button inside that email or by keeping their ID Formulir.
export default function SubmissionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-11 w-auto object-contain" />
        <p className="font-display text-lg font-bold">Tidak ada data untuk ditampilkan</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Halaman ini mungkin ter-refresh, sehingga status pengiriman sebelumnya tidak lagi tersimpan.
        </p>
        <Button onClick={() => navigate('/')}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Mulai Ulang
        </Button>
      </div>
    );
  }

  const { type, success, error, email, custformId, failures } = data;
  const isRegistration = type === 'registration';
  const hasFailures = Array.isArray(failures) && failures.length > 0;

  // Reopens CustForm at the same custform id — CustForm's ?id= prefill (Apps Script's doGet)
  // pulls this exact submission back up so it can be edited on any of the 3 steps.
  const handleEdit = () => {
    const next = new URLSearchParams();
    if (custformId) next.set('id', custformId);
    navigate({ pathname: '/custform', search: next.toString() });
  };

  const handleStartOver = () => navigate('/');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-11 w-auto object-contain" />

      {success ? (
        <>
          <CheckCircle2 className="h-12 w-12 text-primary" />
          <div>
            <p className="font-display text-lg font-bold">
              {isRegistration ? 'Permintaan Draf Kontrak Terkirim' : 'Penawaran Berhasil Dikirim'}
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {isRegistration
                ? 'Data pendaftaran Anda sudah kami terima dan draf kontrak akan segera diproses. Kami juga sudah membuka WhatsApp CS untuk Anda.'
                : `Dokumen PDF penawaran sudah dikirim${email ? ` ke ${email}` : ''}. Kami juga sudah membuka WhatsApp CS untuk Anda.`}
            </p>
            {hasFailures && (
              <p className="mt-2 max-w-sm text-xs font-medium text-amber-700">
                Sebagian dokumen draf kontrak belum berhasil dibuat otomatis — tim kami akan membuatnya secara
                manual, tidak perlu mengirim ulang.
              </p>
            )}
            {custformId && (
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                ID Formulir Anda: <strong className="text-foreground">{custformId}</strong>. Simpan ID ini, atau
                gunakan tombol <strong>"Ubah / Lengkapi Data Saya"</strong> di dalam email yang baru saja dikirim,
                untuk membuka dan mengubah data ini kapan saja.
              </p>
            )}
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Mohon cek email Anda, <strong>termasuk folder SPAM/Promosi</strong>, jika email tidak muncul di kotak
              masuk utama dalam beberapa menit.
            </p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="h-12 w-12 text-destructive" />
          <div>
            <p className="font-display text-lg font-bold">
              {isRegistration ? 'Gagal Mengirim Permintaan Draf Kontrak' : 'Gagal Mengirim Penawaran'}
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {error || 'Terjadi kesalahan saat mengirim. Silakan periksa kembali data Anda dan coba lagi.'}
            </p>
          </div>
        </>
      )}

      <div className="flex w-full max-w-xs flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="w-full" onClick={handleEdit}>
          <Pencil className="mr-1.5 h-4 w-4" />
          Edit Data
        </Button>
        <Button className="w-full" onClick={handleStartOver}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Mulai Ulang
        </Button>
      </div>
    </div>
  );
}
