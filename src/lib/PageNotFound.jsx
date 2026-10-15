import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Trash2 } from "lucide-react";
import Seo from "@/components/Seo";

export default function PageNotFound() {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <>
    {/* Unknown URL: keep it out of the index (an SPA cannot send a real 404 status) */}
    <Seo title="Halaman Tidak Ditemukan" description="Halaman yang Anda cari tidak ditemukan." noIndex />
    <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] min-h-[70vh] flex items-center py-24">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#2ba5ad]/15 border border-[#2ba5ad]/30 mb-6">
          <Trash2 className="text-[#3cc0c9]" size={36} />
        </div>

        <p className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider mb-3">Error 404</p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Halaman Ini Sudah Dibuang
        </h1>
        <p className="text-white/60 text-base leading-relaxed mb-2 max-w-md mx-auto">
          Sepertinya halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.
        </p>
        {pathName && (
          <p className="text-white/30 text-xs font-mono mb-8 break-all">"{pathName}"</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25 w-full sm:w-auto"
          >
            <Home size={16} /> Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/5 transition-all w-full sm:w-auto"
          >
            <ArrowLeft size={16} /> Halaman Sebelumnya
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
