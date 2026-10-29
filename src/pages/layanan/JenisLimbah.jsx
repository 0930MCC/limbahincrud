import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Biohazard,
  Leaf,
  Recycle,
  CheckCircle2,
  Search,
} from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";

const PageHero = ({ title, subtitle }) => (
  <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20 md:py-24">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "36px 36px",
      }}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">
          Katalog Layanan & Perizinan KLHK
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4 leading-tight">{title}</h1>
        <p className="text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      </motion.div>
    </div>
  </section>
);

const b3CodesCatalog = [
  {
    category: "Limbah Medis & Fasilitas Kesehatan",
    icon: "🏥",
    codes: [
      { code: "A337-1", name: "Limbah Klinis Memiliki Karakteristik Infeksius", desc: "Kassa darah, perban, sarung tangan terkontaminasi cairan tubuh, spesimen lab medis." },
      { code: "A337-2", name: "Produk Farmasi Kedaluwarsa", desc: "Obat-obatan kadaluarsa, sisa sediaan farmasi, cairan infus sisa, obat sitotoksik." },
      { code: "A337-3", name: "Bahan Kimia Kedaluwarsa", desc: "Reagen laboratorium kedaluwarsa, desinfektan kimia, pelarut histologi/patologi." },
      { code: "A337-4", name: "Peralatan Medis Terkontaminasi & Jarum Suntik", desc: "Spuit, jarum suntik bekas, pisau bedah (scalpel), pipet kaca, ampul pecah." },
      { code: "A337-5", name: "Limbah Sitotoksik & Genotoksik", desc: "Limbah kemoterapi, sisa obat sitostatika, botol vial obat kanker." },
    ],
  },
  {
    category: "Limbah Industri & Manufaktur Pabrik",
    icon: "🏭",
    codes: [
      { code: "B105d", name: "Minyak Pelumas / Oli Bekas Hidrolik & Mesin", desc: "Oli pelumas sirkulasi mesin pabrik, genset, kompresor, dan armada logistik." },
      { code: "B107d", name: "Aki Bekas & Baterai Timbal Asam", desc: "Aki kendaraan industri, baterai forklift, UPS baterai timbal asam basah dan kering." },
      { code: "B109d", name: "Filter Oli & Bahan Terkontaminasi B3", desc: "Filter oli bekas, majun bekas, absorbent pad, sarung tangan terkontaminasi pelumas." },
      { code: "B110d", name: "Kain Majun Bekas & Serbuk Gergaji Terkontaminasi", desc: "Kain pembersih mesin industri yang terpapar bahan kimia atau oli berbahaya." },
      { code: "B305-1", name: "Lumpur IPAL (Sludge Waste Water Treatment)", desc: "Sludge hasil sedimentasi pengolahan limbah cair industri kimia, elektroplating, tekstil." },
      { code: "A108d", name: "Limbah Terkontaminasi Bahan Pelarut Organik", desc: "Thinner, toluene, acetone bekas cuci mesin cetak atau painting booth." },
    ],
  },
  {
    category: "Limbah Komersial, Perkantoran & Gedung",
    icon: "🏢",
    codes: [
      { code: "B104d", name: "Kemasan Bekas Terkontaminasi B3", desc: "Drum besi, jeriken bekas bahan kimia, kaleng cat, kaleng thinner, botol pestisida." },
      { code: "B107d", name: "Baterai Kering Bekas (Lithium / NiCd / Alkaline)", desc: "Baterai remote, baterai sensor, alat elektronik kantor, dan powerbank rusak." },
      { code: "B351-1", name: "Lampu TL / Fluorescent Bekas (Merkuri)", desc: "Lampu neon panjang, bohlam hemat energi (CFL) yang mengandung uap merkuri berbahaya." },
      { code: "B353-1", name: "Limbah Elektronik (E-Waste)", desc: "Motherboard komputer, monitor CRT/LED, PCB elektronik gedung, printer rusak." },
      { code: "A351-3", name: "Toner & Cartridge Bekas", desc: "Cartridge tinta mesin fotokopi dan laser printer kantor." },
    ],
  },
  {
    category: "Produk Reject, Bahan Gagal & Recall",
    icon: "📦",
    codes: [
      { code: "B321-4", name: "Produk Makanan & Minuman Rusak / Kedaluwarsa", desc: "Batch produk gagal pabrik, makanan kemasan kadaluarsa untuk pemusnahan resmi (saksi)." },
      { code: "B337-1", name: "Produk Kosmetik & Personal Care Reject", desc: "Krim, parfum aerosol, sampo reject yang ditarik dari pasaran." },
      { code: "A305-1", name: "Bahan Baku Kimia Off-Spec", desc: "Bahan baku manufaktur yang gagal spesifikasi dan tidak dapat diproses lebih lanjut." },
    ],
  },
];

