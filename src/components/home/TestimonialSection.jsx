import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Evan F", role: "Direktur — PT. Asia Hoda Indonesia", rating: 5, text: "MCC sangat profesional dalam pengelolaan limbah B3 kami. Dokumen lengkap, tepat waktu, dan komunikasi yang baik." },
  { name: "Phillip M", role: "PT. Plastik Karawang Flexindo", rating: 5, text: "Pelayanan rutin LIMBAHIN membantu operasional pabrik kami berjalan lancar. Harga kompetitif dan tim berpengalaman." },
  { name: "Ari Dwi", role: "Finance — RS Tiara Kasih", rating: 5, text: "Pengambilan limbah medis selalu tepat waktu dan manifest digitalnya sangat membantu administrasi rumah sakit kami." },
  { name: "Grace M", role: "Manajemen — RS Materna", rating: 5, text: "Tim PT. Media Cahaya Cerah responsif dan membantu kami dalam pengelolaan limbah B3 sesuai regulasi KLHK." },
  { name: "Sri Sartika", role: "Pelaksana — RSU Full Bethesda", rating: 5, text: "Pelayanan konsisten dan dokumen lengkap. Sertifikat pemusnahan selalu diberikan tepat waktu untuk kepatuhan kami." },
  { name: "Rafika", role: "Bag. Umum — GSI Lab", rating: 5, text: "MCC sangat membantu kami dalam pengelolaan Festronik. Tim mereka selalu siap membantu proses manifest elektronik dengan sabar." },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#f7fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Testimoni</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3 mb-3">Apa Kata Klien Kami</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />)}</div>
            <span className="text-2xl font-bold text-[#1a1a2e]">4.9/5</span>
          </div>
          <p className="text-gray-500 text-sm">Kepuasan dari 500+ Mitra Perusahaan & Instansi</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f7f8] flex items-center justify-center text-[#2ba5ad] font-bold text-sm">{t.name.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-[#1a1a2e] text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}