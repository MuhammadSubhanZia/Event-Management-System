function formatDate(localDate) {
  if (!localDate) return 'Date to be announced';

  return new Date(`${localDate}T12:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EventCard({ event }) {
  const image =
    event.images?.find((item) => item.ratio === '16_9' && item.width >= 500)
      ?.url ?? event.images?.[0]?.url;

  const venue = event._embedded?.venues?.[0];
  const location = [venue?.city?.name, venue?.country?.name]
    .filter(Boolean)
    .join(', ');
  const category = event.classifications?.[0]?.segment?.name ?? 'Other';

  return (
    <article className="event-card">
      {image ? (
        <img className="event-image" src={image} alt="" loading="lazy" />
      ) : (
        <div className="event-image event-image-empty">No image available</div>
      )}

      <div className="event-content">
        <span className="event-category">{category}</span>
        <h3>{event.name}</h3>
        <p>
          {formatDate(event.dates?.start?.localDate)}
          {event.dates?.start?.localTime &&
            ` · ${event.dates.start.localTime.slice(0, 5)}`}
        </p>
        <p>{venue?.name || 'Venue to be announced'}</p>
        {location && <p>{location}</p>}
      </div>
    </article>
  );
}