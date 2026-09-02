/**
 * Generates a URL-safe slug from a string.
 * Example: "Terrazzo Classic Tile — 60x60cm" → "terrazzo-classic-tile-60x60cm"
 *
 * @param {string} text - The text to slugify
 * @returns {string} URL-safe slug
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s*[—–]\s*/g, '-')   // em/en dash → hyphen
    .replace(/[×x]/gi, 'x')         // normalize multiplication sign
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/[^\w\-]+/g, '')       // remove non-word chars (except hyphens)
    .replace(/\-\-+/g, '-')         // collapse multiple hyphens
    .replace(/^-+/, '')             // trim leading hyphens
    .replace(/-+$/, '');            // trim trailing hyphens
}
