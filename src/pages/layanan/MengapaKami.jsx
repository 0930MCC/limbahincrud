import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  MapPin,
  FileCheck2,
  Zap,
  LayoutDashboard,
  Check,
  X,
} from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const keyPillars = [
  {
    no: "01",
    icon: ShieldCheck,
    title: "Legalitas & Izin Resmi KLHK",
    desc: "PT Media Cahaya Cerah beroperasi dengan legalitas resmi Kementerian Lingkungan Hidup dan Kehutanan (KLHK) serta rekomendasi Dirjen Perhubungan Darat Kementerian Perhubungan.",
    points: [
      "Izin Operasional Pengelolaan & Pengangkutan B3 aktif",
      "Kepatuhan ketat terhadap PP No. 22 Tahun 2021 & Permen LHK No. 6 Tahun 2021",
      "Kemitraan langsung dengan fasilitas pemusnah akhir berizin nasional",
    ],
  },
  {
    no: "02",
    icon: Truck,
    title: "Armada Khusus B3 & Driver Bersertifikat",
    desc: "Armada boks tertutup dirancang khusus untuk meminimalkan risiko tumpahan atau kontaminasi lingkungan, lengkap dengan fasilitas tanggap darurat.",
    points: [
      "Dilengkapi GPS tracking sistem pelacakan rute real-time",
      "Perlengkapan tanggap darurat B3: Spill Kit, APAR, dan P3K lengkap",
      "Pengemudi & teknisi terlatih bersertifikat kompetensi penanganan B3",
    ],
  },
  {
    no: "03",
    icon: LayoutDashboard,
    title: "Portal Klien Digital Pertama di Indonesia",
    desc: "Satu-satunya penyedia jasa limbah B3 yang menyediakan portal dashboard real-time untuk memantau seluruh riwayat pengambilan, neraca limbah, dan invoice.",
    highlight: true,
    points: [
      "Akses riwayat timbulan limbah (Kg) dan frekuensi ritase kapan saja",
      "Unduh salinan Berita Acara (BAST), MOU, dan Sertifikat Pemusnahan (CoD)",
      "Transparansi status penagihan dan rekapan audit lingkungan tahunan",
    ],
  },
  {
    no: "04",
    icon: FileCheck2,
    title: "Integrasi Manifest Digital Festronik KLHK",
    desc: "Seluruh limbah yang diangkut tercatat langsung ke sistem Festronik SIMPEL KLHK. Anda tidak perlu khawatir tentang manifest tercecer atau tidak terlapor.",
    points: [
      "Pembuatan barcode manifest langsung di lokasi penjemputan",
      "Pelaporan otomatis ke server Kementerian Lingkungan Hidup",
      "Manifest tuntas hingga status 'Selesai / Diterima Pengolah'",
    ],
  },
  {
    no: "05",
    icon: MapPin,
    title: "Basis Cikarang & Jangkauan Seluruh Jabodetabek",
    desc: "Pool operasional strategis di Cikarang Pusat dan armada bergerak memungkinkan respon penjemputan cepat di seluruh kawasan industri dan perkotaan.",
    points: [
      "Melayani Jakarta, Bogor, Depok, Tangerang, Bekasi, dan Cikarang",
      "Kawasan industri MM2100, GIIC, Jababeka, EJIP, KIIC, Suryacipta",
      "Dukungan jaringan rekanan pengolahan hingga Jawa Barat dan Banten",
    ],
  },
  {
    no: "06",
    icon: Zap,
    title: "Emergency Pickup & Skema Fleksibel",
    desc: "Kami memahami kondisi operasional pabrik atau klinik yang mendesak ketika kapasitas TPS limbah B3 hampir penuh.",
    points: [
      "Layanan penjemputan darurat (Emergency Pickup) 12-48 jam",
      "Pilihan paket fleksibel: Kontrak Tahunan, SPK Min, atau SPK Max",
      "Konsultasi teknis gratis perizinan TPS dan segregasi limbah",
    ],
  },
];

const comparisons = [
  {
    feature: "Legalitas & Izin KLHK",
    limbahin: "Izin resmi PT Media Cahaya Cerah berizin KLHK & Dishub aktif",
    others: "Seringkali perantara / calo tanpa izin angkut langsung",
  },
  {
    feature: "Manifest Limbah",
    limbahin: "100% Digital Festronik terintegrasi langsung SIMPEL KLHK",
    others: "Sebagian masih kertas manual atau sering terlambat input",
  },
  {
    feature: "Portal & Dokumentasi Klien",
    limbahin: "Portal online real-time untuk unduh BAST, MOU, dan neraca",
    others: "Dokumen manual via WhatsApp / email yang rentan hilang",
  },
  {
    feature: "Sertifikat Pemusnahan (CoD)",
    limbahin: "Pasti terbit resmi dari fasilitas pemusnah berizin",
    others: "Sering tertunda berbulan-bulan tanpa kepastian",
  },
  {
    feature: "Transparansi Penimbangan",
    limbahin: "Timbangan terkalibrasi di lokasi disaksikan pihak penghasil",
    others: "Perkiraan kasat mata atau penimbangan sepihak",
  },
  {
    feature: "Pilihan Skema Biaya",
    limbahin: "Paket tahunan terjangkau, SPK rutin, hingga per ritase darurat",
    others: "Syarat volume minimum tinggi yang memberatkan klinik/UKM",
  },
];

