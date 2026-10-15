import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Video, Search } from 'lucide-react';
import Seo, { SITE_URL } from '@/components/Seo';
import { articles, ARTICLE_CATEGORIES, categoryLabel } from '@/data/articles';

// Kept exported for anything that imported the old `articles` array from this page directly.
export { articles };

export default function Artikel() {
  // /artikel -> all articles; /artikel/<category> -> that category. The category comes from the URL
  // (not component state) so every category has its own crawlable page with its own canonical.
  const { category } = useParams();
  const knownCategory = ARTICLE_CATEGORIES.some((c) => c.slug === category);
  const activeCategory = knownCategory ? category : 'semua';
  const [search, setSearch] = useState('');
  const list = useMemo(() => {
    const byCategory = activeCategory === 'semua' ? articles : articles.filter((a) => a.category === activeCategory);
    const q = search.trim().toLowerCase();
    return q ? byCategory.filter((a) => a.title.toLowerCase().includes(q)) : byCategory;
  }, [activeCategory, search]);

  // An unknown /artikel/<something> is not a category: send it to the main list.
  if (category && !knownCategory) return <Navigate to="/artikel" replace />;

  const label = knownCategory ? categoryLabel(category) : null;
  const pagePath = knownCategory ? `/artikel/${category}` : '/artikel';

  return (
    <>
      <Seo
        title={label ? `Artikel ${label} Limbah B3` : "Artikel Limbah B3: Panduan, Regulasi & Edukasi"}
        description={label
          ? `Kumpulan artikel ${label.toLowerCase()} seputar pengelolaan limbah B3 di Indonesia dari LIMBAHIN.`
          : "Panduan, regulasi, dan edukasi pengelolaan limbah B3 di Indonesia, termasuk layanan untuk Jakarta, Bekasi, Depok, dan Cikarang dari LIMBAHIN."}
        path={pagePath}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: label ? `Artikel ${label} — LIMBAHIN` : 'Artikel LIMBAHIN',
          url: `${SITE_URL}${pagePath}`,
        }}
      />

      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Kabar Terbaru</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">{label ? `Artikel ${label}` : "Edukasi & Regulasi Pengelolaan Limbah"}</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Informasi terkini seputar pengelolaan limbah B3, regulasi KLHK, dan panduan praktis untuk industri.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 mx-auto max-w-md relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel berdasarkan judul..."
              aria-label="Cari artikel berdasarkan judul"
              className="w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 py-2.5 text-sm text-[#1a1a2e] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2ba5ad]/40 focus:border-[#2ba5ad]"
            />
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {[{ slug: 'semua', label: 'Semua' }, ...ARTICLE_CATEGORIES].map((c) => (
              <Link
                key={c.slug}
                to={c.slug === 'semua' ? '/artikel' : `/artikel/${c.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === c.slug
                    ? 'bg-[#2ba5ad] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-12">
              Tidak ada artikel yang cocok dengan "{search}".
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((a, i) => (
              <motion.div key={`${a.category}/${a.slug}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.08, duration: 0.5 }}
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
    </>
  );
}
