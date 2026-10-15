import React from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";

const openings = [
  { title: "Driver Pengangkut Limbah B3", location: "Cikarang, Bekasi", type: "Full-time", desc: "Bertanggung jawab mengangkut limbah B3 dari lokasi klien ke fasilitas pengolahan sesuai SOP dan regulasi KLHK. Wajib memiliki SIM B1/B2.", req: ["SIM B1/B2 aktif", "Pengalaman mengemudi >2 tahun", "Sehat jasmani & rohani", "Bersedia bekerja di area JABODETABEK & sekitarnya"] },
  { title: "Marketing Executive", location: "Cikarang, Bekasi", type: "Full-time", desc: "Membangun dan memperluas jaringan klien baru dari sektor medis, industri, dan komersil. Target-driven dan berorientasi pada hasil.", req: ["Pengalaman marketing B2B min. 1 tahun", "Komunikasi lisan & tertulis yang baik", "Memiliki kendaraan pribadi", "Familiar dengan industri limbah/lingkungan (nilai plus)"] },
  { title: "Customer Service (WhatsApp)", location: "Remote / Cikarang", type: "Full-time", desc: "Melayani pertanyaan dan keluhan pelanggan melalui WhatsApp dan email, memastikan kepuasan klien terjaga.", req: ["Komunikasi yang ramah & profesional", "Kemampuan multitasking", "Familiar dengan aplikasi WhatsApp Business", "Pengalaman CS min. 1 tahun"] },
  { title: "Field Officer / Petugas Lapangan", location: "JABODETABEK", type: "Full-time", desc: "Melakukan pengambilan, pengemasan, dan pengangkutan limbah B3 di lokasi klien dengan menggunakan APD lengkap sesuai standar K3.", req: ["Pendidikan min. SMA/SMK", "Sehat jasmani & rohani", "Bersedia menggunakan APD lengkap", "Mampu bekerja dalam tim"] },
];

export default function Karir() {
  return (
    <>
      <Seo
        title="Karir di LIMBAHIN"
        description="Bergabunglah dengan tim LIMBAHIN — lihat lowongan kerja terbaru di bidang pengelolaan limbah B3."
        path="/bantuan/karir"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Bergabung Bersama Kami</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Karir di LIMBAHIN</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Jadilah bagian dari tim yang berkomitmen menciptakan lingkungan yang lebih bersih dan aman bagi Indonesia.</p>
          </motion.div>
        </div>
      </section>

      {/* Why join */}
      <section className="py-16 bg-[#f7fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🌱", title: "Dampak Nyata", desc: "Pekerjaan Anda berkontribusi langsung pada pelestarian lingkungan Indonesia." },
              { icon: "📈", title: "Tumbuh Bersama", desc: "Industri pengelolaan limbah terus berkembang — karir Anda pun ikut berkembang." },
              { icon: "👥", title: "Tim yang Solid", desc: "Bekerja dalam lingkungan yang kolaboratif, supportif, dan berorientasi solusi." },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8 text-center">Posisi Terbuka</h2>
          <div className="space-y-5">
            {openings.map((job, i) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#2ba5ad]/40 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#1a1a2e]">{job.title}</h3>
                      <span className="text-xs bg-[#e8f7f8] text-[#2ba5ad] px-2 py-0.5 rounded-full font-medium">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{job.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.req.map((r) => (
                        <span key={r} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">{r}</span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20melamar%20untuk%20posisi%20${encodeURIComponent(job.title)}.%20Nama%20saya%3A%20%20Pengalaman%3A%20%0A%5BBTN31%5D`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#2ba5ad] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors whitespace-nowrap"
                  >
                    Lamar <ArrowRight size={13} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center bg-[#f7fafb] rounded-xl p-7 border border-gray-100">
            <Briefcase size={32} className="text-[#2ba5ad] mx-auto mb-3" />
            <h3 className="font-bold text-[#1a1a2e] mb-2">Tidak ada posisi yang sesuai?</h3>
            <p className="text-gray-500 text-sm mb-4">Kirim CV Anda dan kami akan menghubungi Anda saat ada posisi yang cocok.</p>
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20mengirimkan%20CV%20untuk%20open%20application.%20Nama%3A%20%20Bidang%20keahlian%3A%20%0A%5BBTN32%5D" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2ba5ad] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors">
              Kirim CV via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}