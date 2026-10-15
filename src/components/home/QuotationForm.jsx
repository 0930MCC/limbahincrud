import React, { useEffect, useRef, useState } from "react";
import { Send, FileText, ExternalLink, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const WA_PHONE = "6281517005533";
const FORM_LINK = "https://drive.google.com/file/d/1qdDfMOLmvMEugvDXUzTyQ4dphWdRu-o1/view?usp=drive_link";

const lokasiOptions = [
  "JABODETABEK + Kab. Bekasi", "Kab. Tangerang, Kab Bogor, Karawang", "Serang, Subang, Cilegon, Bandung, Indramayu",
  "Kabupaten Bandung, Sumedang, Majalengka", "Cirebon, Kabupaten Cirebon, Kuningan", "Brebes, Tegal, Pemalang",
  "Pekalongan, Batang", "Semarang, Kendal, Demak", "Salatiga, Solo (Surakarta), Boyolali",
  "Yogyakarta, Klaten, Magelang", "Madiun, Ngawi", "Kediri, Nganjuk",
  "Surabaya, Sidoarjo", "Malang, Pasuruan", "Lampung", "Palembang", "Medan", "Lainnya",
];

const jenisLimbah = [
  "Limbah B3 Medis (Rumah Sakit, Klinik & Praktek Pribadi)",
  "Limbah B3 Industri (Pabrik, Gudang & Limbah Mesin)",
  "Limbah B3 Komersil (Hotel, Apartemen & Kantor)",
  "Limbah B3 Produk & Bahan (Barang Reject/Kedaluwarsa)",
  "Limbah Domestik",
  "Limbah Ekonomis (Besi, Oli, Plastik, dll)",
];

const jenisPelayanan = [
  "Pengambilan tidak pasti | Jumlah limbah <100kg per ambil",
  "Pengambilan tidak pasti | Jumlah limbah >100kg per ambil",
  "Pengambilan 1-12 kali per tahun | Jumlah limbah 0-300kg per tahun",
  "Pengambilan per bulan | Jumlah limbah 100-1000kg per tahun",
  "Pengambilan rutin per minggu atau harian | Jumlah limbah 200kg - 1.5ton per bulan",
  "Pengambilan rutin per minggu atau harian | Jumlah limbah 1.5ton - >20ton per bulan",
];

const initialPenawaran = { nama: "", email: "", telepon: "", perusahaan: "", lokasi: "", lokasiLainnya: "", limbah: "", pelayanan: "", catatan: "" };

const initialPendaftaran = {
  namaPerusahaan: "", npwp: "", alamatLimbah: "", alamatDokumen: "", telpPerusahaan: "", emailPerusahaan: "",
  namaPJ: "", jabatanPJ: "", manifest: "",
  jenisLimbah: "", jenisPelayanan: "", catatan: "",
  multipleLocations: "tidak", additionalLocations: "",
  namaPICOps: "", telpPICOps: "", picKeuangan: "", telpPicKeuangan: "", picLain: "",
};

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2ba5ad]/30 focus:border-[#2ba5ad] transition-all placeholder:text-gray-400";
const labelClass = "block text-sm font-medium text-[#1a1a2e] mb-1.5";

function PenawaranForm() {
  const [form, setForm] = useState(initialPenawaran);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const lokasiText = form.lokasi === "Lainnya" ? `Lainnya: ${form.lokasiLainnya}` : form.lokasi;
    const catatanText = form.catatan ? `\nCatatan: ${form.catatan}` : "";
    const message =
      `Halo LIMBAHIN bersama MCC,\n\nSaya ingin meminta penawaran:\n\n` +
      `Nama: ${form.nama}\nEmail: ${form.email}\nTelepon: ${form.telepon}\n` +
      `Perusahaan: ${form.perusahaan}\nLokasi: ${lokasiText}\n` +
      `Jenis Limbah: ${form.limbah}\nJenis Pelayanan: ${form.pelayanan}${catatanText}\n\n[BTN18]`;
    window.open(`https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={labelClass}>Nama Lengkap *</label><input type="text" name="nama" required placeholder="Nama Anda" value={form.nama} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Email *</label><input type="email" name="email" required placeholder="email@perusahaan.com" value={form.email} onChange={handleChange} className={inputClass} /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={labelClass}>No. Telepon *</label><input type="tel" name="telepon" required placeholder="08xx xxxx xxxx" value={form.telepon} onChange={handleChange} className={inputClass} /></div>
        <div><label className={labelClass}>Nama Perusahaan *</label><input type="text" name="perusahaan" required placeholder="PT. / CV. / Instansi" value={form.perusahaan} onChange={handleChange} className={inputClass} /></div>
      </div>
      <div>
        <label className={labelClass}>Lokasi *</label>
        <select name="lokasi" required value={form.lokasi} onChange={handleChange} className={inputClass}>
          <option value="">Pilih lokasi Anda</option>
          {lokasiOptions.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {form.lokasi === "Lainnya" && <input type="text" name="lokasiLainnya" required placeholder="Sebutkan lokasi Anda" value={form.lokasiLainnya} onChange={handleChange} className={`${inputClass} mt-2`} />}
      </div>
      <div>
        <label className={labelClass}>Jenis Limbah *</label>
        <select name="limbah" required value={form.limbah} onChange={handleChange} className={inputClass}>
          <option value="">Pilih jenis limbah</option>
          {jenisLimbah.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Jenis Pelayanan *</label>
        <select name="pelayanan" required value={form.pelayanan} onChange={handleChange} className={inputClass}>
          <option value="">Pilih jenis pelayanan</option>
          {jenisPelayanan.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Catatan (Opsional)</label>
        <textarea name="catatan" rows={3} placeholder="Pesan tambahan, pertanyaan, atau detail kebutuhan lainnya..." value={form.catatan} onChange={handleChange} className={inputClass} />
      </div>
      <button type="submit" className="w-full bg-[#2ba5ad] hover:bg-[#239198] text-white py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/20 flex items-center justify-center gap-2 mt-2">
        <Send size={16} /> Kirim via WhatsApp
      </button>
      <p className="text-center text-xs text-gray-400">*Harga belum termasuk PPN 11%. Tim kami akan merespons dalam 1x24 jam kerja.</p>
    </form>
  );
}

function PendaftaranForm() {
  const [form, setForm] = useState(initialPendaftaran);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const alamatDok = form.alamatDokumen || form.alamatLimbah;
    const lokasiTambahan = form.multipleLocations === "ya" && form.additionalLocations ? `\nLokasi tambahan: ${form.additionalLocations}` : "";
    const message =
      `LIMBAHIN - MCC\n--FORMULIR PENDAFTARAN--\n\n` +
      `PERUSAHAAN:\n` +
      `1. Nama: ${form.namaPerusahaan}\n` +
      `2. NPWP & kode faktur: ${form.npwp}\n\n` +
      `3. Alamat limbah: ${form.alamatLimbah}${lokasiTambahan}\n` +
      `4. Alamat dokumen: ${alamatDok}\n\n` +
      `5. No Telepon Perusahaan: ${form.telpPerusahaan}\n` +
      `6. Email Perusahaan: ${form.emailPerusahaan}\n\n` +
      `PENANGGUNG JAWAB UTAMA:\n` +
      `7. Nama lengkap: ${form.namaPJ}\n` +
      `8. Jabatan: ${form.jabatanPJ}\n\n` +
      `9. Manifest/Festronik: ${form.manifest}\n\n` +
      `PELAYANAN:\n` +
      `Jenis Limbah: ${form.jenisLimbah}\n` +
      `Jenis Pelayanan: ${form.jenisPelayanan}\n` +
      `Catatan: ${form.catatan || "-"}\n\n` +
      `TAMBAHAN:\n` +
      `10. Nama PIC operasional: ${form.namaPICOps || "-"}\n` +
      `11. Tel WA PIC operasional: ${form.telpPICOps || "-"}\n` +
      `12. PIC keuangan: ${form.picKeuangan || "-"}\n` +
      `13. Tel WA PIC keuangan: ${form.telpPicKeuangan || "-"}\n` +
      `14. PIC lain: ${form.picLain || "-"}\n\n[BTN19]`;
    window.open(`https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <div className="bg-[#f7fafb] rounded-xl p-5 mb-8 space-y-3">
        <div className="flex items-start gap-3">
          <FileText size={18} className="text-[#2ba5ad] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">Dokumen formulir pendaftaran dapat diakses di <a href={FORM_LINK} target="_blank" rel="noopener noreferrer" className="text-[#2ba5ad] font-semibold hover:underline inline-flex items-center gap-1">Google Drive <ExternalLink size={12} /></a></p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-[#2ba5ad] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">Silahkan scan/foto setelah diisi atau bisa langsung melalui mengisi data di bawah.</p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-[#2ba5ad] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">Untuk form PDF, halaman 2 hanya diisi jika ingin dilakukan pendaftaran Festronik.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">PERUSAHAAN <span className="text-xs font-normal text-gray-400">(Kalau belum NPWP tolong surat pernyataan UMKM)</span></h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelClass}>1. Nama Perusahaan *</label><input type="text" name="namaPerusahaan" required value={form.namaPerusahaan} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>2. NPWP & Kode Faktur *</label><input type="text" name="npwp" required value={form.npwp} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="mt-4"><label className={labelClass}>3. Alamat Limbah (Lokasi limbah, jika ada beberapa sebutkan) *</label><textarea name="alamatLimbah" required rows={2} value={form.alamatLimbah} onChange={handleChange} className={inputClass} /></div>
          <div className="mt-4"><label className={labelClass}>4. Alamat Dokumen (Kosongkan jika sama dengan di atas)</label><textarea name="alamatDokumen" rows={2} value={form.alamatDokumen} onChange={handleChange} className={inputClass} /></div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div><label className={labelClass}>5. No. Telepon Perusahaan (WA jika ada) *</label><input type="text" name="telpPerusahaan" required value={form.telpPerusahaan} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>6. Email Perusahaan (Wajib ada) *</label><input type="email" name="emailPerusahaan" required value={form.emailPerusahaan} onChange={handleChange} className={inputClass} /></div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">PENANGGUNG JAWAB UTAMA <span className="text-xs font-normal text-gray-400">(Yang menyetujui - biasanya anggota direksi)</span></h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelClass}>7. Nama Lengkap *</label><input type="text" name="namaPJ" required value={form.namaPJ} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>8. Jabatan *</label><input type="text" name="jabatanPJ" required value={form.jabatanPJ} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>9. Manifest/Festronik (Pilih satu A, B, C) *</label>
            <div className="space-y-2">
              {[
                { val: "A. Saya hanya ingin menggunakan manifest.", label: "A. Saya hanya ingin menggunakan manifest." },
                { val: "B. Saya menggunakan festronik.", label: "B. Saya menggunakan festronik." },
                { val: "C. Saya tidak paham terkait manifest.", label: "C. Saya tidak paham terkait manifest." },
              ].map((opt) => (
                <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="manifest" required value={opt.val} checked={form.manifest === opt.val} onChange={handleChange} className="text-[#2ba5ad] focus:ring-[#2ba5ad]" />
                  <span className="text-sm text-gray-600">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">PELAYANAN</h3>
          <div>
            <label className={labelClass}>Jenis Limbah *</label>
            <select name="jenisLimbah" required value={form.jenisLimbah} onChange={handleChange} className={inputClass}>
              <option value="">Pilih jenis limbah</option>
              {jenisLimbah.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Jenis Pelayanan *</label>
            <select name="jenisPelayanan" required value={form.jenisPelayanan} onChange={handleChange} className={inputClass}>
              <option value="">Pilih jenis pelayanan</option>
              {jenisPelayanan.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Catatan (Opsional)</label>
            <textarea name="catatan" rows={2} placeholder="Pesan tambahan, pertanyaan, atau detail kebutuhan lainnya..." value={form.catatan} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">LOKASI TAMBAHAN</h3>
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input type="radio" name="multipleLocations" value="tidak" checked={form.multipleLocations === "tidak"} onChange={handleChange} className="text-[#2ba5ad] focus:ring-[#2ba5ad]" />
            <span className="text-sm text-gray-600">Tidak, hanya 1 lokasi limbah</span>
          </label>
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input type="radio" name="multipleLocations" value="ya" checked={form.multipleLocations === "ya"} onChange={handleChange} className="text-[#2ba5ad] focus:ring-[#2ba5ad]" />
            <span className="text-sm text-gray-600">Ya, ada beberapa lokasi limbah</span>
          </label>
          {form.multipleLocations === "ya" && (
            <div>
              <label className={labelClass}>Masukkan seluruh tambahan lokasi limbah *</label>
              <textarea name="additionalLocations" required rows={3} placeholder="Sebutkan seluruh lokasi tambahan limbah..." value={form.additionalLocations} onChange={handleChange} className={inputClass} />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">TAMBAHAN <span className="text-xs font-normal text-gray-400">(Tidak perlu diisi jika sama dengan penanggung jawab utama)</span></h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelClass}>10. Nama PIC Operasional</label><input type="text" name="namaPICOps" value={form.namaPICOps} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>11. Tel/WA PIC Operasional</label><input type="text" name="telpPICOps" value={form.telpPICOps} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div><label className={labelClass}>12. PIC Keuangan</label><input type="text" name="picKeuangan" value={form.picKeuangan} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>13. Tel/WA PIC Keuangan</label><input type="text" name="telpPicKeuangan" value={form.telpPicKeuangan} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="mt-4"><label className={labelClass}>14. PIC Lain</label><input type="text" name="picLain" value={form.picLain} onChange={handleChange} className={inputClass} /></div>
        </div>

        <button type="submit" className="w-full bg-[#2ba5ad] hover:bg-[#239198] text-white py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/20 flex items-center justify-center gap-2">
          <Send size={16} /> Daftar Sekarang via WhatsApp
        </button>
      </form>
    </>
  );
}

/**
 * Combined Formulir Penawaran / Formulir Pendaftaran section with tabs.
 *
 * - `defaultTab`: "penawaran" (default) or "pendaftaran" — which tab is active on load.
 * - The section also listens for a URL hash of `#pendaftaran-form`. Any link ending in
 *   that hash (e.g. `/layanan/proses-pelayanan#pendaftaran-form`) will open this
 *   section directly on the Pendaftaran tab and scroll it into view — this is how the
 *   "easy access" registration buttons around the site work.
 */
export default function QuotationForm({ defaultTab = "penawaran" }) {
  const [tab, setTab] = useState(defaultTab);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === "#pendaftaran-form") {
      setTab("pendaftaran");
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <section id="quotation" ref={sectionRef} className="py-20 md:py-28 bg-[#f7fafb] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Mulai Kerjasama</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3">
            {tab === "penawaran" ? "Minta Penawaran Sekarang" : "Formulir Pendaftaran"}
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
            {tab === "penawaran"
              ? "Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda melalui WhatsApp."
              : "Isi formulir pendaftaran di bawah ini untuk memulai kerjasama dengan kami."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setTab("penawaran")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "penawaran" ? "bg-[#2ba5ad] text-white shadow-md shadow-[#2ba5ad]/20" : "bg-white text-gray-500 border border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"}`}
            >
              Formulir Penawaran
            </button>
            <button
              type="button"
              onClick={() => setTab("pendaftaran")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "pendaftaran" ? "bg-[#2ba5ad] text-white shadow-md shadow-[#2ba5ad]/20" : "bg-white text-gray-500 border border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"}`}
            >
              Formulir Pendaftaran
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
            {tab === "penawaran" ? <PenawaranForm /> : <PendaftaranForm />}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
