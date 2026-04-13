import { useState, useEffect } from 'react';
import { getMeta, getListings, triggerScrape } from './services/api';

import FiltersPanel from './components/FiltersPanel';
import ListingsTable from './components/ListingsTable';
import Pagination from './components/Pagination';

import { formatDuration } from './utils/format';

import './App.css';

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function App() {
  const [meta, setMeta]       = useState(null);
  const [listings, setListings] = useState(null);

  const [filters, setFilters] = useState({
    minprice:  undefined,
    maxprice:  undefined,
    startdate: '',
    enddate:   '',
    location:  '',
    search:    '',
    per_page:  10,
    pg:        1,
  });

  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir]     = useState('asc');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [updating, setUpdating]   = useState(false);

  useEffect(() => { loadMeta(); }, []);

  useEffect(() => {
    if (meta) loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortField, sortDir]);

  const loadMeta = async () => {
    try {
      setError('');
      const data = await getMeta();
      setMeta(data);
      setFilters(prev => ({
        ...prev,
        minprice: data.listings.min_price,
        maxprice: data.listings.max_price,
      }));
    } catch (err) {
      setError('Failed to load metadata: ' + err.message);
    }
  };

  const loadListings = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await getListings(filters);

      let sorted = [...(data.listings ?? [])];
      if (sortField) {
        sorted.sort((a, b) => {
          let aVal = a[sortField];
          let bVal = b[sortField];
          if (sortField === 'price') { aVal = parseFloat(aVal); bVal = parseFloat(bVal); }
          else if (sortField === 'date') { aVal = new Date(aVal); bVal = new Date(bVal); }
          if (aVal == null) return 1;
          if (bVal == null) return -1;
          if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
          return 0;
        });
      }

      setListings({ ...data, listings: sorted });
    } catch (err) {
      setError('Failed to load listings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      pg: key === 'pg' ? value : 1,
    }));
  };

  const handlePerPageChange = (e) => {
    setFilters(prev => ({
      ...prev,
      per_page: Number(e.target.value),
      pg: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      minprice:  meta?.listings.min_price,
      maxprice:  meta?.listings.max_price,
      startdate: '',
      enddate:   '',
      location:  '',
      search:    '',
      per_page:  10,
      pg:        1,
    });
    setSortField(null);
    setSortDir('asc');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handlePageChange = (newPage) => {
    handleFilterChange('pg', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

//   const handleUpdateListings = async () => {
//     try {
//       setSuccess(''); setError(''); setUpdating(true);
//       await triggerScrape();
//       setSuccess('Scraping started. Listings will be updated shortly.');
//       setTimeout(() => loadMeta(), 2000);
//     } catch (err) {
//       setError('Failed to trigger scrape: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

    const handleUpdateListings = () => {
    setSuccess(''); 
    setError(''); 
    setUpdating(true);
    
    // trigger and forget, don't await
    triggerScrape().catch(err => {
        setError('Failed to trigger scrape: ' + err.message);
    });
    
    // Immediately show success and reload meta
    setSuccess('Scraping started. Listings will be updated shortly.');
    setTimeout(() => loadMeta(), 2000);
    setTimeout(() => setUpdating(false), 1000);
    };

  if (!meta) return <div className="app-loading">Loading…</div>;

  const currentPage = filters.pg ?? 1;
  const totalPages  = listings?.total_pages ?? 1;
  const total       = listings?.total ?? 0;
  const showing     = listings?.listings?.length ?? 0;

  // Human-readable "last updated" relative hint
  const lastUpdated     = meta.listings.last_updated ? new Date(meta.listings.last_updated) : null;
  const lastUpdatedFull = lastUpdated ? lastUpdated.toLocaleString('en-GB') : '—';
  const lastUpdatedDate = lastUpdated ? lastUpdated.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const lastUpdatedTime = lastUpdated ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="app">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header__top">
          <h1 className="app-header__title">Property Listings</h1>
          <button
            className="app-header__update-btn"
            onClick={handleUpdateListings}
            disabled={updating}
          >
            {updating ? 'Updating…' : '↻ Update Listings'}
          </button>
        </div>

        {/* ── Meta cards ────────────────────────────────────── */}
        <div className="app-meta">
          <div className="app-meta__card app-meta__card--properties">
            <span className="app-meta__icon">🏠</span>
            <div className="app-meta__body">
              <span className="app-meta__label">Total properties</span>
              <span className="app-meta__value">
                {meta.listings.total_properties.toLocaleString()}
              </span>
              <span className="app-meta__sub">across all pages</span>
            </div>
          </div>

          <div className="app-meta__card app-meta__card--updated">
            <span className="app-meta__icon">🕐</span>
            <div className="app-meta__body">
              <span className="app-meta__label">Last updated</span>
              <span className="app-meta__value">{lastUpdatedDate}</span>
              <span className="app-meta__sub">{lastUpdatedTime}</span>
            </div>
          </div>

          <div className="app-meta__card app-meta__card--duration">
            <span className="app-meta__icon">⚡</span>
            <div className="app-meta__body">
              <span className="app-meta__label">Scrape duration</span>
              <span className="app-meta__value">
                {formatDuration(meta.listings.scraping_duration)}
              </span>
              <span className="app-meta__sub">last run time</span>
            </div>
          </div>

          <div className="app-meta__card app-meta__card--pages">
            <span className="app-meta__icon">📄</span>
            <div className="app-meta__body">
              <span className="app-meta__label">Pages scraped</span>
              <span className="app-meta__value">
                {Math.ceil(meta.listings.total_properties / 10).toLocaleString()}
              </span>
              <span className="app-meta__sub">10 properties / page</span>
            </div>
          </div>
        </div>

        {meta.listings.logs?.error_logs?.length > 0 && (
          <div className="app-notice app-notice--error">
            <strong>Scraper errors:</strong>{' '}
            {meta.listings.logs.error_logs.join(', ')}
          </div>
        )}
        {meta.listings.logs?.scraping_summary && (
          <div className="app-notice app-notice--info">
            {meta.listings.logs.scraping_summary}
          </div>
        )}
      </header>

      {error   && <div className="app-alert app-alert--error">{error}</div>}
      {success && <div className="app-alert app-alert--success">{success}</div>}

      {/* ── Filters ─────────────────────────────────────────── */}
      <FiltersPanel
        filters={filters}
        meta={meta}
        onFilterChange={handleFilterChange}
        onSearch={loadListings}
        onReset={handleReset}
      />

      {/* ── Results bar ─────────────────────────────────────── */}
      {!loading && listings?.listings && (
        <div className="app-results-bar">
          <p className="app-summary">
            Showing <strong>{showing}</strong> of <strong>{total.toLocaleString()}</strong> listings
            {listings.show_pagination && ` — page ${currentPage} of ${totalPages}`}
          </p>

          <label className="app-per-page">
            Rows per page
            <select
              className="app-per-page__select"
              value={filters.per_page}
              onChange={handlePerPageChange}
              aria-label="Rows per page"
            >
              {PER_PAGE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────── */}
      {loading ? (
        <div className="app-loading">Loading listings…</div>
      ) : (
        <ListingsTable
          listings={listings?.listings ?? []}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
        />
      )}

      {/* ── Pagination ──────────────────────────────────────── */}
      {!loading && listings?.show_pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

    </div>
  );
}