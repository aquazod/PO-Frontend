/**
 * Formats a number as a GBP price string.
 * Returns '—' for null/undefined values.
 *
 * @param {number|null|undefined} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '—';
  return '£' + Number(price).toLocaleString('en-GB');
}

/**
 * Formats an ISO date string into a human-readable date.
 * Returns '—' for null/undefined/invalid values.
 *
 * @param {string|null|undefined} iso
 * @returns {string}
 */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a duration in seconds into a human-readable string.
 *
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}
