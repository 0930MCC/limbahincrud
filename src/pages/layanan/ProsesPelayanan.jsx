import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Truck,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  HelpCircle,
  FileSignature,
} from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const processPhases = [
  {
    step: "01",
    title: "Konsultasi Teknis & Identifikasi Limbah",
    icon: FileText,
    badge: "Tahap Persiapan",
    summary:
      "Penentuan kode limbah B3, verifikasi karakteristik material, estimasi volume, dan peninjauan kesiapan TPS di lokasi.",
    details: [
      "Pemeriksaan jenis dan kode limbah berdasarkan Lampiran IX PP No. 22 Tahun 2021 (Medis, Industri, Komersial, atau Produk Reject).",
      "Kajian Lembar Data Keselamatan (MSDS) dan rekomendasi jenis wadah kemasan yang sesuai standar.",
      "Estimasi volume timbulan (Kg/Ton) untuk menentukan ritase dan skema frekuensi pengambilan yang paling efisien.",
      "Konsultasi persyaratan teknis Tempat Penyimpanan Sementara (TPS Limbah B3) berizin di fasilitas penghasil.",
    ],
  },
  {
    step: "02",
    title: "Perjanjian Kerjasama (SPK/MOU) & Integrasi Sistem",
    icon: FileSignature,
    badge: "Legalitas & Kontrak",
    summary:
      "Penerbitan draf kontrak resmi dalam 2 hari kerja, penandatanganan digital sah, dan sinkronisasi akun Festronik.",
    details: [
      "Penyusunan Perjanjian Kerjasama (MOU/SPK) resmi berbadan hukum PT Media Cahaya Cerah berizin KLHK.",
      "Tanda tangan elektronik bersertifikasi via Mekari e-Sign untuk proses cepat tanpa perlu kirim hardcopy berkali-kali.",
      "Pengecekan dan sinkronisasi akun Festronik KLHK (SIMPEL) antara penghasil, pengangkut, dan pemanfaat/pengolah.",
      "Pemberian akses ke Portal Klien LIMBAHIN untuk pemantauan data real-time, invoice, dan arsip dokumen.",
    ],
  },
  {
    step: "03",
    title: "Penjadwalan & Pengangkutan Armada Berizin",
    icon: Truck,
    badge: "Operasional On-Site",
    summary:
      "Penjemputan tepat waktu oleh petugas ber-APD lengkap dengan armada khusus berizin KLHK & rekomendasi Dishub.",
    details: [
      "Penjadwalan penjemputan fleksibel: rute rutin mingguan/bulanan, atau on-demand emergency pickup.",
      "Petugas terlatih dengan APD lengkap (safety shoes, sarung tangan khusus, masker, kacamata pelindung).",
      "Penimbangan on-site di lokasi menggunakan timbangan terkalibrasi dan penerbitan Berita Acara Serah Terima digital.",
      "Pengangkutan menggunakan kendaraan boks tertutup berizin Ditjen Hubdat Kemenhub dan izin angkut KLHK dengan sistem GPS tracking.",
      "Pencatatan langsung manifest elektronik (Festronik) di tempat penjemputan.",
    ],
  },
  {
    step: "04",
    title: "Pengolahan & Pemusnahan Akhir di Fasilitas Berizin",
    icon: Flame,
    badge: "Pemusnahan Ramah Lingkungan",
    summary:
      "Pemusnahan atau pemanfaatan limbah di fasilitas rekanan berizin resmi KLHK dengan teknologi mutakhir.",
    details: [
      "Insinerasi suhu tinggi (>1.000°C) dengan sistem Continuous Emission Monitoring System (CEMS) untuk limbah infeksius dan medis.",
      "Alternative Fuel & Raw Material (AFM) melalui ko-prosesing kiln semen untuk limbah industri bernilai kalori tinggi.",
      "Stabilisasi dan solidifikasi untuk limbah anorganik dan sludge logam berat sebelum penimbunan di sanitary landfill kelas I.",
      "Pemusnahan produk reject, obat/makanan kedaluwarsa, dan kosmetik dengan dokumentasi video dan berita acara saksi.",
    ],
  },
  {
    step: "05",
    title: "Terbit Dokumen Manifest, Berita Acara & Sertifikat CoD",
    icon: Award,
    badge: "Audit & Kepatuhan",
    summary:
      "Penerbitan dokumen kepatuhan hukum lengkap: Berita Acara, Manifest Festronik final, dan Certificate of Destruction.",
    details: [
      "Penyelesaian status manifest Festronik di portal KLHK (SIMPEL) hingga status 'Diterima Pengolah'.",
      "Penerbitan Certificate of Destruction (CoD) / Sertifikat Pemusnahan resmi sebagai bukti hukum.",
      "Pengiriman dokumen rangkap dalam bentuk digital (PDF via portal & email) dan hardcopy berkas fisik ke kantor Anda.",
      "Dukungan dokumentasi lengkap untuk keperluan audit kepatuhan lingkungan, Proper, ISO 14001, atau akreditasi fasilitas kesehatan.",
    ],
  },
];

