import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// The one carousel used at both "carousel" slots in ArtikelDetail's fixed article layout. Renders
// nothing when there are no images yet, so a not-yet-filled-in carousel just quietly disappears
// rather than showing a broken/empty frame.
export default function ArticleCarousel({ images, title = '' }) {
  const list = (images || []).filter(Boolean);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  if (list.length === 0) return null;

  const scrollTo = (i) => {
    const idx = Math.max(0, Math.min(list.length - 1, i));
    setActive(idx);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
        onScroll={(e) => {
          const track = e.currentTarget;
          if (track.clientWidth) setActive(Math.round(track.scrollLeft / track.clientWidth));
        }}
      >
        {list.map((src, i) => (
          <img
            key={i}
            src={src}
            referrerPolicy="no-referrer"
            alt={title ? `${title} — foto ${i + 1}` : `Foto ${i + 1}`}
            loading="lazy"
            className="h-72 w-full shrink-0 snap-start object-cover md:h-96"
          />
        ))}
      </div>

      {list.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => scrollTo(active - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#1a1a2e] shadow hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={() => scrollTo(active + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#1a1a2e] shadow hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Gambar ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
