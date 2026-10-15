import React from "react";
import { Phone, Mail, MapPin, Clock, ExternalLink, MessageCircle, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const contacts = [
  {
    icon: Mail,
    title: "Email",
    items: [
      { label: "cs@mediacahayacerah.com", desc: "Pelanggan Aktif", href: "mailto:cs@mediacahayacerah.com" },
      { label: "marketing@mediacahayacerah.com", desc: "Penawaran & Calon Pelanggan", href: "mailto:marketing@mediacahayacerah.com" },
      { label: "admin@mediacahayacerah.com", desc: "Kebutuhan Data", href: "mailto:admin@mediacahayacerah.com" },
      { label: "finance@mediacahayacerah.com", desc: "Bag. Keuangan", href: "mailto:finance@mediacahayacerah.com" },
    ],
  },
  {
    icon: Phone,
    title: "Kontak & WhatsApp",
    items: [
      { label: "0815 1700 5533", desc: "CS WA Operational & Finance", href: "https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%0A%5BBTN27%5D" },
      { label: "0851 2800 5532", desc: "CS WA Marketing & Customer Baru", href: "https://api.whatsapp.com/send?phone=6285128005532&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%0A%5BBTN28%5D" },
      { label: "0822 2000 1820 (Kelvin)", desc: "Manager", href: "https://api.whatsapp.com/send?phone=6282220001820&text=Halo%20Kelvin%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20LIMBAHIN%0A%5BBTN29%5D" },
      { label: "0877 7210 2188", desc: "Emergency Contact", href: "https://api.whatsapp.com/send?phone=6287772102188&text=Halo%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20LIMBAHIN%0A%5BBTN30%5D" },
      { label: "(021) 221 561 00", desc: "Kantor", href: "tel:+62212215610" },
    ],
  },
];

export default function HubungiKami() {
  return (
    <>
      <Seo
        title="Hubungi LIMBAHIN, Konsultasi Limbah B3 Gratis"
        description="Hubungi tim LIMBAHIN di Cikarang untuk konsultasi gratis, penawaran harga, dan penjadwalan pengangkutan limbah B3 di Jakarta, Bekasi, Depok, Bogor, dan Tangerang."
        path="/hubungi-kami"
      />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#1a2333] to-[#162930] py-20 md:py-28">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Hubungi Kami</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Hubungi Kami</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Pengelolaan Limbah B3 / Non B3 berizin, aman dan menyeluruh. Hubungi tim kami untuk konsultasi gratis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Visually hidden — the three cards below (Janji Temu / Konsultasi / Alamat) are each
              an h3; without a section heading above them, they skipped straight from the page's
              h1 to h3. sr-only keeps the design exactly as it was while fixing that gap for
              screen readers and search engines. */}
          <h2 className="sr-only">Cara Menghubungi Kami</h2>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Janji Temu */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#f7fafb] rounded-2xl p-8 border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e8f7f8] flex items-center justify-center mb-5">
                <MessageCircle size={22} className="text-[#2ba5ad]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Buat Janji Temu</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Pengelolaan Limbah B3 / Non B3 berizin, aman dan menyeluruh.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20saya%20ingin%20membuat%20janji%20temu%0A%5BBTN25%5D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                <Phone size={14} /> Hubungi Sekarang
              </a>
            </motion.div>

            {/* Konsultasi Gratis */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#f7fafb] rounded-2xl p-8 border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e8f7f8] flex items-center justify-center mb-5">
                <Phone size={22} className="text-[#2ba5ad]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Konsultasi Gratis</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Konsultasi gratis untuk semua kebutuhan pengelolaan limbah B3 Anda.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20perkenalkan%20nama%3A%20%20%20dari%3A%20%20%20kami%20ingin%20konsultasi%20tentang%3A%0A%5BBTN26%5D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                <MessageCircle size={14} /> Chat WhatsApp
              </a>
            </motion.div>

            {/* Alamat */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#f7fafb] rounded-2xl p-8 border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e8f7f8] flex items-center justify-center mb-5">
                <MapPin size={22} className="text-[#2ba5ad]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Alamat & Jam Buka</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                Ruko Premium Icon City Blok B23, Jln. Boulevard Raya Deltamas No.189, Cikarang Pusat 17530
              </p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock size={14} className="text-[#2ba5ad]" />
                Senin - Jumat | 09:00 - 17:00 WIB
              </div>
            </motion.div>
          </div>

          {/* Legalitas & Pembayaran */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#f7fafb] rounded-2xl p-8 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Legalitas Perusahaan</h3>
              <dl className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between gap-4"><dt className="text-gray-400">Nama Perusahaan</dt><dd className="font-medium text-right">PT Media Cahaya Cerah</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-400">NPWP</dt><dd className="font-medium text-right">02.881.357.4-036.000</dd></div>
              </dl>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#f7fafb] rounded-2xl p-8 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Rekening Pembayaran</h3>
              <dl className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between gap-4"><dt className="text-gray-400">Bank</dt><dd className="font-medium text-right">BCA Cabang Pasar Baru, Jakarta</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-400">No. Rekening</dt><dd className="font-medium text-right">002 306 0075</dd></div>
              </dl>
              <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                Atau gunakan nomor Virtual Account (VA MCC) yang tercantum pada invoice Anda. Mohon lampirkan bukti transfer setelah pembayaran untuk menghindari kesalahan pencatatan.
              </p>
            </motion.div>
          </div>

          {/* Email & Phone Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {contacts.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f7f8] flex items-center justify-center">
                    <c.icon size={18} className="text-[#2ba5ad]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e]">{c.title}</h3>
                </div>
                <div className="space-y-4">
                  {c.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block hover:bg-[#f7fafb] rounded-lg p-3 -m-3 transition-colors"
                    >
                      <div className="text-[#2ba5ad] text-sm font-medium">{item.label}</div>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </a>
                  ))}
                </div>
                {c.title === "Kontak & WhatsApp" && (
                  <p className="text-gray-400 text-[11px] mt-5 pt-4 border-t border-gray-100 leading-relaxed">
                    Nomor-nomor WhatsApp di atas hanya bisa menerima pesan (tidak bisa menerima panggilan telepon). Untuk berbicara langsung, silakan hubungi 0822 2000 1820 (Kelvin) atau nomor kantor.
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Data & Kelengkapan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://linktr.ee/mediacahayacerah"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#2ba5ad] font-semibold text-sm hover:underline"
              >
                <ExternalLink size={14} /> Data & Kelengkapan — linktr.ee/mediacahayacerah
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a
                href="https://www.instagram.com/limbahin_mcc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#2ba5ad] font-semibold text-sm hover:underline"
              >
                <Instagram size={14} /> @limbahin_mcc
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          >
            <iframe
              title="Lokasi LIMBAHIN"
              src="https://maps-api-ssl.google.com/maps?hl=id&ll=-6.358179,107.179844&output=embed&q=Ruko+Premium+Icon+City,+Jl.+Deltamas+Boulevard+No.189,+Sukamahi,+Kec.+Cikarang+Pusat,+Bekasi,+Jawa+Barat+17530,+Indonesia&z=17"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* Quotation Form */}
      <QuotationForm />
    </>
  );
}