import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const PARTNER_LOGOS = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/79b566f82_image.png";

const partners = [
  "PT. Jaya Swarasa Agung. Tbk", "PT. Samudera Indonesia. Tbk", "GAGA Group",
  "RS Tiara Kasih Sejati", "RSU Zahirah Depok", "RSU Bina Kasih",
  "Medilab Laboratorium", "RSU Latersia", "RS Tarumajaya Bekasi",
  "Dinas Kesehatan Kabupaten", "Prossi Clinic", "PT. Asia Hoda Indonesia",
  "Kementerian BKPM", "MyLab Group", "RS Bethesda",
  "RS Ibu Anak Nurul Anissa", "PT. Tiger Star Indonesia", "RATA Dental",
  "GWS Clinic Group", "RS Santo Antonio", "Klinik Fakhira",
  "RS Graha Kurnia", "Balai Kesehatan Kolinlamil", "Liderlab",
  "RS Prima Qonita", "Hewania Group", "Sozo Dental",
  "RSU Materna", "PT. Plastik Karawang Flexindo", "Balai Kesehatan Kolinlamil",
  "Genomics Lab", "PT. Santana Grafika Indonesia", "Asha Group",
  "Blink Beauty Clinic", "Somethinc Clinic", "PT. Interskala Medika Indonesia",
];

const testimonials = [
  { name: "Evan F", role: "Direktur — PT. Asia Hoda Indonesia", rating: 5, text: "MCC sangat profesional dalam pengelolaan limbah B3 kami. Dokumen lengkap, tepat waktu, dan komunikasi yang baik." },
  { name: "Phillip M", role: "PT. Plastik Karawang Flexindo", rating: 5, text: "Pelayanan rutin LIMBAHIN membantu operasional pabrik kami berjalan lancar. Harga kompetitif dan tim berpengalaman." },
  { name: "Ari Dwi", role: "Finance — RS Tiara Kasih", rating: 5, text: "Pengambilan limbah medis selalu tepat waktu dan manifest digitalnya sangat membantu administrasi rumah sakit kami." },
  { name: "Grace M", role: "Manajemen — RS Materna", rating: 5, text: "Tim PT. Media Cahaya Cerah responsif dan membantu kami dalam pengelolaan limbah B3 sesuai regulasi KLHK." },
  { name: "Sri Sartika", role: "Pelaksana — RSU Full Bethesda", rating: 5, text: "Pelayanan konsisten dan dokumen lengkap. Sertifikat pemusnahan selalu diberikan tepat waktu untuk kepatuhan kami." },
  { name: "Rafika", role: "Bag. Umum — GSI Lab", rating: 5, text: "MCC sangat membantu kami dalam pengelolaan Festronik. Tim mereka selalu siap membantu proses manifest elektronik dengan sabar." },
];

const sectors = [
  { icon: "🏥", label: "Rumah Sakit" }, { icon: "💊", label: "Klinik & Puskesmas" }, { icon: "👨‍⚕️", label: "Praktek Dokter" },
  { icon: "🏭", label: "Pabrik & Manufaktur" }, { icon: "🏨", label: "Hotel & Resort" }, { icon: "🏢", label: "Perkantoran" },
  { icon: "🧪", label: "Laboratorium" }, { icon: "🛒", label: "Retail & Mall" }, { icon: "🏗️", label: "Konstruksi" },
  { icon: "📦", label: "Gudang & Logistik" }, { icon: "🚗", label: "Otomotif" }, { icon: "🌿", label: "Pertanian" },
  { icon: "⚡", label: "Energi & Utilitas" }, { icon: "🎓", label: "Pendidikan" }, { icon: "🏛️", label: "Pemerintahan" },
];

export default function PartnerKlien() {
  return (
    <>
      <Seo
        title="Klien & Partner Pengelolaan Limbah B3"
        description="Perusahaan, rumah sakit, dan klinik di Jabodetabek yang mempercayakan pengelolaan limbah B3 mereka kepada LIMBAHIN."
        path="/layanan/partner-klien"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Partner & Klien</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Dipercaya oleh 500+ mitra perusahaan dan instansi di seluruh Indonesia.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-[#2ba5ad]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-yellow-300 text-yellow-300" />)}
            <span className="text-4xl font-bold">4.9/5</span>
          </div>
          <p className="text-white/90 text-lg font-medium">Kepuasan dari 500+ Mitra Perusahaan & Instansi</p>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Mitra Kami</span>
            <h2 className="text-3xl font-bold text-[#1a1a2e] mt-3">Logo Partner & Klien</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Perusahaan dan instansi yang mempercayakan pengelolaan limbah mereka kepada LIMBAHIN.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-12">
            <img src={PARTNER_LOGOS} alt="Logo Partner & Klien LIMBAHIN" className="w-full object-contain bg-white" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {partners.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-center text-center px-3 py-4 bg-[#f7fafb] rounded-lg border border-gray-100 hover:border-[#2ba5ad]/30 hover:shadow-sm transition-all">
                <span className="text-xs font-semibold text-gray-600">{p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-[#f7fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Sektor</span>
            <h2 className="text-3xl font-bold text-[#1a1a2e] mt-3">13-18 Sektor Industri Dilayani</h2>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {sectors.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2ba5ad]/30 hover:shadow-md transition-all text-center">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium text-gray-600">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Testimoni</span>
            <h2 className="text-3xl font-bold text-[#1a1a2e] mt-3">Apa Kata Klien Kami</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#f7fafb] rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e8f7f8] flex items-center justify-center text-[#2ba5ad] font-bold text-sm">{t.name.charAt(0)}</div>
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

      <QuotationForm />
    </>
  );
}