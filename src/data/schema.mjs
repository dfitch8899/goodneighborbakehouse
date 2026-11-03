// Shared contract between the Google Sheet (via scripts/sync-sheet.mjs) and the site.
import { z } from 'zod';

const bool = z.preprocess((v) => {
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '').trim().toLowerCase();
  return ['true', 'yes', 'y', '1', 'x'].includes(s);
}, z.boolean());

const price = z.preprocess(
  (v) => (typeof v === 'number' ? v : Number(String(v).replace(/[$,\s]/g, ''))),
  z.number().positive().max(500),
);

const text = (max) => z.preprocess((v) => String(v ?? '').trim(), z.string().max(max));
const slug = z.preprocess((v) => String(v ?? '').trim().toLowerCase(), z.string().regex(/^[a-z0-9][a-z0-9-]*$/));
const sort = z.preprocess((v) => (v === '' || v == null ? 999 : Number(v)), z.number().finite());

export const MenuItem = z.object({
  id: slug,
  name: text(60).pipe(z.string().min(1)),
  price,
  unit: z.preprocess((v) => String(v ?? '').trim().toLowerCase() || 'each', z.enum(['each', '4-pack'])),
  description: text(140),
  category: z.preprocess((v) => String(v ?? '').trim().toLowerCase(), z.enum(['cookie', 'brownie', 'bites'])),
  tag: z.preprocess((v) => String(v ?? '').trim().toLowerCase(), z.enum(['', 'signature', 'limited', 'new'])),
  available: bool,
  sort,
  allergens: text(200),
  image: text(80),
});

export const Bundle = z.object({
  id: slug,
  name: text(60).pipe(z.string().min(1)),
  price,
  contents: text(140),
  badge: text(24),
  available: bool,
  sort,
});

export const Settings = z.object({
  movein_item_id: text(60),
  movein_headline: text(90),
  movein_blurb: text(320),
  movein_until: text(40),
  announcement: text(120),
  announcement_url: text(300),
  ordering_open: bool,
  orders_closed_message: text(240),
  lead_time: text(120),
  pickup_location: text(120),
  pickup_times: text(120),
  pickup_notes: text(240),
  order_form_url: z.string().url(),
  venmo_handle: text(40).pipe(z.string().regex(/^[A-Za-z0-9_-]+$/)),
  allergen_statement: text(400),
  instagram: text(40),
  email: z.string().email(),
});

export const MenuData = z
  .object({
    updatedAt: z.string(),
    source: z.string(),
    menu: z.array(MenuItem).min(1),
    bundles: z.array(Bundle),
    settings: Settings,
  })
  .superRefine((d, ctx) => {
    const ids = new Set();
    for (const m of d.menu) {
      if (ids.has(m.id)) ctx.addIssue({ code: 'custom', message: `Duplicate menu id "${m.id}"` });
      ids.add(m.id);
    }
    if (d.settings.movein_item_id && !ids.has(d.settings.movein_item_id)) {
      ctx.addIssue({ code: 'custom', message: `movein_item_id "${d.settings.movein_item_id}" is not an id on the menu tab` });
    }
  });