export default function MengapaKami() {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Mengapa Memilih LIMBAHIN untuk Jasa Pengelolaan Limbah B3",
    "description": "Keunggulan layanan pengelolaan limbah B3 PT Media Cahaya Cerah: izin resmi KLHK, portal klien digital, manifest Festronik, armada ber-GPS, dan respon cepat dari Cikarang.",
    "publisher": {
      "@type": "Organization",
      "name": "LIMBAHIN",
      "url": "https://www.mediacahayacerah.com"
    }
  };

  return (
    <>
      <Seo
        title="Mengapa Memilih LIMBAHIN untuk Pengelolaan Limbah B3"
        description="Keunggulan jasa limbah B3 LIMBAHIN: izin resmi KLHK, driver bersertifikat, manifest Festronik terintegrasi, portal monitoring klien, dan armada ber-GPS dari Cikarang."
        path="/layanan/mengapa-kami"
        jsonLd={schemaOrg}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">
              Keunggulan & Kepatuhan Legal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4 leading-tight">
              Mengapa Memilih LIMBAHIN sebagai Partner Limbah B3 Anda?
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Dipercaya oleh 500+ rumah sakit, fasilitas kesehatan, pabrik, dan korporasi di seluruh Jabodetabek karena transparansi, kepatuhan hukum 100%, dan teknologi portal modern.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#keunggulan"
                className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25"
              >
                Lihat 6 Keunggulan Utama
              </a>
              <a
                href="#perbandingan"
                className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                Tabel Perbandingan
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6 Key Pillars */}
      <section id="keunggulan" className="py-20 bg-[#f7fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Standar Profesionalisme
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-2 mb-3">
              Solusi Pengelolaan Limbah yang Menjamin Ketenangan Bisnis
            </h2>
            <p className="text-gray-500 text-sm">
              Kami menghadirkan integritas legal dan kepraktisan operasional agar tim manajemen lingkungan Anda fokus pada bisnis inti.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyPillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.no}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className={`rounded-2xl p-7 border flex flex-col justify-between transition-shadow ${
                    p.highlight
                      ? "bg-[#0e2229] border-transparent text-white shadow-xl"
                      : "bg-white border-gray-100 hover:shadow-lg"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold font-mono text-sm ${
                          p.highlight ? "bg-white/10 text-[#3cc0c9]" : "bg-[#e8f7f8] text-[#2ba5ad]"
                        }`}
                      >
                        {p.no}
                      </span>
                      <Icon className={`w-6 h-6 ${p.highlight ? "text-[#3cc0c9]" : "text-[#2ba5ad]"}`} />
                    </div>

                    <h3 className={`text-lg font-bold mb-2 ${p.highlight ? "text-white" : "text-[#1a1a2e]"}`}>
                      {p.title}
                    </h3>
                    <p className={`text-xs md:text-sm leading-relaxed mb-4 ${p.highlight ? "text-white/70" : "text-gray-600"}`}>
                      {p.desc}
                    </p>
                  </div>

                  <ul className={`space-y-2 border-t pt-4 ${p.highlight ? "border-white/10" : "border-gray-100"}`}>
                    {p.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.highlight ? "text-[#3cc0c9]" : "text-[#2ba5ad]"}`} />
                        <span className={p.highlight ? "text-white/80" : "text-gray-600"}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="perbandingan" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Perbandingan Layanan
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-2 mb-3">
              LIMBAHIN vs Pengangkut Konvensional
            </h2>
            <p className="text-gray-500 text-sm">
              Lihat perbedaan nyata dalam hal transparansi, integrasi digital, dan kepastian perlindungan hukum.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-[#1a1a2e] text-white">
                <tr>
                  <th className="py-4 px-6 font-semibold w-1/4">Parameter</th>
                  <th className="py-4 px-6 font-semibold w-3/8 text-[#3cc0c9] bg-[#162930]">
                    LIMBAHIN (PT Media Cahaya Cerah)
                  </th>
                  <th className="py-4 px-6 font-semibold w-3/8 text-gray-400">
                    Pengangkut Lain / Konvensional
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisons.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6 font-semibold text-[#1a1a2e]">{c.feature}</td>
                    <td className="py-4 px-6 bg-[#f0fafb] font-medium text-slate-800">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c.limbahin}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{c.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
            Solusi Bebas Khawatir
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-2 mb-4">
            Dapatkan Penawaran & Konsultasi Regulasi B3 Hari Ini
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xl mx-auto">
            Tim konsultan lingkungan kami siap membantu mengidentifikasi kode limbah dan menyusun skema penjemputan hemat biaya untuk fasilitas Anda.
          </p>
          <a
            href="#pendaftaran-form"
            className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-7 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/20"
          >
            Isi Formulir Pendaftaran Kerjasama
          </a>
        </div>
      </section>

      <div id="pendaftaran-form">
        <QuotationForm defaultTab="pendaftaran" />
      </div>
    </>
  );
}
