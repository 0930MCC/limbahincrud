import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, ArrowRight, Info } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const WA_BASE = "https://api.whatsapp.com/send?phone=6281517005533&text=";

const medisPackages = [
  {
    key: "rutin", name: "Rutin", subtitle: "Untuk Rumah Sakit",
    price: "Mulai IDR 5.000/kg", highlight: false,
    features: ["Rumah sakit umum & khusus", "Pengambilan mingguan hingga harian", "Minimum 100kg - >20 ton per bulan", "Tanpa biaya transport", "Sertifikat pemusnahan resmi"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20rutin%20B3%20Medis%20untuk%20rumah%20sakit",
    note: "Semakin besar volume, semakin rendah harga per kg. Hubungi kami untuk simulasi biaya.",
  },
  {
    key: "tahunan", name: "Paket Tahunan", subtitle: "Untuk Klinik",
    price: "Mulai IDR 1.4 Juta/tahun", highlight: true,
    features: ["Klinik umum, gigi & spesialis", "4x kunjungan per tahun (Paket 4x10kg)", "Gratis fasilitas: Safety Box & plastik kuning", "Biaya kelebihan: IDR 13.000/kg", "Biaya kunjungan tambahan: IDR 250.000/ritase"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20tahunan%20B3%20Medis%20untuk%20klinik",
    note: "Harga mulai dari Paket 2x10kg. Tersedia paket 1x hingga 12x kunjungan per tahun.",
  },
  {
    key: "bulanan", name: "Paket Bulanan", subtitle: "Untuk Puskesmas",
    price: "Mulai IDR 370.000+/bulan", highlight: false,
    features: ["Puskesmas & fasilitas kesehatan", "Pengambilan 1-4x per bulan", "Kuota limbah 10kg per kunjungan", "Biaya kelebihan: IDR 10.000/kg", "Manifest bulanan terlapor"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20bulanan%20B3%20Medis%20untuk%20puskesmas",
    note: "Paket B1 (1x/bulan) hingga B4 (4x/bulan) tersedia.",
  },
  {
    key: "spk_min", name: "SPK MIN", subtitle: "Untuk Praktek Pribadi",
    price: "Mulai IDR 13.000/kg", highlight: false,
    features: ["Praktek dokter gigi, umum & spesialis", "Farmasi & apotek kecil", "Biaya transport IDR 450rb/ritase (tanpa kontrak)", "Manifest digital via Festronik", "Minimal 1 ritase per kunjungan"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20SPK%20B3%20Medis%20kurang%20dari%20100kg%20untuk%20praktek%20pribadi",
    note: "Sudah termasuk biaya transport untuk JABODETABEK",
  },
  {
    key: "spk_max", name: "SPK MAX", subtitle: "Limbah B3 Medis Menumpuk",
    price: "Mulai IDR 6.000/kg + transport", highlight: false,
    features: ["Limbah B3 medis dalam jumlah besar", "Cocok untuk proyek pemusnahan sekali waktu", "Biaya transport sesuai lokasi", "Semakin besar volume, harga semakin turun", "Hingga IDR 4.500/kg untuk 10.000 kg+"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20SPK%20Max%20B3%20Medis%20untuk%20limbah%20menumpuk",
    note: "Tersedia simulasi harga berdasarkan kuantitas. Hubungi kami.",
  },
];

const komersilPackages = [
  {
    key: "tahunan_plus", name: "Paket Tahunan Plus", subtitle: "Hotel, Apartemen & Kantor",
    price: "Mulai IDR 1.8 Juta/tahun", highlight: true,
    features: ["Hotel, resort & penginapan", "Apartemen & kondotel", "Kantor & gedung komersil", "Gratis fasilitas pengelolaan tahunan", "Dokumen lengkap & manifest resmi"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20tahunan%20plus%20B3%20Komersil",
    note: "Tersedia berbagai pilihan paket sesuai volume limbah.",
  },
  {
    key: "spk_komersil", name: "SPK MIN", subtitle: "Per Pengambilan",
    price: "Mulai IDR 13.000/kg + transport", highlight: false,
    features: ["Fleksibel tanpa kontrak tahunan", "Cocok untuk kebutuhan sesekali", "Biaya transport sesuai lokasi", "Pemusnahan limbah B3 komersil berizin", "Manifest resmi setiap kunjungan"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20SPK%20B3%20Komersil%20per%20pengambilan",
    note: "Biaya transport JABODETABEK mulai IDR 450.000/ritase.",
  },
];

const industryPackages = [
  {
    key: "rutin_industri", name: "Rutin", subtitle: "Untuk Pabrik & Industri",
    price: "Mulai IDR 2.500/kg", highlight: true,
    features: ["Pabrik manufaktur", "Pengambilan rutin mingguan/harian", "Harga kompetitif per kg", "Tanpa biaya transport (untuk kuota terpenuhi)", "Laporan limbah bulanan lengkap"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20paket%20rutin%20B3%20Industri",
    note: "Harga berdasarkan volume. Semakin besar, semakin murah.",
  },
  {
    key: "spk_industri", name: "SPK MAx Industri", subtitle: "Proyek Besar",
    price: "Mulai IDR 3.500/kg + transport", highlight: false,
    features: ["Cocok untuk proyek industrial besar", "Pemusnahan limbah cair & padat", "Biaya transport sesuai lokasi & volume", "Minimal 100kg per kunjungan", "Sertifikat pemusnahan CoD terverifikasi"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20SPK%20Max%20B3%20Industri",
    note: "Tersedia pilihan transport ke luar JABODETABEK.",
  },
];

const produkPackages = [
  {
    key: "spk_produk", name: "SPK > 100kg", subtitle: "Proyek Sesekali",
    price: "Mulai IDR 6.000/kg + transport", highlight: true,
    features: ["Barang reject & produk gagal", "Bahan baku kedaluwarsa", "Kemasan terkontaminasi", "Produk recall industri", "Sertifikat pemusnahan resmi (CoD)"],
    waText: "Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20pemusnahan%20B3%20Produk%20dan%20Bahan",
    note: "Harga final bergantung pada jenis dan volume limbah.",
  },
];

const tabInfo = {
  medis: { label: "B3 Medis", desc: "Limbah B3 medis adalah limbah dari fasilitas pelayanan kesehatan seperti rumah sakit, klinik, puskesmas, dan praktek pribadi. Meliputi jarum suntik bekas, kasa, APD, limbah patologis, dan bahan terkontaminasi infeksius yang memerlukan pemusnahan berizin." },
  komersil: { label: "B3 Komersil", desc: "Limbah B3 komersil adalah limbah berbahaya dari aktivitas komersil seperti hotel, apartemen, kantor, dan fasilitas umum. Meliputi baterai bekas, lampu TL, toner printer, aerosol, dan elektronik rusak yang memerlukan pemusnahan khusus." },
  industri: { label: "B3 Industri", desc: "Limbah B3 industri adalah limbah berbahaya dari proses produksi pabrik dan manufaktur. Meliputi oli bekas, solvent, bahan kimia proses, filter industri, dan limbah cair berbahaya yang memerlukan pemusnahan sesuai standar KLHK." },
  produk: { label: "B3 Produk & Bahan", desc: "Limbah B3 produk & bahan adalah barang reject, produk kedaluwarsa, bahan baku gagal, dan kemasan terkontaminasi yang memerlukan pemusnahan aman untuk mencegah penyalahgunaan dan pencemaran lingkungan." },
  domestik: { label: "Limbah Domestik", desc: "Limbah domestik adalah limbah rumah tangga dan non-B3 dari aktivitas sehari-hari, meliputi sampah organik, residu, dan material yang dapat didaur ulang." },
  ekonomis: { label: "Limbah Ekonomis", desc: "Limbah ekonomis adalah limbah yang masih memiliki nilai jual dan dapat didaur ulang, seperti oli bekas, besi tua, plastik, kertas, dan kayu." },
};

const UnderConstruction = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Wrench size={48} className="text-[#2ba5ad] mb-4 opacity-60" />
    <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Sedang dalam Pengembangan</h3>
    <p className="text-gray-500 text-sm max-w-sm">Daftar harga untuk <strong>{label}</strong> sedang kami siapkan. Hubungi kami langsung untuk informasi lebih lanjut.</p>
    <a href={`${WA_BASE}Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20harga%20${encodeURIComponent(label)}%0A%5BBTN36%5D`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-[#2ba5ad] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors">
      Hubungi Kami <ArrowRight size={14} />
    </a>
  </div>
);

function PriceCard({ pkg }) {
  return (
<div className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-200 hover:shadow-xl ${pkg.highlight ? "border-[#2ba5ad] bg-[#f0fafa] shadow-lg" : "border-gray-200 bg-white hover:border-[#2ba5ad]/40"}`}>
      {pkg.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2ba5ad] text-white text-xs font-bold px-4 py-1 rounded-full">Paling Populer</div>}
      <div className="mb-4"><h3 className="text-lg font-bold text-[#1a1a2e]">{pkg.name}</h3><p className="text-sm text-gray-500">{pkg.subtitle}</p></div>
      <div className="text-2xl font-bold text-[#2ba5ad] mb-5">{pkg.price}</div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {pkg.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-[#2ba5ad] flex-shrink-0 mt-1.5" />{f}</li>))}
      </ul>
      {pkg.note && (<div className="flex items-start gap-1.5 text-xs text-gray-400 mb-4 bg-gray-50 rounded-lg p-3"><Info size={12} className="flex-shrink-0 mt-0.5" /> {pkg.note}</div>)}
      <a href={`${WA_BASE}${pkg.waText}%0A%5BBTN37%5D`} target="_blank" rel="noopener noreferrer" className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${pkg.highlight ? "bg-[#2ba5ad] text-white hover:bg-[#239198] shadow-md" : "border-2 border-[#2ba5ad] text-[#2ba5ad] hover:bg-[#2ba5ad] hover:text-white"}`}>Tanya Harga via WhatsApp</a>
    </div>
  );
}

const tabs = [
  { id: "medis", label: "B3 Medis", packages: medisPackages },
  { id: "komersil", label: "B3 Komersil", packages: komersilPackages },
  { id: "industri", label: "B3 Industri", packages: industryPackages },
  { id: "produk", label: "B3 Produk & Bahan", packages: produkPackages },
  { id: "domestik", label: "Limbah Domestik", packages: null },
  { id: "ekonomis", label: "Limbah Ekonomis", packages: null },
];

export default function DaftarHarga() {
  const [active, setActive] = useState("medis");
  const currentTab = tabs.find((t) => t.id === active);
  const info = tabInfo[active];

  return (
    <>
      <Seo
        title="Harga Pengangkutan Limbah B3 Jabodetabek"
        description="Cek harga pengangkutan dan pemusnahan limbah B3 per kg untuk limbah medis, industri, komersial, dan produk & bahan di Jabodetabek. Transparan, berizin, dokumen lengkap."
        path="/harga-limbah"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Harga Transparan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Harga Limbah</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Harga kompetitif dan transparan untuk semua jenis layanan pemusnahan limbah. *Belum termasuk PPN 11%.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActive(t.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${active === t.id ? "bg-[#2ba5ad] text-white border-[#2ba5ad] shadow-lg shadow-[#2ba5ad]/20" : "bg-white text-gray-600 border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"}`}>
                {t.label}{(!t.packages) && <span className="ml-2 text-xs opacity-60">(Soon)</span>}
              </button>
            ))}
          </div>

          {/* Description */}
          <motion.div key={`info-${active}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl mx-auto text-center mb-12">
            <div className="bg-[#f7fafb] rounded-xl p-5 border border-gray-100">
              <h2 className="font-bold text-[#1a1a2e] mb-2 text-sm">{info.label}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{info.desc}</p>
            </div>
          </motion.div>

          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {currentTab.packages ? (
              <div className={`grid gap-6 ${currentTab.packages.length >= 4 ? "md:grid-cols-2 lg:grid-cols-3" : currentTab.packages.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3 max-w-4xl mx-auto"}`}>
                {currentTab.packages.map((pkg) => <PriceCard key={pkg.key} pkg={pkg} />)}
              </div>
            ) : (
              <UnderConstruction label={currentTab.label} />
            )}
          </motion.div>

          {currentTab.packages && (
            <div className="mt-12 bg-[#f7fafb] rounded-xl p-6 border border-gray-100 max-w-3xl mx-auto">
              <h4 className="font-semibold text-[#1a1a2e] mb-3 text-sm">Catatan Umum:</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>• Harga belum termasuk PPN 11%. Harga dapat berubah sewaktu-waktu.</li>
                <li>• Untuk revisi kontrak kedua dan selanjutnya dalam satu tahun dikenakan biaya IDR 300.000/kontrak.</li>
                <li>• Pembayaran maksimal 30 hari setelah invoice diterima.</li>
                <li>• Silahkan konfirmasi harga terbaru melalui CS kami sebelum melakukan pemesanan.</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <QuotationForm />
    </>
  );
}