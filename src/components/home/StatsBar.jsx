import React from "react";
import { motion } from "framer-motion";

// Shared "Pencapaian Kami" stats card — used on both the homepage (floating
// on the dark cyan section) and the Tentang Kami page (inside the white
// "Perusahaan & Latar Belakang" section). Pass `stats`/`title` to override.
const DEFAULT_STATS = [
  { value: "197+", label: "Jenis Limbah" },
  { value: "500~", label: "Mitra Perusahaan" },
  { value: "1K", label: "Titik Pelayanan" },
  { value: "13-18", label: "Sektor Industri" },
  { value: ">20", label: "Armada" },
  { value: "3", label: "Pool Operasional" },
];

export default function StatsBar({ title = "Pencapaian Kami", stats = DEFAULT_STATS, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#f7fafb] rounded-2xl p-8 border border-gray-100 ${className}`}
    >
      <h3 className="text-center font-bold text-[#1a1a2e] mb-8 text-lg">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-2xl md:text-3xl font-bold text-[#2ba5ad] mb-1">{h.value}</div>
            <div className="text-xs text-gray-500">{h.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
