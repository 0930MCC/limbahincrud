import React from "react";
import { ArrowRight, Video } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { articles, categoryLabel } from "@/data/articles";

// Was its own separate, hard-coded 3-article list (with `id`-only links like `/artikel/festronik`)
// that had drifted out of sync with data/articles.js and pointed at a route shape that no longer
// exists now that articles live at /artikel/<category>/<slug>. Pulling straight from the shared
// data avoids a second copy to keep in sync.
const featured = articles.slice(0, 3);

export default function ArticleSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="text-[#2ba5ad] text-sm font-semibold uppercase tracking-wider">Kabar Terbaru</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mt-3">Edukasi & Regulasi Pengelolaan Limbah</h2>
          </div>
          <Link to="/artikel" className="inline-flex items-center gap-2 text-[#2ba5ad] text-sm font-semibold hover:gap-3 transition-all whitespace-nowrap">
            Lihat Semua Artikel <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((a, i) => (
            <motion.div key={`${a.category}/${a.slug}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link to={`/artikel/${a.category}/${a.slug}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {a.images1?.[0] && (
                    <img src={a.images1[0]} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  )}
                  <div className="absolute top-3 left-3 bg-[#2ba5ad] text-white text-xs font-bold px-3 py-1 rounded-full">{categoryLabel(a.category)}</div>
                    {a.videoUrl && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <Video size={11} /> Video
                      </div>
                    )}
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-xs mb-2">{a.date}</p>
                  <h3 className="font-bold text-[#1a1a2e] mb-2 text-sm leading-snug group-hover:text-[#2ba5ad] transition-colors">{a.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{a.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-[#2ba5ad] text-xs font-semibold">Pelajari Selengkapnya <ArrowRight size={12} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
