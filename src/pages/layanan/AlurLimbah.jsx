import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  CalendarClock,
  Recycle,
  PackageCheck,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const stages = [
  {
    icon: Box,
    num: "01",
    title: "Penghasil Limbah (TPS B3 Terstandar)",
    desc: "Limbah dihasilkan dari operasional klien dan disimpan di Tempat Penyimpanan Sementara (TPS) berizin. Kami menyediakan fasilitas wadah khusus, simbol B3, dan safety box medis.",
    points: [
      "Penyediaan safety box tahan tusukan & kantong plastik kuning (medis)",
      "Penyimpanan drum baja berpenutup untuk oli, solvent & bahan kimia",
      "Pemasangan label dan simbol karakteristik limbah B3 sesuai Permen LHK No. 6 Tahun 2021",
      "Pencatatan logbook neraca limbah harian untuk pelaporan berkala",
    ],
  },
  {
    icon: CalendarClock,
    num: "02",
    title: "Penjadwalan & Pengambilan On-Site",
    desc: "Penjadwalan penjemputan berkala sesuai masa simpan legal. Petugas ber-APD lengkap melakukan penimbangan akurat di tempat dan mencatat serah terima di sistem.",
    points: [
      "Penjemputan tepat waktu sebelum batas masa simpan TPS habis",
      "Petugas terlatih ber-APD lengkap (sarung tangan nitril/heavy-duty, masker respirator, safety shoes)",
      "Penimbangan langsung dengan timbangan digital terkalibrasi BMKG/Metrologi",
      "Penerbitan Berita Acara Serah Terima (BAST) fisik dan digital",
    ],
  },
  {
    icon: Recycle,
    num: "03",
    title: "Pengangkutan Berizin Festronik",
    desc: "Armada khusus boks tertutup berizin KLHK dan rekomendasi Kemenhub membawa limbah dengan sistem manifest elektronik (Festronik SIMPEL) yang terpantau real-time.",
    points: [
      "Kendaraan berizin angkut KLHK & Ditjen Perhubungan Darat Kemenhub",
      "Dilengkapi GPS tracking sistem pelacakan rute perjalanan",
      "Peralatan tanggap darurat (Spill Kit, APAR, P3K, SOP kecelakaan B3)",
      "Aktivasi barcode manifest digital Festronik oleh pengemudi dan pihak penghasil",
    ],
  },
  {
    icon: PackageCheck,
    num: "04",
    title: "Penerimaan & Pengolahan / Pemusnahan",
    desc: "Limbah diterima di fasilitas pengolahan atau pemusnahan berizin resmi KLHK, diverifikasi fisik & barcode, kemudian diproses sesuai karakteristiknya.",
    points: [
      "Insinerasi suhu tinggi (>1.000°C) dengan burner ganda untuk limbah medis infeksius",
      "Alternative Fuel & Raw Material (AFM) untuk limbah bernilai kalor di industri semen",
      "Stabilisasi & solidifikasi logam berat sebelum ditempatkan di landfill kelas I",
      "Pengolahan air limbah B3 cair via filtrasi & chemical precipitation IPAL",
    ],
  },
  {
    icon: FileText,
    num: "05",
    title: "Penerbitan Sertifikat Pemusnahan (CoD) & Manifest Final",
    desc: "Setelah limbah dimusnahkan secara aman dan tuntas, seluruh dokumen legalitas terbit sebagai bukti kepatuhan audit hukum lingkungan bagi perusahaan Anda.",
    points: [
      "Sertifikat Pemusnahan resmi (Certificate of Destruction / CoD)",
      "Manifest Festronik final berstatus 'Selesai / Dimusnahkan' di server SIMPEL KLHK",
      "Arsip digital yang dapat diunduh kapan saja melalui Portal Klien LIMBAHIN",
      "Dokumen fisik (hardcopy) dikirimkan via ekspedisi resmi ke kantor klien",
    ],
  },
];