const categories = [
  {
    id: "b3",
    label: "Limbah B3 (Berbahaya & Beracun)",
    icon: Biohazard,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
    desc: "Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus sesuai regulasi PP No. 22 Tahun 2021 dan izin resmi KLHK.",
    sub: [
      { label: "B3 Medis", icon: "🏥", desc: "Rumah sakit, klinik, puskesmas & lab. Meliputi jarum suntik, kassa infeksius, limbah patologis, farmasi kadaluarsa, dan APD." },
      { label: "B3 Industri", icon: "🏭", desc: "Pabrik kimia, otomotif, manufaktur. Meliputi oli bekas, sludge IPAL, solvent bekas, majun terkontaminasi, dan filter oli." },
      { label: "B3 Produk & Bahan", icon: "📦", desc: "Barang reject produksi, produk makanan/kosmetik kadaluarsa, kemasan terkontaminasi, dan sediaan gagal." },
      { label: "B3 Komersil", icon: "🏢", desc: "Hotel, apartemen & perkantoran. Meliputi baterai bekas, lampu TL merkuri, toner printer, aerosol, dan e-waste." },
    ],
  },
  {
    id: "domestik",
    label: "Limbah Domestik",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    desc: "Limbah non-B3 yang dihasilkan dari aktivitas operasional harian kantor, kantin industri, dan fasilitas komersial.",
    sub: [
      { label: "Organik", icon: "🌱", desc: "Sisa makanan kantin, limbah taman, bahan biodegradable yang dapat diproses menjadi kompos atau biogas." },
      { label: "Residu", icon: "🗑️", desc: "Sampah non-recycle dan non-B3 yang membutuhkan pengangkutan berjadwal ke TPA resmi." },
      { label: "Daur Ulang", icon: "♻️", desc: "Kardus kemasan, kertas arsip, plastik packaging, palet kayu bekas sortir." },
    ],
  },
  {
    id: "ekonomis",
    label: "Limbah Ekonomis (Scrap)",
    icon: Recycle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    desc: "Limbah sekunder bernilai jual yang dapat didaur ulang kembali melalui industri peleburan dan pengolahan.",
    sub: [
      { label: "Oli Bekas Rekondisi", icon: "🛢️", desc: "Oli mesin & hidrolik yang dapat diolah kembali menjadi base oil atau bahan bakar alternatif industri semen." },
      { label: "Besi & Logam Scrap", icon: "⚙️", desc: "Besi tua, tembaga kabel, aluminium bubut, dan potongan plat baja manufaktur." },
      { label: "Drum & Jeriken Daur Ulang", icon: "🛢️", desc: "Wadah drum baja dan jeriken plastik yang telah didekontaminasi untuk penggunaan kembali." },
    ],
  },
];

