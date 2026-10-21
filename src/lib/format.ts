import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../site.config';

export type Villa = CollectionEntry<'villas'>;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: site.currency,
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(value);

export const formatArea = (m2: number) => `${m2.toLocaleString('en-AU')} m²`;

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** All villas, sorted by their `order` field. */
export const getVillas = async () =>
  (await getCollection('villas')).sort((a, b) => a.data.order - b.data.order);

export const whatsappLink = (message: string = site.contact.whatsappMessage) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
