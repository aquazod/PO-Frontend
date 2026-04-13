import { getPageNumbers } from '../utils/pagination';
import './Pagination.css';

/**
 * Pagination component.
 *
 * Import:
 *   import Pagination from './components/Pagination';
 *
 * Usage:
 *   <Pagination
 *     currentPage={filters.pg}
 *     totalPages={listings.total_pages}
 *     onPageChange={(page) => handleFilterChange('pg', page)}
 *   />
 *
 * @param {Object}   props
 * @param {number}   props.currentPage   - active page (1-based)
 * @param {number}   props.totalPages    - total number of pages
 * @param {Function} props.onPageChange  - called with the new page number
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Listings pagination">
      {/* First page button — shows page number 1, not the word "First" */}
      <button
        className="pagination__btn pagination__btn--edge"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="Go to first page"
        title="First page"
      >
        1
      </button>

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        ‹
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={page}
            className={`pagination__btn pagination__btn--page${
              page === currentPage ? ' pagination__btn--active' : ''
            }`}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        ›
      </button>

      {/* Last page button — shows the actual last page number */}
      <button
        className="pagination__btn pagination__btn--edge"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Go to last page"
        title="Last page"
      >
        {totalPages}
      </button>
    </nav>
  );
}
