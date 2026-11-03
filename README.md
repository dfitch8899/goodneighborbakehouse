# Good Neighbor Bakehouse

Website for Good Neighbor Bakehouse, a small-batch home bakery in Athens, Ohio.
Static [Astro](https://astro.build) site, hosted on GitHub Pages:
https://dfitch8899.github.io/goodneighborbakehouse/

- Orders go through the [Google Form](https://forms.gle/4nqoQgoPxrKvFaLPA); payment is Venmo or cash.
- The menu (items, prices, sold out, weekly Move-In, announcement, pickup details) lives in a
  Google Sheet that Mia edits. See [docs/HANDOFF.md](docs/HANDOFF.md).

## How the menu gets from the sheet to the site

`.github/workflows/deploy.yml` runs on every push, every 3 hours, and on demand. It runs
`scripts/sync-sheet.mjs`, which downloads the `menu`, `bundles` and `settings` tabs as CSV,
validates them against `src/data/schema.mjs` and writes `src/data/menu.json`. If anything is
wrong (a typo in a price, the sheet not shared, Google down), the sync keeps the last good
`menu.json` and the build carries on, so a bad edit can't take the site down. Changed menus are
committed back to the repo, so `menu.json` is always the latest good copy.

Setup (once): share the sheet as **Anyone with the link: Viewer**, then add a repository
variable `SHEET_ID` (Settings → Secrets and variables → Actions → Variables) with the id from
the sheet's URL.

## Develop

Requires Node 22.12+.

```bash
npm install
npm run dev          # http://localhost:4321/goodneighborbakehouse/
npm run sync         # rebuild menu.json from scripts/fixtures/*.csv
SHEET_SOURCE=live SHEET_ID=... npm run sync   # or from the real sheet
npm run build && npm run preview
```

## Project layout

| Path | What |
| --- | --- |
| `src/pages/` | `index.astro` (home), `faq.astro`, `404.astro` |
| `src/components/` | One file per section (Hero, MoveIn, MenuGrid/ProductCard, Bundles, HowItWorks, Footer, Header, OrderBar) |
| `src/styles/global.css` | Design tokens (colors, type scale, spacing), fonts, base styles |
| `src/lib/menu.mjs` | Loads `menu.json`, matches product photos, computes bundle savings |
| `src/assets/products/<id>.jpg` | Product photos, matched to the sheet's `id` column |
| `scripts/` | Sheet sync, image prep, font subsetting, OG image, QA tools |
| `docs/` | Handoff for Mia, photo brief, design rubric |

### Adding a product photo

Drop `<id>.jpg` (the item's `id` from the sheet, e.g. `caramel-cone-crunch.jpg`) into
`src/assets/products/` and push. Astro generates AVIF/WebP sizes automatically. Photos of at
least 1600px on the short edge look best.

## QA

Playwright + Chromium are used for checks (installed globally in CI).

```bash
npm run build
npm run qa:shots -- round-name /     # screenshots at 1440/1280/768/390/375 into qa/shots/
npm run qa:axe                       # axe-core, all pages, desktop + phone
npm run qa:keys                      # keyboard focus walk (visible, not under the sticky header)
npm run qa:lighthouse                # Lighthouse mobile + desktop, fails under 95
```

Last run: Lighthouse 96–100 in every category on mobile and desktop; axe 0 violations.
