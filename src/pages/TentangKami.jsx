import React from "react";
import { Shield, Settings, BarChart3, FileText, ArrowRight, CheckCircle, LayoutDashboard, FileSignature, Siren, Truck } from "lucide-react";
import { motion } from "framer-motion";
import komitmenBanner from "@/assets/tentang/komitmen-kami-banner.jpg";
import StatsBar from "@/components/home/StatsBar";
import Seo from "@/components/Seo";

const TEAM_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/b09b26089_generated_image.png";
const HERO_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/ae5dc6f53_generated_image.png";

const features = [
  { icon: LayoutDashboard, title: "Portal Limbah Terintegrasi", badge: "Pertama di Indonesia", desc: "Akses data pengambilan, manifest, kontrak, hingga dokumentasi dalam satu dashboard real-time." },
  { icon: FileSignature, title: "Kontrak Elektronik", badge: "Opsional", desc: "Tanda tangan digital membuat proses kontrak lebih cepat, selesai dalam 2 hari." },
  { icon: Siren, title: "Emergency Pickup", desc: "Layanan pengambilan darurat untuk kebutuhan limbah yang mendesak." },
  { icon: Truck, title: "Armada Lengkap", desc: "Berbagai jenis kendaraan siap melayani kebutuhan skala kecil hingga besar." },
  { icon: Shield, title: "Berizin", desc: "Perizinan yang lengkap dan aktif, untuk pelayanan yang aman." },
  { icon: BarChart3, title: "Menyeluruh", desc: "Pelayanan mencakup semua sisi kebutuhan pengelolaan limbah anda." },
  { icon: Settings, title: "Fleksibel", desc: "Konsultasikan penanganan dan kebutuhan khusus anda." },
  { icon: FileText, title: "Pelaporan", desc: "Dapatkan laporan dan dokumen lengkap bersama kami." },
];

const timeline = [
  { year: "2009", title: "Pendirian Perusahaan", desc: "PT. Media Cahaya didirikan sebagai perusahaan yang menyediakan pelayanan jasa logistik dan sewa kendaraan." },
  { year: "2012", title: "Ekspansi Armada", desc: "Perusahaan memiliki lebih dari 5 unit kendaraan untuk melayani kebutuhan logistik pelanggan." },
  { year: "2016", title: "Pembukaan 3 Pool", desc: "Membuka 3 pool operasional di Bogor, Jakarta, dan Cikarang untuk memperluas jangkauan layanan." },
  { year: "2019", title: "Terjun ke Limbah B3", desc: 'PT. Media Cahaya Cerah melalui merek "LIMBAHIN" melakukan ekspansi untuk masuk kedalam industri pelayanan pengelolaan limbah B3.' },
  { year: "2026", title: "197 Kode Limbah", desc: "Kini LIMBAHIN mengelola 197 kode limbah, melayani 500+ mitra perusahaan di 1K+ titik pelayanan seindonesia dengan 20+ armada." },
];

export default function TentangKami() {
  return (
    <>
      <Seo
        title="Tentang LIMBAHIN, Pengelola Limbah B3 Berizin"
        description="LIMBAHIN by PT Media Cahaya Cerah, perusahaan pengelolaan dan pengangkutan limbah B3 berizin resmi, berkantor di Cikarang dan melayani seluruh Jabodetabek."
        path="/tentang-kami"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#1a2333] to-[#162930] py-20 md:py-28">
        <div className="absolute inset-0 opacity-5"><div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Tentang Kami</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Komitmen Kami</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              LIMBAHIN adalah solusi untuk permasalahan limbah anda. Dikelola oleh PT. Media Cahaya Cerah (MCC), kami menjunjung tinggi pelayanan yang mengutamakan kebutuhan dan kepuasan pelanggan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full-bleed banner image, spans the entire viewport width */}
      <div className="w-full">
        <img
          src={komitmenBanner}
          alt="Pelaporan, Transparansi, Berizin — Prioritas Kami"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Perusahaan & Latar Belakang */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Perusahaan</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-3 mb-6">Perusahaan Limbah Berskala Nasional</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Kami bertujuan untuk menjadi <em>"Perusahaan limbah berskala nasional yang dipercaya untuk mengelola limbah dengan baik dan benar"</em>.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Terus berupaya untuk <em>"Memberikan pelayanan berstandar profesional dengan harga kompetitif yang tidak hanya fleksibel, aman dan tentunya berizin, namun juga sesuai kebutuhan dan keinginan klien."</em>
              </p>
              <p className="text-gray-600 leading-relaxed">
                LIMBAHIN sebagai perusahaan yang menerima masuk semua limbah, kami siap mengelola berbagai jenis limbah B3 maupun non-B3 dengan standar pemusnahan yang aman dan berizin.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Latar Belakang</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-3 mb-6">Perjalanan Kami</h2>
              <div className="space-y-5">
                {timeline.map((t) => (
                  <div key={t.year} className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#2ba5ad] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#2ba5ad]/20 flex-shrink-0">{t.year}</div>
                    <div>
                      <h3 className="font-bold text-[#1a1a2e] mb-1">{t.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Highlights */}
          <StatsBar className="mb-20" />

          {/* Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-xl mb-20">
            <img src={HERO_IMG} alt="Petugas LIMBAHIN menggunakan APD" className="w-full h-[400px] object-cover" />
          </motion.div>

          {/* Mengapa Kami */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Mengapa Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3">Keunggulan LIMBAHIN</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.1, duration: 0.5 }} className="relative text-center p-6 rounded-2xl bg-[#f7fafb] border border-gray-100 hover:shadow-lg transition-shadow">
                {f.badge && (
                  <span className="absolute top-3 right-3 bg-[#2ba5ad]/10 text-[#2ba5ad] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
                <div className="w-14 h-14 rounded-2xl bg-[#e8f7f8] flex items-center justify-center mx-auto mb-4">
                  <f.icon size={24} className="text-[#2ba5ad]" />
                </div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Berizin & Terpercaya</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3 mb-6">Kelola Limbah Anda dengan Benar</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Kelola limbah anda melalui proses pelayanan yang mudah dimengerti, transparan dan cepat. Pastikan limbah anda dikelola dengan benar dan berizin oleh LIMBAHIN bersama PT. Media Cahaya Cerah.
              </p>
              <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20perkenalkan%20nama%3A%20%20%20dari%3A%20%20%20kami%20ingin%20konsultasi%20tentang%3A%0A%5BBTN35%5D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25">
                Konsultasi Gratis Sekarang <ArrowRight size={16} />
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-xl">
              <img src={TEAM_IMG} alt="Tim LIMBAHIN" className="w-full h-[380px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}