import React, { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Ajukan Konsultasi & Detail Limbah",
    desc: "Anda dapat mengisi formulir pengajuan penawaran di situs ini yang terintegrasi dengan WhatsApp kami, atau langsung berdiskusi dengan tim ahli kami untuk berkonsultasi mengenai spesifikasi limbah B3 Anda.",
    badge: "Kepatuhan Hukum Terjamin",
  },
  {
    num: "02",
    title: "Survei Lokasi & Analisis Sampel",
    desc: "Tim kami akan melakukan survei lokasi untuk menganalisis jenis, volume, dan karakteristik limbah Anda guna menyiapkan penawaran yang paling tepat dan efisien.",
    badge: null,
  },
  {
    num: "03",
    title: "Penerbitan Penawaran & Kontrak Kerja",
    desc: "Kami menerbitkan penawaran harga yang transparan lengkap dengan detail layanan, jadwal pengambilan, dan dokumen kontrak yang sesuai regulasi KLHK.",
    badge: null,
  },
  {
    num: "04",
    title: "Pengangkutan Resmi Terintegrasi Festronik",
    desc: "Setiap kilogram limbah B3 yang kami jemput didaftarkan langsung ke Festronik (Sistem Manifest Elektronik KLHK) menggunakan akun khusus perusahaan Anda. Menjamin transparansi hukum 100%.",
    badge: null,
  },
  {
    num: "05",
    title: "Pemusnahan Aman & Terbit Dokumen",
    desc: "Limbah dimusnahkan di fasilitas pengolahan berizin. Kami menerbitkan Berita Acara Serah Terima, Sertifikat Pemusnahan (CoD), dan Manifest/Festronik sebagai bukti legal limbah telah dikelola dengan benar. Dokumen dikirimkan baik hardcopy maupun softcopy.",
    badge: "Berita Acara, Sertifikat & Manifest",
  },
];

export default function ProcessSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-[#f7fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Tahapan Kerja</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3 mb-3">
            Sistem Pengolahan Limbah Kami dalam<br className="hidden sm:block" /> 5 Langkah Mudah
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Kami menyederhanakan alur birokrasi, pengangkutan B3, hingga pengolahan akhir demi keandalan penuh.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Accordion */}
          <div className="lg:col-span-3 space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-xl border transition-all duration-200 ${open === i ? "border-[#2ba5ad]/30 bg-white shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${open === i ? "text-[#2ba5ad]" : "text-gray-400"}`}>{step.num}</span>
                    <span className={`font-semibold text-sm ${open === i ? "text-[#1a1a2e]" : "text-gray-700"}`}>{step.title}</span>
                  </div>
                  <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                        {step.desc}
                        {step.badge && (
                          <span className="inline-flex items-center gap-1.5 mt-3 bg-[#e8f7f8] text-[#2ba5ad] text-xs px-3 py-1 rounded-full">
                            <ShieldCheck size={12} /> {step.badge}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Info card */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#1a3a3d] rounded-2xl p-7 text-white sticky top-24">
              <span className="text-[#3cc0c9] text-xs font-semibold uppercase tracking-wider">Dokumen Integrasi</span>
              <h3 className="text-xl font-bold mt-2 mb-3">Semua Data Terlapor Resmi di Sistem KLHK (Festronik)</h3>
              <p className="text-white/65 text-sm leading-relaxed mb-5">
                Setiap kilogram limbah B3 yang kami jemput didaftarkan langsung ke Festronik (Sistem Manifest Elektronik KLHK) menggunakan akun khusus perusahaan Anda. Menjamin transparansi hukum 100%.
              </p>
              <ul className="space-y-2 mb-6">
                {["Berita Acara Serah Terima", "Sertifikat Pemusnahan (CoD)", "Manifest/Festronik Digital", "Rekonsiliasi Data Limbah Bulanan"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <ShieldCheck size={15} className="text-[#3cc0c9] flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20meminta%20draft%20kontrak%20kerja%0A%5BBTN15%5D"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-white text-[#1a3a3d] font-semibold text-sm py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Minta Draft Kontrak Kerja →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}