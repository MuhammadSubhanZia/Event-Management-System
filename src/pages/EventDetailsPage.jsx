import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getEventById } from '../services/ticketmaster';

function formatDate(localDate) {
  if (!localDate) return 'Date to be announced';

  return new Date(`${localDate}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setStatus('loading');
    setError('');
    setEvent(null);

    getEventById(eventId, controller.signal)
      .then((result) => {
        setEvent(result);
        setStatus('succeeded');
      })
      .catch((problem) => {
        if (problem.name !== 'AbortError') {
          setError(problem.message || 'Could not load this event.');
          setStatus('failed');
        }
      });

    return () => controller.abort();
  }, [eventId, retryCount]);

  if (status === 'loading') {
    return <p className="details-message" role="status">Loading event details...</p>;
  }

  if (status === 'failed') {
    return (
      <section className="details-message" role="alert">
        <p>{error}</p>
        <button
          className="retry-button"
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Try again
        </button>
        <p><Link to="/events">Back to events</Link></p>
      </section>
    );
  }

  const image =
    event.images?.find((item) => item.ratio === '16_9' && item.width >= 800)
      ?.url ?? event.images?.[0]?.url;

  const venue = event._embedded?.venues?.[0];
  const location = [
    venue?.address?.line1,
    venue?.city?.name,
    venue?.state?.name,
    venue?.country?.name,
  ].filter(Boolean).join(', ');

  const classification =
    event.classifications?.find((item) => item.primary) ??
    event.classifications?.[0];

  const category = classification?.segment?.name || 'Not specified';
  const genre = classification?.genre?.name;
  const price = event.priceRanges?.[0];

  return (
    <article className="event-details">
      <Link className="details-back" to="/events">← Back to events</Link>

      {image ? (
        <img className="details-image" src={image} alt="" />
      ) : (
        <div className="details-image details-image-empty">
          No image available
        </div>
      )}

      <div className="details-body">
        <p className="eyebrow">{category}</p>
        <h1>{event.name}</h1>

        <div className="details-grid">
          <section className="details-panel">
            <h2>When</h2>
            <p>{formatDate(event.dates?.start?.localDate)}</p>
            <p>
              {event.dates?.start?.localTime
                ? `Local time: ${event.dates.start.localTime.slice(0, 5)}`
                : 'Time to be announced'}
            </p>
          </section>

          <section className="details-panel">
            <h2>Where</h2>
            <p>{venue?.name || 'Venue to be announced'}</p>
            {location && <p>{location}</p>}
          </section>

          <section className="details-panel">
            <h2>About the event</h2>
            <p>Category: {category}</p>
            {genre && <p>Type: {genre}</p>}
            {event.dates?.status?.code && (
              <p>Status: {event.dates.status.code}</p>
            )}
          </section>
        </div>

        {price?.min != null && (
          <p className="details-price">
            Listed price: {price.currency ? `${price.currency} ` : ''}
            {price.min}
            {price.max != null && price.max !== price.min
              ? `–${price.max}`
              : ''}
          </p>
        )}

        {event.info && (
          <section className="details-text">
            <h2>More information</h2>
            <p>{event.info}</p>
          </section>
        )}

        {event.pleaseNote && (
          <section className="details-text">
            <h2>Please note</h2>
            <p>{event.pleaseNote}</p>
          </section>
        )}

        {event.url && (
          <a
            className="details-external"
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Ticketmaster
          </a>
        )}
      </div>
    </article>
  );
}