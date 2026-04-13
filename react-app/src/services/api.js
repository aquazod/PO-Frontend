const API_BASE = window.LISTINGS_API_URL || 'http://localhost:3000/api';

const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

export const getMeta = async () => {
  const response = await fetch(`${API_BASE}/meta`, fetchOptions);
  if (!response.ok) throw new Error('Failed to fetch meta');
  return response.json();
};

export const getListings = async (params) => {
  const query = new URLSearchParams();
  
  if (params.minprice !== undefined) query.append('minprice', params.minprice);
  if (params.maxprice !== undefined) query.append('maxprice', params.maxprice);
  if (params.startdate) query.append('startdate', params.startdate);
  if (params.enddate) query.append('enddate', params.enddate);
  if (params.location) query.append('location', params.location);
  if (params.search) query.append('search', params.search);
  if (params.per_page) query.append('per_page', params.per_page);
  if (params.pg) query.append('pg', params.pg);

  const response = await fetch(`${API_BASE}/listings?${query}`, fetchOptions);
  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
};

export const triggerScrape = async () => {
  const response = await fetch(`${API_BASE}/scrape`, { 
    method: 'POST',
    ...fetchOptions,
  });
  if (!response.ok) throw new Error('Failed to trigger scrape');
  return response.json();
};
