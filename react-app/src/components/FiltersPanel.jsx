import './FiltersPanel.css';

/**
 * Filters panel: price range inputs, location, date range, search.
 *
 * Import:
 *   import FiltersPanel from './components/FiltersPanel';
 *
 * Usage:
 *   <FiltersPanel
 *     filters={filters}
 *     meta={meta}
 *     onFilterChange={handleFilterChange}
 *     onSearch={handleSearch}
 *     onReset={handleReset}
 *   />
 *
 * @param {Object}   props
 * @param {Object}   props.filters         - current filter state from App
 * @param {Object}   props.meta            - meta object (for min/max price, locations)
 * @param {Function} props.onFilterChange  - (key, value) => void
 * @param {Function} props.onSearch        - called on form submit
 * @param {Function} props.onReset         - resets all filters
 */
export default function FiltersPanel({ filters, meta, onFilterChange, onSearch, onReset }) {
  const minPrice = meta?.listings?.min_price ?? 0;
  const maxPrice = meta?.listings?.max_price ?? 1_000_000;
  const locations = meta?.listings?.locations ?? [];

  const handlePriceChange = (newMin, newMax) => {
    onFilterChange('minprice', newMin);
    onFilterChange('maxprice', newMax);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="filters-panel">
      <h3 className="filters-panel__title">Filters</h3>

      <form onSubmit={handleSubmit}>
        {/* ── Price range inputs ────────────────────────────– */}
        <div className="filters-panel__row">
          <div className="filters-panel__group">
            <label className="filters-panel__label" htmlFor="filter-price-min">
              Min Price
            </label>
            <input
              id="filter-price-min"
              type="number"
              className="filters-panel__input"
              placeholder={`Min: ${minPrice.toLocaleString()}`}
              value={filters.minprice ?? ''}
              onChange={(e) => onFilterChange('minprice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <div className="filters-panel__group">
            <label className="filters-panel__label" htmlFor="filter-price-max">
              Max Price
            </label>
            <input
              id="filter-price-max"
              type="number"
              className="filters-panel__input"
              placeholder={`Max: ${maxPrice.toLocaleString()}`}
              value={filters.maxprice ?? ''}
              onChange={(e) => onFilterChange('maxprice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="filters-panel__row">
          {/* ── Location dropdown ─────────────────────────── */}
          {locations.length > 0 && (
            <div className="filters-panel__group">
              <label className="filters-panel__label" htmlFor="filter-location">
                Location
              </label>
              <select
                id="filter-location"
                className="filters-panel__select"
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ── Date from ─────────────────────────────────── */}
          <div className="filters-panel__group">
            <label className="filters-panel__label" htmlFor="filter-date-from">
              From date
            </label>
            <input
              id="filter-date-from"
              type="date"
              className="filters-panel__input"
              value={filters.startdate}
              onChange={(e) => onFilterChange('startdate', e.target.value)}
            />
          </div>

          {/* ── Date to ───────────────────────────────────── */}
          <div className="filters-panel__group">
            <label className="filters-panel__label" htmlFor="filter-date-to">
              To date
            </label>
            <input
              id="filter-date-to"
              type="date"
              className="filters-panel__input"
              value={filters.enddate}
              onChange={(e) => onFilterChange('enddate', e.target.value)}
            />
          </div>
        </div>

        {/* ── Search + actions ──────────────────────────────── */}
        <div className="filters-panel__search-row">
          <input
            type="text"
            className="filters-panel__input filters-panel__input--search"
            placeholder="Search titles and locations…"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          <div className="filters-panel__actions">
            <button type="submit" className="filters-panel__btn filters-panel__btn--search">
              Search
            </button>
            <button
              type="button"
              className="filters-panel__btn filters-panel__btn--reset"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
