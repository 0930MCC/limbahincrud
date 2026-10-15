// Site-wide JSON-LD building blocks (schema.org). See components/JsonLd.jsx for how these get
// injected, and Layout.jsx for where the two below are mounted (once, for every marketing page).
import { SITE_URL } from '@/components/Seo';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LIMBAHIN',
  alternateName: 'PT Media Cahaya Cerah',
  url: SITE_URL,
  // Must be a real, fetchable image URL — not a data: URI — or Google's structured-data
  // validator rejects it. Points at the same favicon set generated for index.html
  // (public/icon-512.png), not a "favicon.png" that was never actually created.
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/icon-512.png`,
  email: 'cs@mediacahayacerah.com',
  telephone: '+6281517005533',
  sameAs: [
    'https://www.instagram.com/limbahin_mcc',
    'https://www.facebook.com/profile.php?id=61593783071940',
    'https://www.youtube.com/@limbahin_mcc',
    'https://id.linkedin.com/company/mediacahayacerah',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ruko Premium Icon City Blok B23, Jln. Boulevard Raya Deltamas No.189',
    addressLocality: 'Cikarang Pusat',
    addressRegion: 'Jawa Barat',
    postalCode: '17530',
    addressCountry: 'ID',
  },
};

// LocalBusiness — a more specific type than Organization above; this is the one SEO checkers
// that ask for "Local Business Schema" are looking for (it adds geo coordinates + opening hours,
// which Organization doesn't carry). Coordinates match the Google Maps embed already used on the
// Hubungi Kami page. Kept as a second, separate JSON-LD block rather than merged into
// organizationSchema so a page can use either independently.
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'LIMBAHIN — PT Media Cahaya Cerah',
  image: `${SITE_URL}/icon-512.png`,
  url: SITE_URL,
  telephone: '+6281517005533',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ruko Premium Icon City Blok B23, Jln. Boulevard Raya Deltamas No.189',
    addressLocality: 'Cikarang Pusat',
    addressRegion: 'Jawa Barat',
    postalCode: '17530',
    addressCountry: 'ID',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -6.358179, longitude: 107.179844 },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Pengelolaan Limbah B3',
  name: 'Pengelolaan dan Pengangkutan Limbah B3',
  provider: { '@type': 'Organization', name: 'LIMBAHIN' },
  areaServed: [
    { '@type': 'Country', name: 'Indonesia' },
    ...['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Cikarang'].map((n) => ({ '@type': 'City', name: n })),
  ],
  url: SITE_URL,
};

// Small helper other pages can use for their own BreadcrumbList (see ArtikelDetail.jsx for the
// richer example this mirrors) — `crumbs` is [{ name, path }], path relative (e.g. "/harga-limbah").
export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}
