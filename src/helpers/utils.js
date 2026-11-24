/** Number of meters in one mile. */
export const METERS_PER_MILE = 1609

/**
 * Converts a distance in meters to the nearest whole mile.
 *
 * @param {number} meters - Distance in meters.
 * @returns {number} Distance rounded to the nearest mile.
 */
export function metersToMiles (meters) {
  if (meters == null || Number.isNaN(Number(meters))) return 0
  return Math.round(Number(meters) / METERS_PER_MILE)
}

/**
 * Builds an object lookup dictionary from an array of items keyed by `keyProp`.
 *
 * @template T
 * @param {T[]} [items=[]] - Array of items to index.
 * @param {string} [keyProp='id'] - Property name to use as the dictionary key.
 * @returns {Object.<string, T>} Lookup map of items by key.
 */
export function createLookup (items = [], keyProp = 'id') {
  const lookup = {}
  if (!Array.isArray(items)) return lookup
  for (const item of items) {
    if (item && item[keyProp] != null) {
      lookup[item[keyProp]] = item
    }
  }
  return lookup
}

/**
 * Converts a 3- or 6-digit hex colour string to an `rgba(...)` CSS string.
 * Falls back to forest green (`#3E6B2F`) if the input hex is invalid.
 *
 * @param {string} hex - Hex colour string (e.g. `#3E6B2F` or `#fff`).
 * @param {number} [alpha=1] - Opacity value between 0 and 1.
 * @returns {string} CSS `rgba(r, g, b, alpha)` string.
 */
export function hextoRGBA (hex, alpha = 1) {
  const safeHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex) ? hex : '#3E6B2F'
  let chars = safeHex.slice(1).split('')
  if (chars.length === 3) {
    chars = [chars[0], chars[0], chars[1], chars[1], chars[2], chars[2]]
  }
  const num = Number('0x' + chars.join(''))
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`
}
