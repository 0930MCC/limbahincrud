import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Biohazard, Factory, ShoppingBag, Building2, Leaf, Recycle } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const PageHero = ({ title, subtitle }) => (
  <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">{title}</h1>
        <p className="text-white/65 text-base max-w-xl mx-auto">{subtitle}</p>
      </motion.div>
    </div>
  </section>
);

const categories = [
  {
    id: "b3",
    label: "Limbah B3",
    icon: Biohazard,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
    desc: "Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus sesuai regulasi KLHK.",
    sub: [
      { label: "Medis", icon: "🏥", desc: "Rumah sakit, klinik, puskesmas & praktek pribadi. Meliputi jarum suntik, kemasan obat, limbah patologis, dan APD bekas." },
      { label: "Industri", icon: "🏭", desc: "Pabrik, gudang & limbah mesin. Meliputi oli bekas, solvent, bahan kimia proses, filter industri, dan limbah cair berbahaya." },
      { label: "Produk & Bahan", icon: "📦", desc: "Barang reject/kedaluwarsa. Meliputi produk gagal produksi, bahan baku kadaluarsa, kemasan terkontaminasi, dan produk recall." },
      { label: "Komersil", icon: "🏢", desc: "Hotel, apartemen & kantor. Meliputi baterai bekas, lampu TL, toner printer, aerosol bekas, dan elektronik rusak." },
    ],
  },
  {
    id: "domestik",
    label: "Limbah Domestik",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    desc: "Limbah rumah tangga dan non-B3 yang dihasilkan dari aktivitas sehari-hari.",
    sub: [
      { label: "Organik", icon: "🌱", desc: "Sisa makanan, limbah dapur, sampah sayuran dan buah, dan bahan organik yang dapat terurai secara alami." },
      { label: "Residu", icon: "🗑️", desc: "Limbah yang tidak dapat didaur ulang maupun dikompos, sehingga perlu penanganan khusus di TPA." },
      { label: "Daur Ulang", icon: "♻️", desc: "Plastik, kertas, kaca, logam, dan bahan lain yang dapat diproses kembali menjadi produk baru." },
    ],
  },
  {
    id: "ekonomis",
    label: "Limbah Ekonomis",
    icon: Recycle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    desc: "Limbah yang memiliki nilai ekonomis dan dapat dijual atau diproses ulang.",
    sub: [
      { label: "Oli Bekas", icon: "🛢️", desc: "Oli mesin, oli hidrolik, dan cairan pelumas bekas dari kendaraan maupun mesin industri." },
      { label: "Besi & Logam", icon: "⚙️", desc: "Besi tua, aluminium, tembaga, dan berbagai logam bekas yang dapat dijual dan didaur ulang." },
      { label: "Plastik", icon: "🧴", desc: "Berbagai jenis plastik bekas yang dapat dipilah dan diolah kembali menjadi bahan baku." },
      { label: "Kertas & Kayu", icon: "📄", desc: "Kertas bekas, kardus, palet kayu, dan limbah kertas/kayu lainnya yang masih memiliki nilai jual." },
    ],
  },
];

export default function JenisLimbah() {
  const [active, setActive] = useState("b3");
  const cat = categories.find((c) => c.id === active);

  return (
    <>
      <Seo
        title="Jenis Limbah B3: Medis, Industri, Komersial"
        description="Daftar jenis limbah B3 yang dikelola LIMBAHIN: limbah medis, industri, komersial, serta produk & bahan, sesuai regulasi KLHK untuk wilayah Jabodetabek."
        path="/layanan/jenis-limbah"
      />
      <PageHero title="Jenis Limbah" subtitle="LIMBAHIN mengelola 197+ jenis limbah dari berbagai kategori secara berizin dan profesional." />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category tabs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  active === c.id ? "bg-[#2ba5ad] text-white border-[#2ba5ad] shadow-lg shadow-[#2ba5ad]/20" : "bg-white text-gray-600 border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"
                }`}
              >
                <c.icon size={16} />
                {c.label}
              </button>
            ))}
          </div>

          {/* Active category */}
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-10">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cat.bg} ${cat.border} border mb-3`}>
                <cat.icon size={16} className={cat.color} />
                <span className={`text-sm font-semibold ${cat.color}`}>{cat.label}</span>
              </div>
              <p className="text-gray-500 max-w-xl mx-auto text-sm">{cat.desc}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cat.sub.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-[#f7fafb] rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-[#2ba5ad]/20 transition-all group"
                >
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#2ba5ad] transition-colors">{s.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <a
                    href={`https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20tentang%20pengelolaan%20limbah%20${encodeURIComponent(s.label)}%0A%5BBTN24%5D`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2ba5ad] text-xs font-semibold hover:gap-2 transition-all"
                  >
                    Tanya Sekarang <ArrowRight size={12} />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <QuotationForm />
    </>
  );
}