const slas = [
  { label: "Respon Penawaran / Quotation", value: "< 24 Jam", icon: Clock },
  { label: "Penerbitan Draf Kontrak MOU", value: "1 - 2 Hari", icon: FileCheck },
  { label: "Emergency Pickup Armada", value: "12 - 48 Jam", icon: Truck },
  { label: "Penerbitan Sertifikat CoD", value: "7 - 14 Hari", icon: Award },
];

const faqs = [
  {
    q: "Apakah limbah harus ditimbang sebelum diangkut?",
    a: "Ya. Setiap pengambilan wajib dilakukan penimbangan di TPS lokasi atau menggunakan jembatan timbang terkalibrasi, disaksikan oleh kedua belah pihak dan dicatat dalam Berita Acara resmi serta manifest Festronik.",
  },
  {
    q: "Bagaimana cara melaporkan manifest melalui Festronik?",
    a: "Tim kami yang akan menginput dan memproses alur manifest Festronik Anda di sistem KLHK. Anda hanya perlu menyediakan kode akun SIMPEL/Festronik instansi Anda atau tim kami siap memandu proses integrasi dari awal.",
  },
  {
    q: "Berapa lama kontrak MOU pengangkutan limbah B3 berlaku?",
    a: "Standar perjanjian kerjasama adalah 1 (satu) tahun dan dapat diperpanjang secara otomatis atau sesuai kesepakatan. Kami juga melayani pengangkutan sekali jalan (SPK Min / SPK Max) tanpa kontrak tahunan.",
  },
  {
    q: "Apakah LIMBAHIN memiliki izin resmi dari KLHK?",
    a: "PT Media Cahaya Cerah beroperasi dengan legalitas lengkap: izin pengangkutan dan pengelolaan limbah B3 dari Kementerian Lingkungan Hidup dan Kehutanan (KLHK) serta rekomendasi pengangkutan dari Kementerian Perhubungan.",
  },
];

