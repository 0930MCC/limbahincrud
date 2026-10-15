import React from "react";
import { motion } from "framer-motion";
import { Tag, Truck, ShieldCheck, FileCheck, ArrowRight, Star, Instagram, Gift, Package } from "lucide-react";
import ArticleSection from "@/components/home/ArticleSection";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const commonHighlights = [
  { icon: ShieldCheck, label: "Sesuai Regulasi Kemenkes & KLHK" },
  { icon: Truck, label: "Layanan Profesional dan Terpercaya" },
  { icon: ShieldCheck, label: "Aman untuk Lingkungan & Kesehatan" },
  { icon: FileCheck, label: "Dokumentasi Lengkap dan Audit Ready" },
];

/**
 * Promo data model. To add a new promo, add another object to this array.
 *
 * Fields:
 * - image: optional URL/path to a picture for the promo header. Leave null/undefined
 *   to use the default dark gradient header instead.
 * - tiers: optional list of { label, sublabel } chips (e.g. discount tiers, reward steps).
 * - highlights: optional list of { icon, label } trust badges shown below the tiers.
 * - ctaLabel / waLink: the call-to-action button text and WhatsApp link.
 */
const promos = [
  {
    id: "cabang-lebih-hemat",
    tag: "Khusus Untuk Paket Tahunan",
    title: "Lebih Banyak Cabang, Lebih Hemat!",
    description: "Dapatkan diskon untuk cabang kedua dan selanjutnya. Semakin banyak paket yang Anda ambil, semakin besar diskon yang didapat.",
    note: "*S&K Berlaku.",
    image: null, // set to an image URL/path to show a picture header instead
    tiers: [
      { icon: Tag, label: "Diskon 5%", sublabel: "2 sampai 4 Paket" },
      { icon: Tag, label: "Diskon 10%", sublabel: "5 sampai 9 Paket" },
      { icon: Tag, label: "Diskon 15%", sublabel: "10 sampai 19 Paket" },
      { icon: Tag, label: "Diskon 20%", sublabel: "20 Paket dan lebih" },
    ],
    highlights: commonHighlights,
    ctaLabel: "Klaim Promo via WhatsApp",
    waLink: "https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20promo%20paket%20tahunan%0A%5BBTN21%5D",
  },
  {
    id: "review-instagram",
    tag: "Promo Gratis — Tanpa Syarat Pembelian",
    title: "Google Review & Follow Instagram, Dapatkan Hadiah!",
    description: "Bantu kami berkembang dengan memberikan ulasan di Google dan mengikuti Instagram resmi LIMBAHIN. Sebagai ucapan terima kasih, Anda berhak mendapatkan salah satu hadiah berikut.",
    note: "*Berlaku untuk 1x klaim per perusahaan/instansi. Tunjukkan bukti review & follow saat konfirmasi.",
    image: null,
    tiers: [
      { icon: Package, label: "1 Pack Plastik Kuning", sublabel: "Pilihan Hadiah 1" },
      { icon: Package, label: "1 Pcs Safety Box", sublabel: "Pilihan Hadiah 2" },
    ],
    highlights: [
      { icon: Star, label: "Beri rating & ulasan di Google Bisnis LIMBAHIN" },
      { icon: Instagram, label: "Follow akun Instagram resmi @limbah.in" },
      { icon: Gift, label: "Kirim bukti tangkapan layar via WhatsApp" },
      { icon: ShieldCheck, label: "Hadiah diberikan saat kunjungan berikutnya" },
    ],
    ctaLabel: "Klaim Hadiah via WhatsApp",
    waLink: "https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20sudah%20memberikan%20Google%20Review%20dan%20follow%20Instagram%2C%20saya%20ingin%20klaim%20hadiah%0A%5BBTN22%5D",
  },
];

function PromoCard({ promo }) {
  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {promo.image ? (
        <div className="relative">
          <img src={promo.image} alt={promo.title} className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e2229]/90 via-[#0e2229]/20 to-transparent flex flex-col justify-end p-8 md:p-10">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-[#3cc0c9] text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 w-fit">
              <Tag size={12} /> {promo.tag}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">{promo.title}</h2>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] p-8 md:p-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-[#3cc0c9] text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Tag size={12} /> {promo.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">{promo.title}</h2>
          <p className="text-white/70 text-sm md:text-base max-w-xl">{promo.description}</p>
        </div>
      )}

      <div className="p-8 md:p-10">
        {promo.image && <p className="text-gray-500 text-sm md:text-base max-w-xl mb-6">{promo.description}</p>}

        {promo.tiers && (
          <>
            <h3 className="font-bold text-[#1a1a2e] mb-5 text-sm uppercase tracking-wider">Detail Penawaran</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {promo.tiers.map((tier) => (
                <div key={tier.label} className="flex items-center gap-3 bg-[#f0fafa] rounded-xl p-4 border border-[#2ba5ad]/10">
                  <div className="w-10 h-10 rounded-lg bg-[#2ba5ad] flex items-center justify-center flex-shrink-0">
                    <tier.icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#2ba5ad] leading-tight">{tier.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{tier.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {promo.highlights && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {promo.highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-2 text-xs text-gray-500">
                <h.icon size={16} className="text-[#2ba5ad] flex-shrink-0" />
                {h.label}
              </div>
            ))}
          </div>
        )}

        <p className="text-gray-400 text-xs mb-5">{promo.note}</p>

        <a
          href={promo.waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#2ba5ad] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors"
        >
          {promo.ctaLabel} <ArrowRight size={14} />
        </a>
      </div>
    </motion.div>
  );
}

export default function Promo() {
  return (
    <>
      <Seo
        title="Promo LIMBAHIN"
        description="Promo dan penawaran spesial layanan pengelolaan limbah B3 dari LIMBAHIN."
        path="/promo"
        noIndex
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Penawaran Spesial</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Promo LIMBAHIN</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">
              Nikmati berbagai penawaran menarik untuk layanan pengelolaan limbah B3 Anda.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f7fafb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          {promos.map((promo) => <PromoCard key={promo.id} promo={promo} />)}
        </div>
      </section>

      <ArticleSection />
      <QuotationForm />
    </>
  );
}
