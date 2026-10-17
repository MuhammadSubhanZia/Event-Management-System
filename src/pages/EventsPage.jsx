import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventCard from '../components/EventCard';
import { PAGE_SIZE } from '../services/ticketmaster';
import { changePage, fetchEvents, updateFilters } from '../store/eventsSlice';

const categories = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film'];

export default function EventsPage() {
  const dispatch = useDispatch();
  const { items, status, error, filters, page, totalPages, totalElements } =
    useSelector((state) => state.events);

  const [keyword, setKeyword] = useState(filters.keyword);
  const [city, setCity] = useState(filters.city);

  useEffect(() => {
    const request = dispatch(fetchEvents({ ...filters, page }));
    return () => request.abort();
  }, [dispatch, filters.keyword, filters.city, filters.category, page]);

  function applyFilters(category = filters.category) {
    dispatch(updateFilters({
      keyword: keyword.trim(),
      city: city.trim(),
      category,
    }));
  }

  function handleSearch(event) {
    event.preventDefault();
    applyFilters();
  }

  function clearFilters() {
    setKeyword('');
    setCity('');
    dispatch(updateFilters({ keyword: '', city: '', category: 'All' }));
  }

  const hasNextPage =
    page + 1 < totalPages && (page + 1) * PAGE_SIZE < 1000;

  return (
    <section className="events-page">
      <div className="page-heading">
        <p className="eyebrow">Explore</p>
        <h1>Upcoming events</h1>
        <p>Search for an event or browse by category.</p>
      </div>

      <form className="event-search" onSubmit={handleSearch}>
        <div className="search-field">
          <label htmlFor="event-keyword">Event or artist</label>
          <input
            id="event-keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search events"
          />
        </div>

        <div className="search-field">
          <label htmlFor="event-city">City</label>
          <input
            id="event-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Any city"
          />
        </div>

        <button className="search-button" type="submit">Search</button>
        <button className="clear-button" type="button" onClick={clearFilters}>
          Clear
        </button>
      </form>

      <div className="category-list" aria-label="Event categories">
        {categories.map((category) => (
          <button
            key={category}
            className={filters.category === category ? 'category active' : 'category'}
            type="button"
            aria-pressed={filters.category === category}
            onClick={() => applyFilters(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <p className="result-message" role="status">Loading events...</p>
      )}

      {status === 'failed' && (
        <div className="result-message" role="alert">
          <p>{error}</p>
          <button
            className="retry-button"
            type="button"
            onClick={() => dispatch(fetchEvents({ ...filters, page }))}
          >
            Try again
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          {items.length > 0 ? (
            <>
              <p className="result-count">
                {totalElements.toLocaleString()} events found
              </p>
              <div className="event-grid">
                {items.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              <div className="pagination">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => dispatch(changePage(page - 1))}
                >
                  Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button
                  type="button"
                  disabled={!hasNextPage}
                  onClick={() => dispatch(changePage(page + 1))}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="result-message">
              No upcoming events match these filters. Try another search.
            </p>
          )}
        </>
      )}
    </section>
  );
}