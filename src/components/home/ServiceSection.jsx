import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MEDICAL_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/8a7bccdfc_generated_image.png";
const INDUSTRIAL_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/fa043d267_generated_image.png";
const COMMERCIAL_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/2e7eb9763_generated_image.png";
const PRODUK_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/3f79e35cb_generated_image.png";
const DOMESTIK_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/1f64de79e_generated_image.png";
const EKONOMIS_IMG = "https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/0572e8306_generated_image.png";

const services = [
  { title: "B3 Medis", desc: "Pengelolaan limbah B3 medis dari rumah sakit, klinik, puskesmas & praktek pribadi secara berizin dan aman.", img: MEDICAL_IMG, items: ["Rumah Sakit", "Klinik & Puskesmas", "Praktek Pribadi"] },
  { title: "B3 Industri", desc: "Penanganan limbah B3 industri dari pabrik, gudang & limbah mesin dengan proses yang menyeluruh.", img: INDUSTRIAL_IMG, items: ["Pabrik & Manufaktur", "Gudang & Logistik", "Limbah Mesin"] },
  { title: "B3 Komersil", desc: "Layanan pengelolaan limbah B3 komersil dari hotel, apartemen dan kantor.", img: COMMERCIAL_IMG, items: ["Hotel & Resort", "Apartemen", "Perkantoran"] },
  { title: "B3 Produk & Bahan", desc: "Pemusnahan barang reject, produk kedaluwarsa, kemasan terkontaminasi & bahan baku gagal.", img: PRODUK_IMG, items: ["Barang Reject", "Produk Kedaluwarsa", "Kemasan Terkontaminasi"] },
  { title: "Limbah Domestik", desc: "Pengelolaan limbah organik, residu dan daur ulang dari aktivitas rumah tangga & komersil kecil.", img: DOMESTIK_IMG, items: ["Organik", "Residu", "Daur Ulang"] },
  { title: "Limbah Ekonomis", desc: "Limbah bernilai ekonomis seperti oli bekas, besi, plastik dan kertas/kayu yang dapat diolah ulang.", img: EKONOMIS_IMG, items: ["Oli Bekas", "Besi & Logam", "Plastik & Kertas"] },
];

export default function ServicesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Layanan Kami</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3">Pengelolaan Limbah yang Aman & Menyeluruh</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div key={svc.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={svc.img} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{svc.desc}</p>
                <ul className="space-y-2 mb-5">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2ba5ad] flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <a href="#quotation" className="inline-flex items-center gap-1.5 text-[#2ba5ad] text-sm font-semibold hover:gap-2.5 transition-all">
                  Minta Penawaran <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}