import React, { useState } from "react";
import { Shield, Settings, BarChart3, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
// import siapaKamiImg from "@/assets/gallery/Medis - Rumah Sakit.jpg";

const tabs = [
  {
    label: "Misi Kami",
    content: "Menyediakan layanan pengolahan limbah B3 yang aman, efisien, dan ramah lingkungan demi mewujudkan pembangunan industri nasional yang berkelanjutan, sekaligus menjamin perlindungan hukum (compliance) klien secara optimal.",
    bullets: ["Layanan Pengangkutan Handal", "Analisis Laboratorium Akurat", "Harga Bersaing & Transparan", "Jaminan Kepuasan Klien"]
  },
  {
    label: "Keahlian Kami",
    content: "Dengan pengalaman lebih dari 5 tahun dalam pengelolaan limbah B3, tim kami terdiri dari tenaga ahli bersertifikat yang memahami regulasi KLHK secara mendalam dan mampu menangani berbagai jenis limbah berbahaya.",
    bullets: ["197 Jenis Limbah Terkelola", "Tenaga Ahli Bersertifikat", "Armada Modern & Berstandar", "Teknologi Festronik Terintegrasi"]
  },
  {
    label: "Nilai Utama",
    content: "Kami memegang teguh transparansi, kepatuhan hukum, dan kepuasan klien sebagai fondasi layanan kami. Setiap keputusan bisnis kami didasarkan pada nilai-nilai ini.",
    bullets: ["Transparansi Penuh", "Kepatuhan Hukum 100%", "Orientasi Klien", "Inovasi Berkelanjutan"]
  }];


const statsRow = [
  { value: "15+", label: "Tahun Pengalaman", sub: "Melayani pengolahan limbah B3 dengan amanah" },
  { value: "99.4%", label: "Kepuasan Mitra", sub: "Tingkat keandalan & kepatuhan regulasi sangat tinggi" },
  { value: "100%", label: "Izin Resmi KLHK", sub: "Seluruh operasional didukung perizinan legal pemerintah" },
  { value: "24/7", label: "Layanan Siaga B3", sub: "Respons cepat pengangkutan & konsultasi darurat limbah" }];


export default function WhyUsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src="https://lh3.googleusercontent.com/d/1B1H7KTwmLqCGshiECrsMsT_m1_1ud8u8" referrerPolicy="no-referrer" alt="Fasilitas pengelolaan limbah B3 LIMBAHIN" className="w-full h-[420px] object-cover" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Siapa Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3 mb-4">Layanan Pengelolaan Limbah untuk Semua Sektor Industri</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              PT. Media Cahaya Cerah mengelola <strong>LIMBAHIN</strong>, platform layanan pengelolaan limbah Bahan Berbahaya dan Beracun (B3) yang mengintegrasikan pengumpulan, pengangkutan, penyimpanan, dan pemusnahan akhir secara terstandar di bawah naungan Kementerian Lingkungan Hidup dan Kehutanan (KLHK).
            </p>

            <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1">
              {tabs.map((t, i) =>
                <button key={t.label} onClick={() => setActiveTab(i)} className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === i ? "bg-white text-[#2ba5ad] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{tabs[activeTab].content}</p>
            <div className="grid grid-cols-2 gap-2">
              {tabs[activeTab].bullets.map((b) =>
                <div key={b} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={14} className="text-[#2ba5ad] flex-shrink-0" /> {b}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsRow.map((s, i) =>
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 bg-[#f7fafb] rounded-xl border border-gray-100">
              <div className="text-3xl font-bold text-[#2ba5ad] mb-1">{s.value}</div>
              <div className="font-semibold text-[#1a1a2e] text-sm mb-1">{s.label}</div>
              <div className="text-gray-400 text-xs">{s.sub}</div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}