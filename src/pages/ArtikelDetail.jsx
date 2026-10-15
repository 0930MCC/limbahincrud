import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronRight, Video } from 'lucide-react';
import Seo, { SITE_URL } from '@/components/Seo';
import ArticleCarousel from '@/components/artikel/ArticleCarousel';
import { articles, findArticle, categoryLabel } from '@/data/articles';
import { youTubeEmbedUrl } from '@/lib/youtube';

// Every article renders through this SAME fixed layout, top to bottom:
//   1. Carousel 1 (article.images1)
//   2. Paragraphs 1 (article.paragraphs1 — a list of short paragraphs)
//   3. Carousel 2 (article.images2) — the same carousel component, in between the two paragraphs
//   4. Paragraph 2
//   5. CTA button (article.ctaLabel -> article.ctaPath)
//   6. YouTube video (article.videoUrl), only if the article has one
// A carousel with no images yet, or no video link, simply doesn't render — nothing else about the
// layout changes.
export default function ArtikelDetail() {
  const { category, slug } = useParams();
  const article = findArticle(category, slug);

  if (!article) return <Navigate to="/artikel" replace />;

  // Prefer the article's own explicit `related` chain (a deliberate cluster of pages that link to
  // each other, e.g. Pengelolaan Limbah B3 -> Pengangkutan -> Limbah Medis -> ... -> Cikarang) over
  // a generic same-category listing — that's what turns these into a linked cluster instead of a
  // pile of independent pages. Falls back to same-category, then any other article, only to fill
  // out to 3 cards when the explicit chain is shorter.
  const explicit = (article.related || [])
    .map((r) => findArticle(r.category, r.slug))
    .filter(Boolean);
  const related = [
    ...explicit,
    ...articles.filter(
      (a) => !(a.category === category && a.slug === slug) &&
        a.category === article.category &&
        !explicit.some((e) => e.category === a.category && e.slug === a.slug)
    ),
  ].slice(0, 3);
  const others = articles
    .filter(
      (a) => !(a.category === category && a.slug === slug) &&
        a.category !== article.category &&
        !related.some((r) => r.category === a.category && r.slug === a.slug)
    )
    .slice(0, 3 - related.length);

  const embedUrl = youTubeEmbedUrl(article.videoUrl);
  const canonicalPath = `/artikel/${article.category}/${article.slug}`;

  return (
    <>
      <Seo
        title={article.title}
        description={article.excerpt}
        path={canonicalPath}
        type="article"
        image={article.images1?.[0]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            author: { '@type': 'Organization', name: article.author || 'LIMBAHIN' },
            publisher: { '@type': 'Organization', name: 'LIMBAHIN' },
            datePublished: article.date,
            dateModified: article.date,
            image: article.images1?.[0] ? [article.images1[0].startsWith('/') ? `${SITE_URL}${article.images1[0]}` : article.images1[0]] : undefined,
            mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Artikel', item: `${SITE_URL}/artikel` },
              { '@type': 'ListItem', position: 3, name: categoryLabel(article.category), item: `${SITE_URL}/artikel/${article.category}` },
              { '@type': 'ListItem', position: 4, name: article.title, item: `${SITE_URL}${canonicalPath}` },
            ],
          },
        ]}
      />

      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-16">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb — Home > Artikel > <Category> > <Title> */}
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] text-white/50">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link to="/artikel" className="hover:text-white">Artikel</Link>
            <ChevronRight size={12} />
            <span className="text-white/70">{categoryLabel(article.category)}</span>
            <ChevronRight size={12} />
            <span className="text-white/70 line-clamp-1">{article.title}</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#2ba5ad] text-white text-xs font-bold px-3 py-1 rounded-full">{categoryLabel(article.category)}</span>
              <span className="text-white/50 text-xs">{article.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{article.title}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link to="/artikel" className="inline-flex items-center gap-1.5 text-[#2ba5ad] text-sm font-semibold hover:gap-2.5 transition-all mb-8">
            <ArrowLeft size={14} /> Kembali ke Artikel
          </Link>

          {/* 1. Carousel 1 */}
          <div className="relative">
            <ArticleCarousel images={article.images1} title={article.title} />
            {embedUrl && article.images1?.length > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Video size={12} /> Video
              </div>
            )}
          </div>

          {/* 2. Paragraph 1 */}
          <div className="prose max-w-none">
            {(article.paragraphs1 || []).map((t, i) => (
              <p key={i} className="text-gray-600 text-base leading-relaxed mb-5">{t}</p>
            ))}
          </div>

          {/* 3. Carousel 2, between the two paragraphs */}
          <ArticleCarousel images={article.images2} title={article.title} />

          {/* 4. Paragraph 2 */}
          <div className="prose max-w-none">
            {(article.paragraphs2 || []).map((t, i) => (
              <p key={i} className="text-gray-600 text-base leading-relaxed mb-5">{t}</p>
            ))}
          </div>

          {/* Sources — only for articles that cite official texts (the Perizinan series) */}
          {article.sources?.length > 0 && (
            <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="text-sm font-bold text-[#1a1a2e] mb-2">Sumber & Rujukan</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {article.sources.map((src) => (
                  <li key={src.url}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[#2ba5ad] hover:underline break-words">{src.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. CTA button */}
          <div className="mt-12 bg-[#f7fafb] rounded-2xl p-8 border border-gray-100 text-center">
            <h2 className="font-bold text-[#1a1a2e] mb-2">Butuh konsultasi pengelolaan limbah?</h2>
            <p className="text-gray-500 text-sm mb-5">Tim LIMBAHIN siap membantu kebutuhan pengelolaan limbah B3 Anda.</p>
            <Link
              to={article.ctaPath || '/harga-limbah'}
              className="inline-flex items-center gap-2 bg-[#2ba5ad] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#239198] transition-colors"
            >
              {article.ctaLabel || 'Lihat Daftar Harga'}
            </Link>
          </div>

          {/* 6. YouTube video, only if this article has one */}
          {embedUrl && (
            <div className="mt-10 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
              <iframe
                src={embedUrl}
                title={article.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {(related.length > 0 || others.length > 0) && (
        <section className="py-16 bg-[#f7fafb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8 text-center">Artikel Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[...related, ...others].map((a) => (
                <Link key={`${a.category}/${a.slug}`} to={`/artikel/${a.category}/${a.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    {a.images1?.[0] && (
                      <img src={a.images1[0]} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer"/>
                    )}
                    <div className="absolute top-3 left-3 bg-[#2ba5ad] text-white text-xs font-bold px-2.5 py-1 rounded-full">{categoryLabel(a.category)}</div>
                    {a.videoUrl && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <Video size={11} /> Video
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-xs mb-1.5">{a.date}</p>
                    <h3 className="font-bold text-[#1a1a2e] text-sm leading-snug group-hover:text-[#2ba5ad] transition-colors mb-2">{a.title}</h3>
                    <span className="inline-flex items-center gap-1 text-[#2ba5ad] text-xs font-semibold">Baca <ArrowRight size={11} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
