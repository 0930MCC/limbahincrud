import React from "react";
import { motion } from "framer-motion";
import { Handshake, Percent, Users, TrendingUp, Phone, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";

const MARKETING_WA = "https://api.whatsapp.com/send?phone=6285128005532&text=Halo%20LIMBAHIN%2C%20saya%20tertarik%20untuk%20bergabung%20dengan%20program%20Affiliate%20LIMBAHIN%0A%5BBTN39%5D";

const steps = [
  { icon: Users, title: "Daftar & Bergabung", desc: "Hubungi tim kami untuk mendaftar sebagai partner affiliate LIMBAHIN." },
  { icon: Handshake, title: "Referensikan Klien", desc: "Kenalkan LIMBAHIN kepada rumah sakit, klinik, pabrik, atau instansi di jaringan Anda." },
  { icon: Percent, title: "Dapatkan Komisi", desc: "Terima komisi dari setiap klien yang berhasil bergabung melalui referensi Anda." },
];

const benefits = [
  "Komisi menarik untuk setiap klien baru yang berhasil didaftarkan",
  "Tidak ada batasan jumlah referensi yang bisa diajukan",
  "Proses pencairan komisi yang transparan",
  "Dukungan materi promosi dari tim LIMBAHIN",
  "Cocok untuk individu maupun perusahaan rekanan",
];

export default function Affiliate() {
  return (
    <>
      <Seo
        title="Program Afiliasi"
        description="Bergabung dengan program afiliasi LIMBAHIN dan dapatkan komisi dari setiap rujukan klien pengelolaan limbah B3."
        path="/affiliate"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Program Kemitraan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Program Affiliate LIMBAHIN</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">
              Dapatkan komisi dengan merekomendasikan layanan pengelolaan limbah B3 LIMBAHIN kepada jaringan Anda.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">Bagaimana Cara Kerjanya?</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Tiga langkah mudah untuk mulai mendapatkan komisi dari program affiliate kami.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-200 p-7 hover:border-[#2ba5ad]/40 hover:shadow-lg transition-all relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#f0fafa] flex items-center justify-center mb-4">
                  <s.icon className="text-[#2ba5ad]" size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center bg-[#f7fafb] rounded-2xl p-8 md:p-12 border border-gray-100">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-[#2ba5ad]/10 text-[#2ba5ad] text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
                <TrendingUp size={12} /> Keuntungan Affiliate
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a2e] mb-5">Kenapa Bergabung dengan Kami?</h3>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={17} className="text-[#2ba5ad] flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-xl bg-[#2ba5ad] flex items-center justify-center mx-auto mb-4">
                <Handshake className="text-white" size={26} />
              </div>
              <h4 className="text-lg font-bold text-[#1a1a2e] mb-2">Tertarik Bergabung?</h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Hubungi tim Marketing kami untuk informasi lebih lanjut mengenai skema komisi dan proses pendaftaran program affiliate.
              </p>
              <a
                href={MARKETING_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#2ba5ad] text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors w-full"
              >
                <Phone size={16} /> Hubungi Marketing — 0851-2800-5532
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
