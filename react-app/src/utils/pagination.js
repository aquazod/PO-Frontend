/**
 * Generates an array of page numbers and ellipsis markers for pagination UI.
 *
 * Examples:
 *   getPageNumbers(1, 10)  → [1, 2, 3, '...', 10]
 *   getPageNumbers(5, 10)  → [1, '...', 4, 5, 6, '...', 10]
 *   getPageNumbers(10, 10) → [1, '...', 8, 9, 10]
 *   getPageNumbers(3, 5)   → [1, 2, 3, 4, 5]
 *
 * @param {number} current  - current page (1-based)
 * @param {number} total    - total number of pages
 * @returns {(number|string)[]}
 */
export function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  for (let p = rangeStart; p <= rangeEnd; p++) {
    pages.push(p);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}
