import data from '../data/menu.json';

// Product photos live in src/assets/products/<id>.jpg (or the sheet's "image" column).
const photos = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

function photoFor(item) {
  // A Drive link in the sheet is downloaded by the sync as <id>.jpg.
  const name = /^https?:\/\//i.test(item.image) ? '' : item.image;
  const wanted = (name || item.id).toLowerCase().replace(/\.(jpe?g|png|webp)$/, '');
  const hit = Object.entries(photos).find(([path]) => path.split('/').pop().replace(/\.\w+$/, '').toLowerCase() === wanted);
  return hit ? hit[1] : null;
}

const altFor = {
  'chocolate-chip': 'A plate piled high with chocolate chunk cookies',
  smores: "S'mores cookies with melted marshmallow cooling on a wire rack",
};

export const settings = data.settings;

// The hero and Move-In show these photos whole, so the menu cards use a tighter,
// different crop of the same shot instead of repeating it.
const cardCrop = {
  'chocolate-chip': { x: '30%', y: '72%', zoom: 1.15 },
  smores: { x: '80%', y: '92%', zoom: 1.15 },
};

// Warm cream tints for the typographic placeholder tiles, one per item.
const tileTints = ['#f4e8c8', '#efe3d3', '#f2e2dc', '#ece4d0', '#f1e6d6', '#eee2cb'];

export const menu = data.menu.map((item, i) => ({
  ...item,
  photo: photoFor(item),
  alt: altFor[item.id] || `${item.name} from Good Neighbor Bakehouse`,
  crop: cardCrop[item.id] || null,
  tint: tileTints[i % tileTints.length],
}));

export const bundles = data.bundles;

export const moveIn = settings.movein_item_id ? menu.find((m) => m.id === settings.movein_item_id) || null : null;

// Lowest possible price of a bundle's contents bought separately. Used for an
// honest "saves at least $X" line; returns 0 when the bundle saves nothing.
const cheapest = (category) => Math.min(...menu.filter((m) => m.category === category && m.available).map((m) => m.price));
// How many cookies, brownies and bite packs a bundle's "contents" text describes,
// e.g. "2 cookies, 2 brownies and two 4-piece bite packs".
function bundleCounts(contents) {
  const text = contents.toLowerCase();
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const num = (re) => {
    const m = text.match(re);
    return m ? Number(m[1]) || words[m[1]] || 0 : 0;
  };
  const n = '(\\d+|one|two|three|four|five|six)\\s+';
  return {
    cookies: num(new RegExp(n + 'cookies?')),
    brownies: num(new RegExp(n + 'brownies?')),
    bitePacks: num(new RegExp(n + '(?:\\d-piece\\s+)?bite')),
  };
}

export function minimumSavings(bundle) {
  const { cookies, brownies, bitePacks } = bundleCounts(bundle.contents);
  let separately = 0;
  if (cookies) separately += cookies * cheapest('cookie');
  if (brownies) separately += brownies * cheapest('brownie');
  if (bitePacks) separately += bitePacks * cheapest('bites');
  const saving = Math.round((separately - bundle.price) * 100) / 100;
  return Number.isFinite(saving) && saving > 0 ? saving : 0;
}

// Price per cookie for cookie-only bundles ("6 cookies"); 0 for mixed bundles.
export function pricePerCookie(bundle) {
  const { cookies, brownies, bitePacks } = bundleCounts(bundle.contents);
  return cookies && !brownies && !bitePacks ? Math.round((bundle.price / cookies) * 100) / 100 : 0;
}

// Lowest single-item price on the menu this week ("from $3"). Sold-out items don't
// count; falls back to the whole menu if everything is sold out.
const lowest = (items) => (items.length ? Math.min(...items.map((m) => m.price)) : null);
const singles = menu.filter((m) => m.unit === 'each');
export const fromPrice = lowest(singles.filter((m) => m.available)) ?? lowest(singles) ?? lowest(menu);
export const cookiesFromPrice = lowest(singles.filter((m) => m.category === 'cookie' && m.available));

export const orderUrl = settings.order_form_url;
export const venmoUrl = `https://venmo.com/u/${settings.venmo_handle}`;
export const instagramUrl = `https://www.instagram.com/${settings.instagram}/`;
export const emailUrl = `mailto:${settings.email}`;
export const pickupKnown = Boolean(settings.pickup_location || settings.pickup_times);

// Paid drop-off, alongside campus pickup.
export const dropoffAvailable = settings.dropoff_available !== false;
const fee = settings.dropoff_fee ? (/^\d/.test(settings.dropoff_fee) ? `$${settings.dropoff_fee}` : settings.dropoff_fee) : '';
export const dropoffText =
  settings.dropoff_notes ||
  `Prefer drop-off? We can bring your order to you for ${fee ? `a ${fee} fee` : 'a small extra fee'}. Just ask when you order.`;
export const fulfillmentShort = dropoffAvailable ? 'Pickup or drop-off' : 'Campus pickup';

// One place for the pickup sentence: "Spot · Times", or the "we'll email you" fallback.
export const pickupText = pickupKnown
  ? [settings.pickup_location, settings.pickup_times].filter(Boolean).join(' · ')
  : settings.pickup_notes || "We'll confirm your exact pickup spot and time in your confirmation email.";
