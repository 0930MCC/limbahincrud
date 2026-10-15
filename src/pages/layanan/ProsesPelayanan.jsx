import React from "react";
import { motion } from "framer-motion";
import ProcessSection from "@/components/home/ProcessSection";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const PROSES_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/84765904b_prosesmcc.png";
const PROSES_IMG2 = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/b9d02d314_prosesmcc2.png";

export default function ProsesPelayanan() {
  return (
    <>
      <Seo
        title="Proses Layanan Pengangkutan Limbah B3"
        description="Dari konsultasi, penawaran, kontrak, penjadwalan penjemputan, hingga dokumen pemusnahan: proses layanan pengangkutan limbah B3 LIMBAHIN di Jabodetabek."
        path="/layanan/proses-pelayanan"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Proses Pelayanan</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto mb-8">Kami menyederhanakan alur pengelolaan limbah B3 dalam 5 tahap yang transparan dan terstandar.</p>
            <a
              href="#pendaftaran-form"
              className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25"
            >
              Daftar Sekarang
            </a>
          </motion.div>
        </div>
      </section>

      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={PROSES_IMG} alt="Proses Pelayanan LIMBAHIN" className="w-full object-contain" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={PROSES_IMG2} alt="Proses Pelayanan MCC" className="w-full object-contain" />
            </motion.div>
          </div>
        </div>
      </section> */}

      <ProcessSection />

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
