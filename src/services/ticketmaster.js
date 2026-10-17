const EVENTS_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
export const PAGE_SIZE = 12;

export async function searchEvents({ keyword, city, category, page }, signal) {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY?.trim();

  if (!apiKey || apiKey === 'replace_with_your_api_key') {
    throw new Error('Add your Ticketmaster API key to the .env file.');
  }

  const startDateTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const params = new URLSearchParams({
    apikey: apiKey,
    startDateTime,
    sort: 'date,asc',
    size: String(PAGE_SIZE),
    page: String(page),
  });

  if (keyword) params.set('keyword', keyword);
  if (city) params.set('city', city);
  if (category !== 'All') params.set('segmentName', category);

  const response = await fetch(`${EVENTS_URL}?${params}`, { signal });

  if (response.status === 401) {
    throw new Error('Ticketmaster rejected the API key. Check your .env file.');
  }

  if (response.status === 429) {
    throw new Error('Too many requests. Wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Could not load events (HTTP ${response.status}).`);
  }

  const data = await response.json();

  return {
    items: data._embedded?.events ?? [],
    totalPages: data.page?.totalPages ?? 0,
    totalElements: data.page?.totalElements ?? 0,
  };
}

export async function getEventById(eventId, signal) {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY?.trim();

  if (!apiKey || apiKey === 'replace_with_your_api_key') {
    throw new Error('Add your Ticketmaster API key to the .env file.');
  }

  const url = new URL(
    `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(eventId)}.json`
  );
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url, { signal });

  if (response.status === 404) {
    throw new Error('This event could not be found.');
  }

  if (response.status === 401) {
    throw new Error('Ticketmaster rejected the API key.');
  }

  if (response.status === 429) {
    throw new Error('Too many requests. Wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Could not load event details (HTTP ${response.status}).`);
  }

  return response.json();
}