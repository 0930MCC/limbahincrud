import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Play } from "lucide-react";
import { buildDriveGalleryItems } from "@/data/driveGallery";
import { articles } from "@/data/articles";
import Seo from "@/components/Seo";

// ==========================================================
// Isi link media di sini per kategori.
// Tinggal tempel URL gambar/video ke dalam array masing-masing.
// ==========================================================
const listMedisUrl = ["https://drive.google.com/file/d/1B1H7KTwmLqCGshiECrsMsT_m1_1ud8u8/view?usp=drive_link", "https://drive.google.com/file/d/14BHbpBkXUvASG9CameSzt3uUyZdNCxfb/view?usp=drive_link",];
const listIndustriUrl = [""];
const listKomersilUrl = ["https://drive.google.com/file/d/11SHBNg_7uaaMw95dTjpE_7jqy4wlKSup/view?usp=drive_link",];
const listProdukBahanUrl = ["https://drive.google.com/file/d/18umCL56h1IrGemIteJOuseN6aDC_5umX/view?usp=drive_link", "https://drive.google.com/file/d/11NGVM1-KL86gznPY9bRW5VA-G_GZsD_3/view?usp=drive_link", "https://drive.google.com/file/d/1GPtUppsEtrQ6i_cTFQysjfsgX4ZAGno8/view?usp=drive_link",];
const listArmadaUrl = ["https://drive.google.com/file/d/1dKlMqbanHi7MGF-2VBUuo2JSjLrqA1pU/view?usp=sharing",
  ,];
const listTimOperasionalUrl = ["https://drive.google.com/file/d/1v1zShYdDCEWQkUjfu1xGuj3RYEBmhVIr/view?usp=drive_link", "https://drive.google.com/file/d/1dKlMqbanHi7MGF-2VBUuo2JSjLrqA1pU/view?usp=drive_link",];
const listDokumentasiUrl = ["https://drive.google.com/file/d/1rfeMtfJG6t-_WZSQ1BNukaWw2wgDH4ws/view?usp=sharing", "https://drive.google.com/file/d/1rfeMtfJG6t-_WZSQ1BNukaWw2wgDH4ws/view?usp=drive_link"];

// Map kategori -> daftar url, dipakai untuk generate item galeri otomatis
const categoryUrlMap = {
  "Medis": listMedisUrl,
  "Industri": listIndustriUrl,
  "Komersil": listKomersilUrl,
  "Produk & Bahan": listProdukBahanUrl,
  "Armada": listArmadaUrl,
  "Tim & Operasional": listTimOperasionalUrl,
  "Dokumentasi": listDokumentasiUrl,
};

// Terima link share Google Drive (.../file/d/FILE_ID/view...) dan ubah
// jadi link gambar langsung yang bisa dipakai di <img src>.
// Kalau url bukan link Drive, dikembalikan apa adanya.
function toDirectImageUrl(url) {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

function buildCategoryItems(urlMap) {
  const items = [];
  for (const [category, urls] of Object.entries(urlMap)) {
    urls.forEach((rawUrl, index) => {
      const url = toDirectImageUrl(rawUrl);
      items.push({
        url,
        thumb: url,
        sourceUrl: rawUrl, // link asli untuk dibuka di tab baru
        title: `${category} ${index + 1}`,
        category,
        description: "",
        type: "image",
      });
    });
  }
  return items;
}

const manualItems = buildCategoryItems(categoryUrlMap);

// Drive-hosted images/videos (see src/data/driveGallery.js to add more)
const driveItems = buildDriveGalleryItems();

// Every image used in an article (images1 + images2 in data/articles.js) also shows up here, so
// there's one place to add an image and it appears in both. Sorted into the gallery categories by
// the article's topic where that's obvious (medis / industri / oli bekas), otherwise "Artikel".
// Anything already listed above (same direct URL) is skipped so nothing shows twice.
function galleryCategoryForArticle(a) {
  const key = `${a.slug} ${a.title}`.toLowerCase();
  if (key.includes("medis")) return "Medis";
  if (key.includes("industri") || key.includes("oli bekas")) return "Industri";
  return "Artikel";
}

function buildArticleItems(alreadyShown) {
  const seen = new Set(alreadyShown.map((i) => i.url));
  const items = [];
  articles.forEach((a) => {
    [...(a.images1 || []), ...(a.images2 || [])].forEach((raw) => {
      const url = toDirectImageUrl(String(raw || "").trim());
      if (!url || seen.has(url)) return;
      seen.add(url);
      items.push({
        url,
        thumb: url,
        sourceUrl: raw,
        title: a.title,
        category: galleryCategoryForArticle(a),
        description: "",
        type: "image",
      });
    });
  });
  return items;
}

const articleItems = buildArticleItems([...manualItems, ...driveItems]);

const allItems = [...manualItems, ...driveItems, ...articleItems];

const knownCategories = [...Object.keys(categoryUrlMap), "Artikel"];
const filterCategories = ["Semua", ...knownCategories, "Video"];

// Menentukan link mana yang dibuka di tab baru saat media diklik.
// Prioritas: sourceUrl (link asli, misalnya link share Drive) -> embedUrl (video) -> url (gambar).
function getOpenUrl(item) {
  return item.sourceUrl || item.embedUrl || item.url;
}

export default function Galeri() {
  const [filter, setFilter] = useState("Semua");

  const filtered = filter === "Semua" ? allItems : allItems.filter((img) => img.category === filter);

  const handleOpen = (item) => {
    window.open(getOpenUrl(item), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Seo
        title="Galeri Dokumentasi Pengelolaan Limbah B3"
        description="Dokumentasi kegiatan pengangkutan dan pengelolaan limbah B3 LIMBAHIN: limbah medis, industri, komersial, armada, dan tim operasional."
        path="/galeri"
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Galeri</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">Dokumentasi aktivitas pengelolaan limbah LIMBAHIN bersama PT. Media Cahaya Cerah.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {allItems.length > 0 && (
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {filterCategories.map((c) => (
                  <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${filter === c ? "bg-[#2ba5ad] text-white border-[#2ba5ad]" : "bg-white text-gray-600 border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* This whole block was accidentally commented out — it's not just the "no photos yet"
              empty state, it's also the grid that renders every image (both branches of the
              ternary were inside the same comment), which is why the gallery showed nothing at
              all regardless of how many images were available. */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Belum ada foto</h3>
              <p className="text-gray-500 text-sm max-w-md">Tambahkan link media ke salah satu list di bagian atas file ini (misalnya <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">listMedisUrl</code>) dan foto akan otomatis muncul di galeri.</p>
              <div className="mt-4 bg-[#f7fafb] rounded-xl p-4 border border-gray-100 text-left max-w-md">
                <p className="text-xs text-gray-500 mb-1">Contoh:</p>
                <p className="text-xs text-gray-400">listMedisUrl = ["https://.../rumah-sakit.jpg"]</p>
                <p className="text-xs text-gray-400">listIndustriUrl = ["https://.../pabrik-kimia.jpg"]</p>
                <p className="text-xs text-gray-400">listArmadaUrl = ["https://.../truk-pengangkut.jpg"]</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id || img.url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleOpen(img)}
                >
                  <img
                    src={img.thumb || img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover"
                  />
                  {img.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                        <Play size={20} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-white text-sm font-semibold">{img.title}</h3>
                    {img.category && <span className="text-[#3cc0c9] text-xs">{img.category}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
