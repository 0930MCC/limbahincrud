import React from "react";
import { motion } from "framer-motion";
import { Box, CalendarClock, Recycle, PackageCheck, FileText, ArrowRight } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const stages = [
  {
    icon: Box,
    num: "01",
    title: "Penghasil Limbah (TPS)",
    desc: "Limbah dihasilkan di Tempat Pengumpulan Sementara (TPS). Kami menyediakan alat dan fasilitas khusus untuk penyimpanan limbah B3 yang aman dan sesuai standar.",
    points: ["Penyediaan safety box & kontainer", "Fasilitas penyimpanan berstandar B3", "Pelabelan & segregasi limbah"],
  },
  {
    icon: CalendarClock,
    num: "02",
    title: "Penjadwalan & Pengambilan",
    desc: "Limbah dilakukan penjadwalan pengambilan. Petugas kami datang ke lokasi, memakai APD lengkap, menerbitkan dokumen serah terima, menimbang limbah jika kecil/sedikit, dan memuatnya ke kendaraan.",
    points: ["Petugas ber-APD lengkap", "Dokumen serah terima digital", "Penimbangan limbah on-site", "Pemuatan ke kendaraan berizin"],
  },
  {
    icon: Recycle,
    num: "03",
    title: "Pengumpulan & Pengolahan",
    desc: "Limbah dibawa ke pengumpulan jika diperlukan atau langsung diolah sesuai dengan jenis dan sifat limbah. Pengolahan limbah B3 meliputi alternative fuel and material, insinerasi, filtrasi IPAL, dan pemanfaatan lainnya. Untuk domestik dan ekonomis, pengolahannya berbeda.",
    points: ["Alternative Fuel & Material (AFM)", "Insinerasi (pembakaran terkontrol)", "Filtrasi IPAL", "Pemanfaatan limbah lainnya"],
  },
  {
    icon: PackageCheck,
    num: "04",
    title: "Penerimaan & Pembongkaran",
    desc: "Setelah limbah sudah diterima dan dibongkar di fasilitas pengolahan, dilakukan verifikasi dan pencatatan untuk memastikan semua limbah terdokumentasi dengan benar.",
    points: ["Verifikasi jumlah & jenis limbah", "Pembongkaran terkontrol", "Pencatatan di sistem"],
  },
  {
    icon: FileText,
    num: "05",
    title: "Terbit Dokumen Kelengkapan",
    desc: "Dokumen kelengkapan akan terbit dan dikirimkan baik secara hardcopy maupun softcopy kepada pelanggan sebagai bukti pengelolaan limbah yang sah dan transparan.",
    points: ["Berita Acara Serah Terima", "Sertifikat Pemusnahan (CoD)", "Manifest/Festronik", "Hardcopy & Softcopy"],
  },
];

export default function AlurLimbah() {
  return (
    <>
      <Seo
        title="Alur Pengelolaan Limbah B3 hingga Sertifikat CoD"
        description="Tahapan lengkap pengelolaan limbah B3 LIMBAHIN: pemilahan, penjemputan, pengangkutan dengan manifest Festronik, pemusnahan berizin, hingga sertifikat CoD."
        path="/layanan/alur-limbah"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Alur Limbah</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Dari penghasil limbah hingga terbit dokumen kelengkapan — lihat bagaimana kami mengelola limbah Anda dengan aman dan berstandar.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
                className={`relative flex gap-6 md:gap-0 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Icon node */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-[#2ba5ad] flex items-center justify-center shadow-lg shadow-[#2ba5ad]/30 ring-4 ring-white">
                    <stage.icon size={20} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className={`pl-20 md:pl-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="bg-[#f7fafb] rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <span className="text-xs font-bold text-[#2ba5ad]">{stage.num}</span>
                    <h3 className="text-lg font-bold text-[#1a1a2e] mt-1 mb-3">{stage.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{stage.desc}</p>
                    <ul className="space-y-1.5">
                      {stage.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1 h-1 rounded-full bg-[#2ba5ad] flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-8">
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%20tentang%20alur%20limbah%0A%5BBTN23%5D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25">
              Konsultasi Alur Limbah <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <QuotationForm />
    </>
  );
}