export default function ProsesPelayanan() {
  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Proses Pengelolaan dan Pengangkutan Limbah B3",
    "description": "5 tahapan terstandar pengelolaan limbah B3 bersama LIMBAHIN: konsultasi teknis, kontrak SPK/MOU, penjemputan berizin, pemusnahan di insinerator/AFM, dan penerbitan sertifikat CoD.",
    "step": processPhases.map((phase, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": phase.title,
      "text": phase.summary,
    })),
  };

  return (
    <>
      <Seo
        title="Proses & Tahapan Layanan Pengangkutan Limbah B3"
        description="Pelajari 5 tahapan terstandar pengelolaan limbah B3 LIMBAHIN: konsultasi teknis kode limbah, kontrak MOU resmi, penjemputan armada ber-Festronik, pemusnahan ramah lingkungan, dan sertifikat CoD."
        path="/layanan/proses-pelayanan"
        jsonLd={schemaHowTo}
      />

      {/* Hero Section */}
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
              Standard Operating Procedure
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4 leading-tight">
              Proses & Tahapan Layanan Pengelolaan Limbah B3
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Panduan lengkap alur operasional pengelolaan limbah B3 LIMBAHIN: dari identifikasi teknis, legalitas kontrak MOU, penjemputan berizin, hingga penerbitan sertifikat pemusnahan (CoD).
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#alur-tahapan"
                className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25"
              >
                Lihat 5 Tahapan Lengkap
              </a>
              <a
                href="#pendaftaran-form"
                className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                Konsultasi & Buat Kontrak
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SLA Metrics Bar */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {slas.map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <s.icon className="w-5 h-5 text-[#2ba5ad] mx-auto mb-2" />
                <div className="text-xl md:text-2xl font-bold text-[#1a1a2e] font-mono">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Core Phases Detailed Section */}
      <section id="alur-tahapan" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Langkah Demi Langkah
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-2 mb-3">
              5 Tahapan Pengelolaan Limbah B3 Transparan & Legal
            </h2>
            <p className="text-gray-600 text-sm">
              Seluruh proses dirancang untuk memastikan kepatuhan 100% terhadap regulasi Kementerian Lingkungan Hidup dan Kehutanan (KLHK) serta kemudahan administrasi bagi institusi Anda.
            </p>
          </div>

          <div className="space-y-8">
            {processPhases.map((phase, idx) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex items-center gap-4 md:flex-col md:items-center">
                    <span className="w-12 h-12 rounded-xl bg-[#2ba5ad]/10 text-[#2ba5ad] flex items-center justify-center font-bold font-mono text-lg shrink-0">
                      {phase.step}
                    </span>
                    <span className="md:hidden text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e6f7f8] text-[#2ba5ad]">
                      {phase.badge}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <phase.icon className="w-5 h-5 text-[#2ba5ad]" />
                        <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e]">
                          {phase.title}
                        </h3>
                      </div>
                      <span className="hidden md:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e6f7f8] text-[#2ba5ad]">
                        {phase.badge}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {phase.summary}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                      {phase.details.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Checklist Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
                Persyaratan Klien
              </span>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mt-2 mb-4">
                Dokumen & Fasilitas yang Perlu Disiapkan Penghasil
              </h2>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                Untuk mempercepat proses serah terima dan validasi regulasi KLHK, pihak fasilitas penghasil limbah dianjurkan menyiapkan:
              </p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ba5ad] shrink-0 mt-1" />
                  <span><strong>Identitas & Legalitas Badan Usaha:</strong> NIB, NPWP perusahaan, dan identitas penanggung jawab teknis lingkungan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ba5ad] shrink-0 mt-1" />
                  <span><strong>Akun Festronik / SIMPEL:</strong> ID instansi penghasil limbah yang terdaftar di Kementerian LHK.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ba5ad] shrink-0 mt-1" />
                  <span><strong>Tempat Penyimpanan Sementara (TPS):</strong> Area penyimpanan limbah B3 beratap dengan lantai kedap air dan simbol B3.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ba5ad] shrink-0 mt-1" />
                  <span><strong>Kemasan Berstandar:</strong> Safety box medis untuk jarum suntik, drum baja untuk oli/pelarut, dan jeriken bersegel.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#2ba5ad]/20 text-[#3cc0c9]">
                <ShieldCheck className="w-4 h-4" /> Jaminan Kepatuhan Hukum
              </div>
              <h3 className="text-xl font-bold">
                Bebas Risiko Sanksi Lingkungan Hidup
              </h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Setiap kilogram limbah B3 yang diangkut oleh LIMBAHIN tercatat secara sah di SIMPEL KLHK. Anda mendapatkan manifest resmi, berita acara, dan sertifikat pemusnahan yang melindungi institusi Anda dari sanksi pidana dan denda UU No. 32 Tahun 2009.
              </p>
              <div className="pt-2">
                <a
                  href="#pendaftaran-form"
                  className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-5 py-2.5 rounded-lg font-semibold text-xs transition"
                >
                  Mulai Pendaftaran Layanan <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ on Process */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Pertanyaan Populer
            </span>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mt-1">
              FAQ Seputar Proses Pengangkutan & Pengelolaan
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <h4 className="font-bold text-sm text-[#1a1a2e] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#2ba5ad] shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Anchor */}
      <div id="pendaftaran-form">
        <QuotationForm defaultTab="pendaftaran" />
      </div>
    </>
  );
}
