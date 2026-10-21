import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const villas = defineCollection({
  // Each Markdown file in src/content/villas/ becomes a villa page at /villas/<file-name>/
  loader: glob({ pattern: '**/*.md', base: './src/content/villas' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      /** Short summary for cards and search results (aim for ~150 characters) */
      summary: z.string(),
      /** Lower numbers appear first */
      order: z.number().default(99),
      featured: z.boolean().default(false),
      status: z.enum(['Available', 'Reserved', 'Sold']),
      /** "From" price as a plain number, e.g. 650000 */
      priceFrom: z.number(),
      bedrooms: z.number(),
      bathrooms: z.number(),
      /** Square metres */
      landSize: z.number(),
      buildingSize: z.number(),
      pool: z.string(),
      ownership: z.string(),
      heroImage: image(),
      heroAlt: z.string(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      floorPlan: image().optional(),
      floorPlanAlt: z.string().default('Floor plan'),
      amenities: z.array(z.string()).default([]),
    }),
});

export const collections = { villas };