export default function JenisLimbah() {
  const [active, setActive] = useState("b3");
  const [search, setSearch] = useState("");
  const cat = categories.find((c) => c.id === active);

  const filteredCatalog = b3CodesCatalog.map((group) => ({
    ...group,
    codes: group.codes.filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.codes.length > 0);

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Katalog Kode Limbah B3 LIMBAHIN",
    "description": "Daftar kode dan karakteristik limbah B3 medis, industri, komersial dan produk reject yang dilayani LIMBAHIN sesuai PP No. 22 Tahun 2021.",
    "url": "https://www.mediacahayacerah.com/layanan/jenis-limbah",
  };

  return (
    <>
      <Seo
        title="Daftar Jenis & Kode Limbah B3 yang Dikelola LIMBAHIN"
        description="Katalog lengkap 197+ kode limbah B3: limbah medis infeksius (A337-1), oli bekas (B105d), sludge IPAL, baterai bekas, lampu TL, produk reject berizin KLHK di Jabodetabek."
        path="/layanan/jenis-limbah"
        jsonLd={schemaJsonLd}
      />
      <PageHero
        title="Jenis & Karakteristik Limbah yang Dikelola"
        subtitle="LIMBAHIN berizin resmi mengelola 197+ kode limbah B3 serta limbah domestik dan bernilai ekonomis untuk industri dan fasilitas kesehatan Jabodetabek."
      />

      {/* Category selector */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  active === c.id
                    ? "bg-[#2ba5ad] text-white border-[#2ba5ad] shadow-lg shadow-[#2ba5ad]/20"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"
                }`}
              >
                <c.icon size={16} />
                {c.label}
              </button>
            ))}
          </div>

          {/* Active category cards */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-10">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cat.bg} ${cat.border} border mb-3`}>
                <cat.icon size={16} className={cat.color} />
                <span className={`text-sm font-semibold ${cat.color}`}>{cat.label}</span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">{cat.desc}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cat.sub.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#f7fafb] rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-[#2ba5ad]/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">{s.icon}</div>
                    <h3 className="font-bold text-[#1a1a2e] mb-2">{s.label}</h3>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4">{s.desc}</p>
                  </div>
                  <a
                    href={`https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%20pengelolaan%20limbah%20${encodeURIComponent(
                      s.label
                    )}%0A%5BBTN24%5D`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2ba5ad] text-xs font-semibold hover:gap-2 transition-all pt-2 border-t border-gray-100"
                  >
                    Konsultasi Penanganan <ArrowRight size={12} />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Directory of Specific B3 Waste Codes */}
      <section className="py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#2ba5ad] text-xs font-bold uppercase tracking-wider">
              Lampiran IX PP No. 22 Tahun 2021
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mt-2 mb-3">
              Katalog Kode Limbah B3 Populer yang Dilayani
            </h2>
            <p className="text-gray-600 text-xs md:text-sm">
              Cari kode atau nama limbah untuk memeriksa legalitas penerimaan dan metode pemusnahan resmi kami.
            </p>

            <div className="mt-6 relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode (misal: A337-1, B105d) atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#2ba5ad]/40 focus:border-[#2ba5ad]"
              />
            </div>
          </div>

          <div className="space-y-8">
            {filteredCatalog.map((group, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{group.icon}</span>
                  <h3 className="text-base md:text-lg font-bold text-[#1a1a2e]">{group.category}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {group.codes.map((c) => (
                    <div
                      key={c.code}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="inline-block px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#e6f7f8] text-[#2ba5ad]">
                          {c.code}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Berizin KLHK
                        </span>
                      </div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-1">{c.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base">Kode limbah Anda belum tercantum di atas?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                LIMBAHIN memiliki perizinan resmi untuk 197+ kode limbah B3. Hubungi tim teknis kami untuk pengecekan spesifik.
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20menanyakan%20perizinan%20kode%20limbah%20spesifik%0A%5BBTN24%5D"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#2ba5ad] hover:bg-[#239198] text-white font-semibold text-xs transition shrink-0"
            >
              Cek Kode via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <QuotationForm />
    </>
  );
}