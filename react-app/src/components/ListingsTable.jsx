import { formatPrice, formatDate } from '../utils/format';
import './ListingsTable.css';

/**
 * Sortable listings table.
 *
 * Import:
 *   import ListingsTable from './components/ListingsTable';
 *
 * Usage:
 *   <ListingsTable
 *     listings={listings.listings}
 *     sortField={sortField}
 *     sortDir={sortDir}
 *     onSort={handleSort}
 *   />
 *
 * @param {Object}   props
 * @param {Array}    props.listings   - array of listing objects
 * @param {string}   props.sortField  - currently sorted field key
 * @param {string}   props.sortDir    - 'asc' | 'desc'
 * @param {Function} props.onSort     - called with the field key when a header is clicked
 */
export default function ListingsTable({ listings, sortField, sortDir, onSort }) {
  if (!listings || listings.length === 0) {
    return (
      <div className="listings-table__empty">
        No listings found. Try adjusting your filters.
      </div>
    );
  }

  const columns = [
    { key: 'title',    label: 'Title',       sortable: true  },
    { key: 'location', label: 'Location',    sortable: true  },
    { key: 'price',    label: 'Price',       sortable: true  },
    { key: 'date',     label: 'Date Posted', sortable: true  },
    { key: 'link',     label: 'Link',        sortable: false },
  ];

  return (
    <div className="listings-table__wrapper">
      <table className="listings-table">
        <thead>
          <tr>
            {columns.map(({ key, label, sortable }) => (
              <th
                key={key}
                className={[
                  sortable ? 'listings-table__th--sortable' : '',
                  sortField === key ? `listings-table__th--sorted listings-table__th--${sortDir}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={sortable ? () => onSort(key) : undefined}
                aria-sort={
                  sortField === key
                    ? sortDir === 'asc' ? 'ascending' : 'descending'
                    : sortable ? 'none' : undefined
                }
              >
                <span className="listings-table__th-inner">
                  {label}
                  {sortable && (
                    <span className="listings-table__sort-icon" aria-hidden="true">
                      {sortField === key
                        ? sortDir === 'asc' ? ' ↑' : ' ↓'
                        : ' ↕'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listings.map((listing, idx) => (
            <tr key={listing.link || idx} className="listings-table__row">
              <td className="listings-table__td listings-table__td--title">
                {listing.title || '—'}
              </td>
              <td className="listings-table__td listings-table__td--location">
                {listing.location || '—'}
              </td>
              <td className="listings-table__td listings-table__td--price">
                {listing.price != null ? formatPrice(listing.price) : '—'}
              </td>
              <td className="listings-table__td listings-table__td--date">
                {formatDate(listing.date)}
              </td>
              <td className="listings-table__td listings-table__td--link">
                {listing.link ? (
                  <a
                    href={listing.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="listings-table__link"
                  >
                    View →
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
