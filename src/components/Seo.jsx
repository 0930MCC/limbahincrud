import { useEffect } from 'react';

export const SITE_NAME = 'LIMBAHIN';
export const SITE_URL = 'https://www.mediacahayacerah.com';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeCanonical() {
  document.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
}

function upsertCanonical(href) {
  if (!href) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Sets the per-page <title>/description/OG/Twitter tags and, optionally, one or more JSON-LD
// structured-data blocks. Mount ONE of these per page (near the top of the component's return).
//
// REMAINING CAVEAT — everything here runs client-side, after the page has already loaded and
// React has mounted. That's fine for Googlebot (which renders JS before indexing) but means any
// crawler/bot that does NOT execute JS — some link-preview/social-share bots, some SEO tools —
// only ever sees the bare index.html title/description, not this page's specific ones. index.html
// carries reasonable defaults for exactly that reason. (This used to also carry a second problem:
// the app ran on HashRouter, so every real URL looked like .../#/artikel/..., and most crawlers
// treat anything after "#" as client-side-only and won't index it as its own page. The app now
// runs on BrowserRouter — plain paths, no "#" — so that part is resolved as long as the host
// serves index.html for every path; see public/.htaccess.)
export default function Seo({ title, description, path, image, noIndex = false, type = 'website', jsonLd }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `Pengelolaan & Pengangkutan Limbah B3 Jabodetabek | ${SITE_NAME}`;
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    // og:image must be an absolute URL; images served from /public are given as '/artikel/x.jpg'.
    const absImage = image && image.startsWith('/') ? `${SITE_URL}${image}` : image;
    if (absImage) upsertMeta('property', 'og:image', absImage);

    upsertMeta('name', 'twitter:card', absImage ? 'summary_large_image' : 'summary');
    if (absImage) upsertMeta('name', 'twitter:image', absImage);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);

    // A noindex page must NOT carry a canonical pointing somewhere else (mixed signals), so drop it.
    // Otherwise set the page's own canonical, so Google never treats it as a copy of another URL.
    const canonical = path && !noIndex ? `${SITE_URL}${path}` : undefined;
    if (noIndex) removeCanonical();
    if (canonical) {
      upsertMeta('property', 'og:url', canonical);
      upsertCanonical(canonical);
    }

    const items = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    const scripts = items.map((obj) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.textContent = JSON.stringify(obj);
      document.head.appendChild(el);
      return el;
    });

    return () => scripts.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, noIndex, type, JSON.stringify(jsonLd)]);

  return null;
}
