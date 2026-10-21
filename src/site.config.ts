/**
 * ─────────────────────────────────────────────────────────────
 *  SITE SETTINGS — edit everything here, no component changes needed.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  /** Development / brand name shown in the header, titles and footer */
  name: 'Westworld Seminyak',
  developer: 'Westworld Nominees',
  tagline: 'Quiet luxury, a short stroll from the Seminyak shore.',
  /** Production URL — used for canonical links, Open Graph and the sitemap */
  url: 'https://www.example.com',
  description:
    'A private collection of luxury villas in Seminyak, Bali by Westworld Nominees. Explore available villas, floor plans and pricing, and enquire today.',
  locale: 'en_AU',

  contact: {
    email: 'hello@example.com',
    phone: '+62 000 000 0000',
    /** WhatsApp number in international format, digits only (no +, spaces or dashes) */
    whatsapp: '620000000000',
    whatsappMessage: "Hi, I'm interested in the Westworld Seminyak villas.",
    address: ['Jl. Placeholder No. 1', 'Seminyak, Kuta Utara', 'Bali 80361, Indonesia'],
  },

  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    linkedin: '',
    youtube: '',
  },

  /** Optional looping hero video (put the file in /public/video/). Leave empty to use the hero image. */
  heroVideo: '',

  /** Currency used for "From" prices */
  currency: 'USD',

  location: {
    area: 'Seminyak',
    mapQuery: 'Seminyak, Bali, Indonesia',
  },
} as const;

export const nav = [
  { href: '/villas/', label: 'Villas' },
  { href: '/location/', label: 'Location' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
] as const;
