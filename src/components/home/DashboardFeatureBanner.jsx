import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, BarChart3, FileCheck2, Sparkles, Lock } from "lucide-react";

const WA_URL =
  "https://api.whatsapp.com/send?phone=6285128005532&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20bertanya%20mengenai%20akses%20Dashboard%2FClient%20Portal%0A%5BBTN13%5D";

// Was a remote base44 URL serving the WRONG mark (generic 3-arrow recycle icon instead of
// LIMBAHIN's real 4-arrow logo) — now the same local, verified asset every other logo
// instance in the app uses.
import { LOGO_BADGE_PNG as LOGO_SYMBOL } from "@/assets/logoBadgeBase64.js";

// Dashboard screenshot stand-in — built from the same brand colors instead
// of a real screenshot image, so it never goes stale as the portal UI
// evolves. Sized to read like a genuine product screenshot inside the
// full-bleed picture banner.
function DashboardMock() {
  return (
    <div className="rounded-xl bg-white shadow-2xl overflow-hidden text-left">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-white">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="ml-2 text-[10px] text-gray-400 font-mono truncate">mediacahayacerah.com/login</span>
      </div>
      <div className="flex">
        <div className="hidden sm:flex w-32 flex-shrink-0 flex-col gap-1 bg-[#f7fafb] border-r border-gray-100 p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <img src={LOGO_SYMBOL} alt="" className="h-4 w-auto" />
            <span className="text-[9px] font-bold text-[#1a1a2e]">LIMBAHIN</span>
          </div>
          {["Dashboard", "Cabang", "MOU & Service", "Berita Acara", "Invoice", "Perizinan"].map((l, i) => (
            <div key={l} className={`text-[8px] px-2 py-1.5 rounded ${i === 0 ? "bg-[#2ba5ad] text-white font-semibold" : "text-gray-400"}`}>{l}</div>
          ))}
        </div>
        <div className="flex-1 p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2 mb-2.5">
            {[
              { label: "Total Pengambilan", value: "22" },
              { label: "MOU Aktif", value: "20" },
              { label: "Total Berat", value: "1.3k Kg" },
            ].map((s) => (
              <div key={s.label} className="bg-[#f7fafb] rounded-lg p-2.5">
                <div className="text-[#1a1a2e] text-base font-bold">{s.value}</div>
                <div className="text-gray-400 text-[8px] mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#f7fafb] rounded-lg p-2.5">
            <div className="text-gray-400 text-[8px] mb-1.5">Tren Pengambilan Bulanan</div>
            <div className="flex items-end gap-1 h-12">
              {[30, 55, 40, 70, 95, 60, 45].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-[#3cc0c9]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manifest document stand-in — echoes the Festronik/KLHK manifest PDF the
// portal generates automatically, shown alongside the dashboard mock.
function ManifestMock() {
  const rows = [
    ["28 Aug", "MCCPSL B110d", "Kain majun bekas B3"],
    ["28 Aug", "MCCPSL B104d", "Kemasan bekas B3"],
    ["31 Jul", "MCCPSL A337-2", "Produk farmasi kedaluwarsa"],
  ];
  return (
    <div className="rounded-xl bg-white shadow-2xl overflow-hidden p-3 sm:p-4 text-left">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
        <span className="text-[8px] sm:text-[9px] font-bold text-[#1a1a2e] uppercase tracking-wide">Manifes Limbah B3</span>
        <FileCheck2 size={12} className="text-[#2ba5ad]" />
      </div>
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r[1]} className="flex items-center gap-2 text-[7px] sm:text-[8px] text-gray-500 border-b border-gray-50 pb-1">
            <span className="w-8 flex-shrink-0 text-gray-400">{r[0]}</span>
            <span className="w-16 flex-shrink-0 font-mono text-[#2ba5ad]">{r[1]}</span>
            <span className="truncate">{r[2]}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[7px] text-gray-400">
        <Lock size={9} className="text-[#2ba5ad]" /> Terhubung otomatis dengan sistem Festronik KLHK
      </div>
    </div>
  );
}

export default function DashboardFeatureBanner() {
  return (
    <section className="relative bg-[#12242b] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

      {/* Full-bleed picture layer: screenshot mockups with a bold headline
          overlaid across them, edge-to-edge like a poster/banner. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 pt-10 md:pt-14"
      >
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#2ba5ad]/15 border border-[#2ba5ad]/30 rounded-full px-4 py-1.5">
            <Sparkles size={14} className="text-[#3cc0c9]" />
            <span className="text-[#3cc0c9] text-xs font-bold uppercase tracking-wider">Pertama di Indonesia</span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            {/* Screenshot layer */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#0e2229] p-2 sm:p-3">
              <div className="col-span-2">
                <DashboardMock />
              </div>
              <div className="col-span-1">
                <ManifestMock />
              </div>
            </div>

            {/* Bold overlaid headline, poster-style */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="bg-[#0e2229]/70 backdrop-blur-[2px] rounded-xl px-4 sm:px-8 py-4 sm:py-6 text-center">
                <h2 className="text-lg sm:text-3xl md:text-4xl font-extrabold text-white uppercase leading-tight tracking-tight">
                  Web/Aplikasi Pengelolaan Limbah
                  <br />
                  yang <span className="text-[#3cc0c9]">Terintegrasi</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Supporting copy + CTA beneath the full picture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-8 md:pb-10 text-center"
      >
        <p className="text-white/65 text-base leading-relaxed mb-6">
          Client Portal LIMBAHIN memberi Anda akses langsung ke data pengambilan, MANIFEST limbah, kontrak, invoice,
          perizinan, berita acara, hingga dokumentasi foto/video — semua dalam satu dashboard, real-time, dan
          yang pertama tersedia untuk industri pengelolaan limbah di Indonesia.
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8">
          {[
            { icon: LayoutDashboard, label: "Dashboard real-time" },
            { icon: BarChart3, label: "Laporan & tren otomatis" },
            { icon: FileCheck2, label: "Dokumen legal tersimpan" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <f.icon size={16} className="text-[#3cc0c9] flex-shrink-0" />
              {f.label}
            </div>
          ))}
        </div>

        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25"
        >
          Tanya Cara Mendapatkan Akses <ArrowRight size={15} />
        </a>
        <p className="text-white/40 text-xs mt-3">
          Hubungi tim kami lewat WhatsApp untuk info akses — akan kami bantu langsung di chat.
        </p>
      </motion.div>
    </section>
  );
}
