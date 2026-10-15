import React from "react";
import { Phone, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-[#1a1a2e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Butuh Bantuan Pengelolaan Limbah?<br className="hidden sm:block" /> Hubungi Kami Sekarang!</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">Tim kami siap membantu Anda. Konsultasi gratis untuk semua kebutuhan pengelolaan limbah Anda.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20perkenalkan%20nama%3A%20%20%20dari%3A%20%20%20kami%20ingin%20konsultasi%20tentang%3A%0A%5BBTN16%5D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/30">
              <Phone size={16} /> 0815 1700 5533 (CS WA)
            </a>
            <a href="https://api.whatsapp.com/send?phone=6285128005532&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20LIMBAHIN%0A%5BBTN17%5D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/5 transition-all">
              <Phone size={16} /> 0851 2800 5532 (Marketing)
            </a>
            <Link to="/layanan/proses-pelayanan#pendaftaran-form" className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/5 transition-all">
              <ClipboardList size={16} /> Daftar Sekarang
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}