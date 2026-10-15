import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const faqs = [
  { q: "Apa yang dimaksud dengan limbah B3?", a: "Limbah B3 (Bahan Berbahaya dan Beracun) adalah sisa dari suatu usaha dan/atau kegiatan yang mengandung zat, energi, dan/atau komponen lain yang karena sifat, konsentrasi, dan/atau jumlahnya dapat mencemarkan atau merusak lingkungan hidup, serta membahayakan kesehatan dan kelangsungan hidup manusia." },
  { q: "Apakah LIMBAHIN memiliki izin operasional resmi?", a: "Ya. LIMBAHIN, yang dikelola oleh PT. Media Cahaya Cerah, memiliki seluruh perizinan yang dipersyaratkan oleh Kementerian Lingkungan Hidup dan Kehutanan (KLHK) untuk mengangkut, menyimpan, dan mengelola limbah B3. Seluruh operasional kami tunduk pada PP No. 22 Tahun 2021 dan peraturan lingkungan hidup yang berlaku." },
  { q: "Bagaimana prosedur untuk memulai kerja sama dengan LIMBAHIN?", a: "Ada 4 langkah: (1) harga dan penawaran disetujui, (2) mengisi formulir pendaftaran data perusahaan, (3) memeriksa draf dokumen kontrak, dan (4) memilih bentuk fisik kontrak — dicetak atau elektronik melalui Mekari. Setelah kontrak selesai, penjadwalan pengambilan limbah pertama dapat langsung dilakukan." },
  { q: "Apa itu Festronik dan mengapa sistem ini penting?", a: "Festronik (Sistem Manifest Elektronik KLHK) merupakan sistem resmi pemerintah untuk mencatat dan melacak setiap pergerakan limbah B3. Setiap pengangkutan limbah B3 wajib tercatat pada sistem ini. LIMBAHIN menggunakan akun Festronik atas nama perusahaan klien, sehingga Anda dapat memantau data limbah secara real-time dan memiliki bukti kepatuhan hukum yang sah." },
  { q: "Apa syarat untuk membuat akun Festronik?", a: "Tiga hal utama: NIB/OSS beserta akses login ke OSS.id, dokumen Izin Lingkungan (opsional), dan diagram alur operasional (opsional). Tim kami membantu proses setup dan pelaporan hariannya — lihat panduan lengkap beserta video tutorialnya di halaman Artikel kami." },
  { q: "Apa bedanya kontrak 2 pihak dan 3 pihak, serta manifest dan Festronik?", a: "Kontrak 2 pihak hanya antara klien dan LIMBAHIN; kontrak 3 pihak melibatkan pihak pengelola akhir limbah juga (kontrak 3 pihak tetap bisa dicetak fisik bila dibutuhkan). Untuk pelaporan limbah, Anda bisa memilih hanya menggunakan manifest saja, atau menggunakan Festronik (memerlukan NIB) untuk pelaporan resmi ke KLHK." },
  { q: "Berapa lama proses pembuatan kontrak, dan apa itu kontrak elektronik Mekari?", a: "Kontrak cetak fisik memerlukan 10-14 hari kerja (kontrak 3 pihak) atau 4 hari (kontrak 2 pihak). Kontrak elektronik melalui Mekari jauh lebih cepat — 2-4 hari (3 pihak) atau 1 hari (2 pihak) — dan tetap sah secara hukum karena menggunakan materai elektronik resmi serta tanda tangan digital terverifikasi. Tutorialnya kami sediakan di halaman Artikel." },
  { q: "Berapa lama waktu yang dibutuhkan untuk proses pengambilan limbah?", a: "Untuk pelanggan dengan kontrak rutin, pengambilan dilakukan sesuai jadwal yang telah disepakati bersama. Untuk permintaan insidental (SPK), tim kami umumnya merespons dalam 1-3 hari kerja, tergantung lokasi dan ketersediaan armada. Kami mengoperasikan lebih dari 20 armada untuk mendukung kecepatan layanan." },
  { q: "Dokumen apa saja yang akan diterima setelah proses pengambilan limbah?", a: "Setiap klien akan menerima manifest pengangkutan sebagai bukti serah terima limbah, laporan pengelolaan limbah bulanan, serta Sertifikat Pemusnahan (Certificate of Destruction/CoD) sebagai bukti bahwa limbah telah dimusnahkan sesuai izin yang berlaku. Ketiga dokumen ini mendukung kepatuhan hukum dan audit lingkungan perusahaan Anda." },
  { q: "Apakah LIMBAHIN melayani area di luar JABODETABEK?", a: "Ya. Cakupan layanan kami meliputi berbagai kota di Pulau Jawa (Bandung, Semarang, Yogyakarta, Surabaya, dan sekitarnya) serta Sumatera (Lampung, Palembang, Medan), dengan jangkauan yang terus diperluas. Biaya transportasi disesuaikan dengan jarak lokasi. Silakan hubungi kami untuk memastikan ketersediaan layanan di wilayah Anda." },
  { q: "Bagaimana standar pengemasan limbah sebelum pengambilan dilakukan?", a: "Limbah padat atau sludge kering dapat dikemas menggunakan plastik, kardus, jumbo bag, atau drum. Limbah cair atau sludge basah menggunakan drum atau IBC tank. Untuk limbah medis dengan berat di bawah 250kg, proses penimbangan dilakukan langsung di lokasi. Tim kami turut menyediakan panduan pengemasan sesuai jenis limbah Anda." },
  { q: "Berapa biaya minimum untuk satu kali pengambilan limbah?", a: "Biaya minimum bergantung pada jenis layanan yang dipilih. Untuk layanan SPK (tanpa kontrak) di wilayah JABODETABEK, biaya transportasi dimulai dari IDR 450.000 per ritase, ditambah biaya pengelolaan limbah. Bagi pelanggan dengan kontrak, biaya transportasi umumnya telah termasuk atau lebih rendah. Hubungi kami untuk simulasi biaya yang lebih akurat sesuai kebutuhan Anda." },
  { q: "Apakah tersedia paket khusus untuk klinik atau praktek pribadi berskala kecil?", a: "Tersedia. Kami menyediakan Paket Tahunan mulai dari IDR 1,4 juta per tahun yang sesuai untuk klinik dengan volume limbah rendah (4x10kg per tahun). Untuk praktek pribadi dengan skala lebih kecil, tersedia layanan SPK (<100kg) dengan tarif IDR 13.000/kg. Setiap paket telah mencakup fasilitas pendukung berupa safety box dan kantung plastik kuning tanpa biaya tambahan." },
  { q: "Nomor mana yang harus saya hubungi untuk kebutuhan saya?", a: "Untuk calon pelanggan baru (harga, formulir pendaftaran, proses kontrak): 0851 2800 5532. Untuk pelanggan aktif (penjadwalan, sisa kuota, perpanjangan kontrak, invoice, dokumen legalitas): 0815 1700 5533. Kedua nomor ini khusus WhatsApp dan tidak bisa menerima panggilan telepon — untuk berbicara langsung silakan hubungi 0822 2000 1820 (Kelvin)." },
  { q: "Bagaimana cara pembayaran invoice LIMBAHIN?", a: "Pembayaran dapat ditransfer ke rekening BCA Cabang Pasar Baru, Jakarta, No. 002 306 0075, atau melalui nomor Virtual Account (VA MCC) yang tercantum pada invoice Anda. Mohon lampirkan bukti transfer setelah pembayaran untuk menghindari kesalahan pencatatan." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <Seo
        title="FAQ Pengelolaan Limbah B3 & Kontrak"
        description="Jawaban pertanyaan umum seputar pengelolaan limbah B3: Festronik, manifest, kontrak elektronik Mekari, harga, pembayaran, dan kontak LIMBAHIN."
        path="/bantuan/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Bantuan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Pertanyaan Umum</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan LIMBAHIN.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`rounded-xl border transition-all ${open === i ? "border-[#2ba5ad]/30 shadow-md" : "border-gray-200"}`}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
                  <span className={`font-semibold text-sm pr-4 ${open === i ? "text-[#2ba5ad]" : "text-[#1a1a2e]"}`}>{faq.q}</span>
                  <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${open === i ? "rotate-180 text-[#2ba5ad]" : ""}`} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 text-center bg-[#f7fafb] rounded-2xl p-8 border border-gray-100">
            <h3 className="font-bold text-[#1a1a2e] mb-2">Masih ada pertanyaan?</h3>
            <p className="text-gray-500 text-sm mb-5">Tim kami siap membantu Anda 24/7 melalui WhatsApp.</p>
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20memiliki%20pertanyaan%20tentang%3A%0A%5BBTN33%5D" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2ba5ad] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors">
              Chat via WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <QuotationForm />
    </>
  );
}