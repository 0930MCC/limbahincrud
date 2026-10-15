import React, { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
// import heroImg from "@/assets/gallery/Medis - Rumah Sakit.jpg";
// import heroImg from "https://lh3.googleusercontent.com/d/1IUazxf2Z4Tn6cAOl7GWHeshyHopwUFbb";

// Title image carousel on the right side of the hero — add/remove links here
// to change what shows. Each entry needs an image and an alt description.
const HERO_IMAGES = [
  { src: "https://lh3.googleusercontent.com/d/1v1zShYdDCEWQkUjfu1xGuj3RYEBmhVIr", alt: "Limbah1" },
  { src: "https://lh3.googleusercontent.com/d/1IUazxf2Z4Tn6cAOl7GWHeshyHopwUFbb", alt: "Limbah2" },
  { src: "https://lh3.googleusercontent.com/d/11SHBNg_7uaaMw95dTjpE_7jqy4wlKSup", alt: "Limbah3" },
  { src: "https://lh3.googleusercontent.com/d/1_YB4P1Ks3PwA5MjRjJ3-MeLvdNNVjGXW", alt: "Limbah4" },
  // { src: "https://drive.google.com/file/d/1v1zShYdDCEWQkUjfu1xGuj3RYEBmhVIr/view?usp=drive_link", alt: "Pengangkutan limbah B3 medis" },
  // { src: "https://drive.google.com/file/d/11SHBNg_7uaaMw95dTjpE_7jqy4wlKSup/view?usp=drive_link", alt: "Pengelolaan limbah B3 industri" },
  // { src: "https://drive.google.com/file/d/1_YB4P1Ks3PwA5MjRjJ3-MeLvdNNVjGXW/view?usp=drive_link", alt: "Pengelolaan limbah B3 komersil" },
];

function HeroCarousel() {
  const [api, setApi] = useState(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => api.off("select", onSelect);
  }, [api]);

  // Auto-advance every 5s, pausing pointlessly is unnecessary here since it's
  // purely decorative — just loop through the images.
  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(id);
  }, [api]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {HERO_IMAGES.map((img, i) => (
            <CarouselItem key={i}>
              <img
                src={img.src}
                referrerPolicy="no-referrer"
                alt={img.alt}
                className="w-full h-[500px] object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {HERO_IMAGES.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${selected === i ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative bg-[#12242b] overflow-hidden min-h-[560px]">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 md:pt-14 pb-20 md:pb-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-5">
              <ShieldCheck size={14} className="text-[#3cc0c9]" />
              <span className="text-white/80 text-xs font-medium">Berizin KLHK & Terpercaya Sejak 2019</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Jasa Pengelolaan Limbah B3 Jabodetabek yang{" "}
              <span className="text-[#3cc0c9]">Aman, Berizin</span>{" "}
              & Terpercaya
            </h1>

            <p className="text-white/65 text-base leading-relaxed mb-7 max-w-lg">
              Bingung sama limbah? LIMBAHIN aja! Dikelola oleh PT. Media Cahaya Cerah, kami mengelola lebih dari 200+ jenis limbah B3/Non B3 secara berizin, aman dan menyeluruh. Spesialis limbah medis, industri, dan komersil.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#quotation" className="inline-flex items-center justify-center gap-2 bg-[#2ba5ad] hover:bg-[#239198] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#2ba5ad]/25">
                Minta Penawaran <ArrowRight size={15} />
              </a>
              <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20perkenalkan%20nama%3A%20%20%20dari%3A%20%20%20kami%20ingin%20konsultasi%20tentang%3A%0A%5BBTN14%5D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/5 transition-all">
                Konsultasi Gratis
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}</div>
              <span className="text-white font-bold text-sm">4.9/5</span>
              <span className="text-white/50 text-xs">Kepuasan dari 500+ Mitra Perusahaan & Instansi</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.2 }} className="relative hidden lg:block">
            <HeroCarousel />
          </motion.div>
        </div>
      </div>
    </section>);

}