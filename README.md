# Westworld Seminyak — villa marketing site

Astro + Tailwind CSS static site for the Westworld Nominees villa development in Seminyak, Bali.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Site details (phone, email, WhatsApp, socials, address)

Everything lives in **`src/site.config.ts`**. Edit and save; every page updates.

- `whatsapp` must be digits only in international format, e.g. `61412345678`.
- `url` is your live domain; it's used for the sitemap, canonical links and social share images.
- `heroVideo`: drop an `.mp4` into `public/video/` and set e.g. `'/video/hero.mp4'` to use a looping hero video.

## Add a new villa

1. Create a folder for its photos: `src/assets/images/villas/villa-new-name/`
   and add `hero.jpg`, `gallery-01.jpg` … and `floor-plan.png` (any names work).
2. Copy an existing file in `src/content/villas/` (e.g. `villa-pasir.md`) to `villa-new-name.md`.
   The file name becomes the URL: `/villas/villa-new-name/`.
3. Edit the details at the top (the "frontmatter"):

   | Field | Notes |
   | --- | --- |
   | `name`, `tagline`, `summary` | Summary is used on cards and in Google results |
   | `status` | `Available`, `Reserved` or `Sold` |
   | `priceFrom` | Plain number, e.g. `650000` (currency set in site config) |
   | `bedrooms`, `bathrooms`, `landSize`, `buildingSize` | Sizes in m² |
   | `pool`, `ownership` | Free text |
   | `order` | Lower numbers are listed first |
   | `featured` | `true` to show on the home page (first three are shown) |
   | `heroImage` / `gallery` / `floorPlan` | Paths relative to the Markdown file, e.g. `../../assets/images/villas/villa-new-name/hero.jpg` |
   | `heroAlt`, gallery `alt` | Short description of each photo (for accessibility and SEO) |
   | `amenities` | A list, one per line starting with `- ` |

4. Write the description below the closing `---` as normal paragraphs. The first paragraph is styled as an intro.

The villa appears automatically on the Villas page, in the enquiry form's villa dropdown, in "More villas" and in the Gallery. If a required field is missing or misspelt, `npm run dev` shows exactly which one.

## Swap images

All photos live in **`src/assets/images/`** and are resized and converted to WebP/AVIF automatically at build time.
Every placeholder has its file path printed in the corner, so you can see which file to replace.

- **Easiest:** replace a file with your photo using the **same name** (e.g. `home/hero.jpg`). Use `.jpg` for photos; the aspect ratio doesn't need to match, as images are cropped to fit.
- Upload large originals (around 2400px wide for heroes, 1600px for everything else). The build makes the smaller versions.
- **Gallery page:** any image added to `src/assets/images/gallery/` appears automatically (sorted by file name). Optional captions go in the `captions` list at the top of `src/pages/gallery.astro`.
- `npm run placeholders` regenerates only *missing* placeholder images; it never overwrites your photos.

| Folder | Used on |
| --- | --- |
| `home/` | Home hero (`hero.jpg`, also the default social share image), intro and lifestyle images |
| `villas/<villa>/` | Each villa's hero, gallery and floor plan |
| `location/` | Location page and home location teaser; `map-preview.jpg` sits behind the "Load map" button |
| `about/` | About page, including `frank-portrait.jpg` |
| `gallery/` | Gallery page |

Page copy (Home, Location, About) is in the matching file under `src/pages/`.

## Enquiry forms (Netlify Forms)

Forms submit to **Netlify Forms** and appear under *Site → Forms* in the Netlify dashboard once deployed.
Turn on email notifications there (*Forms → Form notifications*). Locally, `npm run dev` only simulates sending
and logs the data to the browser console; real submissions only work on Netlify.

## Deploy

- **Netlify (recommended, required for the forms):** connect the repo. `netlify.toml` already sets `npm run build` → `dist`.
- **Vercel:** works with zero config, but you'd need to switch the forms to a service like Formspree.

## Design tokens & motion

- Colours and fonts are theme tokens in `src/styles/global.css` (`bg-sand`, `text-ocean`, `bg-seafoam`, `text-driftwood`, `bg-linen`, `font-serif`, `font-sans`).
  Fonts (Cormorant Garamond, Karla) are fetched from Google Fonts at build time and self-hosted, via `fonts` in `astro.config.mjs`.
- Page transitions use Astro's `<ClientRouter />`: a 400ms crossfade (`src/lib/transitions.ts`). Villa images morph from card to page hero via matching `transition:name`. The header and WhatsApp button are persisted.
- Add `class="rise"` (plus `rise-2`/`rise-3` for stagger) to fade content up on arrival, or `data-reveal` to fade it in on scroll.
- Everything is disabled for visitors with *reduce motion* turned on.
