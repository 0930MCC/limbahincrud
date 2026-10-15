import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, MapPin, FileCheck2, Zap, LayoutDashboard, ArrowRight } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const reasons = [
  {
    no: "01",
    icon: ShieldCheck,
    title: "Berizin Resmi KLHK",
    desc: "Beroperasi dengan izin resmi dari Kementerian Lingkungan Hidup dan Kehutanan — legalitas terjamin.",
  },
  {
    no: "02",
    icon: Truck,
    title: "Armada Lengkap & SDM Terlatih",
    desc: "Tenaga terlatih bersertifikasi dengan armada kendaraan khusus pengangkut limbah B3 yang lengkap.",
  },
  {
    no: "03",
    icon: MapPin,
    title: "Cakupan JABODETABEK & Jawa Barat",
    desc: "Menjangkau seluruh wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi dengan lebih dari 1.000 titik layanan.",
  },
  {
    no: "04",
    icon: FileCheck2,
    title: "Manifest & Dokumentasi Lengkap",
    desc: "Setiap pengangkutan disertai manifest resmi dan sertifikat pemusnahan sebagai bukti kepatuhan regulasi.",
  },
  {
    no: "05",
    icon: Zap,
    title: "Respons Cepat & Fleksibel",
    desc: "Layanan penjemputan rutin terjadwal atau on-demand dengan waktu respons yang cepat sesuai kebutuhan. Mengikuti kebutuhan dari pada klien.",
  },
  {
    no: "06",
    icon: LayoutDashboard,
    title: "Portal & Dashboard Terintegrasi",
    desc: "Akses portal dan dashboard digital untuk pemantauan, pelaporan, dan manajemen limbah secara real-time dan terintegrasi.",
    highlight: true,
  },
];

export default function MengapaKami() {
  return (
    <>
      <Seo
        title="Mengapa Memilih Jasa Limbah B3 LIMBAHIN"
        description="Armada dan izin resmi, manifest elektronik Festronik, sertifikat pemusnahan CoD, dan respons cepat dari Cikarang untuk klien industri dan fasilitas kesehatan Jabodetabek."
        path="/layanan/mengapa-kami"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Mengapa Kami</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto mb-8">
              Alasan lebih dari 500+ mitra perusahaan & instansi mempercayakan pengelolaan limbah B3 mereka kepada LIMBAHIN.
            </p>
            <a
              href="#quotation"
              className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25"
            >
              Minta Penawaran <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#f7fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.no}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`rounded-2xl p-7 border transition-shadow ${
                    r.highlight
                      ? "bg-[#0e2229] border-transparent shadow-xl"
                      : "bg-white border-gray-100 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 text-sm font-bold ${
                      r.highlight ? "bg-white/10 text-[#3cc0c9]" : "bg-[#e8f7f8] text-[#2ba5ad]"
                    }`}
                  >
                    {r.no}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${r.highlight ? "text-white" : "text-[#1a1a2e]"}`}>
                    {r.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${r.highlight ? "text-white/65" : "text-gray-500"}`}>
                    {r.desc}
                  </p>
                  <Icon className={`w-5 h-5 mt-5 ${r.highlight ? "text-[#3cc0c9]" : "text-[#2ba5ad]"}`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Langkah Selanjutnya</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-3 mb-4">Siap Memulai Kerjasama?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Lengkapi formulir pendaftaran di bawah untuk memulai pembuatan draf kontrak bersama tim LIMBAHIN - MCC.
          </p>
          <a
            href="#pendaftaran-form"
            className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/20"
          >
            Isi Formulir Pendaftaran
          </a>
        </div>
      </section>

      <QuotationForm defaultTab="pendaftaran" />
    </>
  );
}
