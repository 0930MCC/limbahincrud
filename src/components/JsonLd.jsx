import { useEffect } from 'react';

// Injects one or more <script type="application/ld+json"> blocks into <head> and removes them on
// unmount. Deliberately separate from Seo.jsx (which also sets document.title/meta/canonical) —
// Layout.jsx mounts this once, site-wide, for the Organization/Service schema, while individual
// pages mount their own Seo (title + description + page-specific jsonLd) further down the tree.
// React fires child effects before parent effects, so if title-setting logic lived in both, the
// site-wide one (an ancestor) would run LAST and clobber whatever the page had just set — keeping
// this schema-only means there's nothing here that could ever race with a page's own <title>.
export default function JsonLd({ data }) {
  useEffect(() => {
    const items = Array.isArray(data) ? data : data ? [data] : [];
    const scripts = items.map((obj) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.textContent = JSON.stringify(obj);
      document.head.appendChild(el);
      return el;
    });
    return () => scripts.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  return null;
}