const storageRules = [
  {
    kategori: "Kategori 1 (Bahaya Akut)",
    volume: "≥ 50 Kg / hari",
    limit: "Maksimal 90 Hari",
    desc: "Limbah medis infeksius RS, limbah kimia reaktif/eksplosif pabrik skala besar.",
  },
  {
    kategori: "Kategori 1 (Bahaya Akut)",
    volume: "< 50 Kg / hari",
    limit: "Maksimal 180 Hari",
    desc: "Klinik pratama, puskesmas, apotek, atau laboratorium pengujian kecil.",
  },
  {
    kategori: "Kategori 2 (Sumber Tidak Spesifik)",
    volume: "Semua Kuantitas",
    limit: "Maksimal 365 Hari",
    desc: "Limbah elektronik, kemasan bekas terkontaminasi, pelarut terpakai, aki/baterai.",
  },
];

export default function AlurLimbah() {
  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Alur Pengelolaan Limbah B3",
    "provider": {
      "@type": "Organization",
      "name": "LIMBAHIN",
      "url": "https://www.mediacahayacerah.com",
    },
    "description": "Alur pengangkutan dan pemusnahan limbah B3 dari TPS penghasil, Festronik KLHK, insinerasi/AFM, hingga sertifikat CoD.",
    "serviceType": "Hazardous Waste Management",
  };

  return (
    <>
      <Seo
        title="Alur Pengelolaan Limbah B3 dari TPS hingga Sertifikat CoD"
        description="Pelajari alur lengkap limbah B3 dari Tempat Penyimpanan Sementara (TPS), masa simpan PP 22/2021, pengangkutan manifest Festronik, pemusnahan insinerator/AFM, hingga sertifikat CoD."
        path="/layanan/alur-limbah"
        jsonLd={schemaService}
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
              Cradle to Grave Compliance
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4 leading-tight">
              Alur Pengelolaan Limbah B3 dari TPS hingga CoD
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Memahami rantai pasok kepatuhan limbah berbahaya (B3): dari penyimpanan sementara di fasilitas Anda, pengangkutan ber-Festronik, hingga pemusnahan akhir bersertifikat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Batas Masa Simpan TPS Banner */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Regulasi PP No. 22 Tahun 2021
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mt-1">
              Batas Waktu Penyimpanan Limbah B3 di TPS
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-xl mx-auto">
              Penghasil wajib mengangkut limbah sebelum batas waktu penyimpanan kadaluarsa untuk menghindari sanksi administratif dan pidana lingkungan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {storageRules.map((r, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 hover:border-[#2ba5ad]/40 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">{r.kategori}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#2ba5ad] bg-[#e6f7f8] px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" /> {r.limit}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 mb-1">
                  Volume: {r.volume}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Stages Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Alur Kerja Operasional
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-2 mb-3">
              5 Tahapan Pengelolaan Limbah Berkelanjutan
            </h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              Bagaimana LIMBAHIN menjamin limbah B3 Anda terkelola secara akuntabel, aman, dan berizin resmi sejak penjemputan hingga musnah.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2ba5ad] via-[#2ba5ad]/30 to-transparent md:-translate-x-1/2" />

            {stages.map((stage, i) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative flex gap-6 md:gap-0 mb-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Icon node */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-[#2ba5ad] flex items-center justify-center shadow-lg shadow-[#2ba5ad]/30 ring-4 ring-white">
                    <stage.icon size={20} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`pl-20 md:pl-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                  }`}
                >
                  <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow text-left">
                    <span className="text-xs font-bold text-[#2ba5ad] font-mono">{stage.num}</span>
                    <h3 className="text-base md:text-lg font-bold text-[#1a1a2e] mt-1 mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">
                      {stage.desc}
                    </p>
                    <ul className="space-y-2 border-t border-gray-100 pt-3">
                      {stage.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-[#2ba5ad] shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a
              href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%20tentang%20alur%20limbah%0A%5BBTN23%5D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25"
            >
              Konsultasi Alur Pengelolaan Limbah Anda <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Form */}
      <div id="quotation-form">
        <QuotationForm defaultTab="penawaran" />
      </div>
    </>
  );
}