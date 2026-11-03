import data from '../data/menu.json';

// Product photos live in src/assets/products/<id>.jpg (or the sheet's "image" column).
const photos = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

function photoFor(item) {
  const wanted = (item.image || item.id).toLowerCase().replace(/\.(jpe?g|png|webp)$/, '');
  const hit = Object.entries(photos).find(([path]) => path.split('/').pop().replace(/\.\w+$/, '').toLowerCase() === wanted);
  return hit ? hit[1] : null;
}

const altFor = {
  'chocolate-chip': 'A plate piled high with chocolate chunk cookies',
  smores: "S'mores cookies with melted marshmallow cooling on a wire rack",
};

export const settings = data.settings;
export const updatedAt = data.updatedAt;

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
export function minimumSavings(bundle) {
  const text = bundle.contents.toLowerCase();
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const num = (re) => {
    const m = text.match(re);
    return m ? Number(m[1]) || words[m[1]] || 0 : 0;
  };
  const n = '(\\d+|one|two|three|four|five|six)\\s+';
  const cookies = num(new RegExp(n + 'cookies?'));
  const brownies = num(new RegExp(n + 'brownies?'));
  const bitePacks = num(new RegExp(n + '(?:\\d-piece\\s+)?bite'));
  let separately = 0;
  if (cookies) separately += cookies * cheapest('cookie');
  if (brownies) separately += brownies * cheapest('brownie');
  if (bitePacks) separately += bitePacks * cheapest('bites');
  const saving = Math.round((separately - bundle.price) * 100) / 100;
  return Number.isFinite(saving) && saving > 0 ? saving : 0;
}

export const orderUrl = settings.order_form_url;
export const venmoUrl = `https://venmo.com/u/${settings.venmo_handle}`;
export const instagramUrl = `https://www.instagram.com/${settings.instagram}/`;
export const emailUrl = `mailto:${settings.email}`;
export const pickupKnown = Boolean(settings.pickup_location || settings.pickup_times);
