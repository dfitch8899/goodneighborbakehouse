// "$3", "$3.75", "$19.50": cents only when they aren't zero.
export function formatPrice(n) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

// Prefix a site-relative path with the deploy base ("/goodneighborbakehouse/").
export function withBase(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + String(path).replace(/^\//, '');
}
