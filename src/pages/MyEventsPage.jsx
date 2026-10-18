import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { cancelRegistration } from '../store/registrationsSlice';
import { isEventCompleted } from '../utils/eventDate';
const EMPTY_REGISTRATIONS = [];

function formatDate(localDate) {
  if (!localDate) return 'Date to be announced';

  return new Date(`${localDate}T12:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function eventDateValue(registration) {
  return registration.dateTime || registration.localDate || '9999-12-31';
}

function RegistrationCard({ registration, completed, onCancel }) {
  return (
    <article className="my-event-card">
      {registration.image ? (
        <img className="my-event-image" src={registration.image} alt="" />
      ) : (
        <div className="my-event-image my-event-image-empty">
          No image available
        </div>
      )}

      <div className="my-event-content">
        <span className="event-category">
          {registration.category || 'Event'}
        </span>
        <h3>{registration.name}</h3>

        <p>
          {formatDate(registration.localDate)}
          {registration.localTime && ` · ${registration.localTime.slice(0, 5)}`}
        </p>
        <p>{registration.venue}</p>
        {registration.location && <p>{registration.location}</p>}

        <div className="my-event-actions">
          <Link to={`/events/${encodeURIComponent(registration.eventId)}`}>
            View details
          </Link>

          {completed ? (
            <span className="completed-label">Completed</span>
          ) : (
            <button
              className="cancel-button"
              type="button"
              onClick={() => onCancel(registration)}
            >
              Cancel registration
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyEventsPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const registrations = useSelector(
    (state) =>
    state.registrations.byUser[currentUser?.id] || EMPTY_REGISTRATIONS
);
  const [message, setMessage] = useState('');

  const upcoming = registrations
    .filter((registration) => !isEventCompleted(registration))
    .sort((a, b) => eventDateValue(a).localeCompare(eventDateValue(b)));

  const completed = registrations
    .filter(isEventCompleted)
    .sort((a, b) => eventDateValue(b).localeCompare(eventDateValue(a)));

  function handleCancel(registration) {
    dispatch(cancelRegistration({
      userId: currentUser.id,
      eventId: registration.eventId,
    }));
    setMessage(`Registration cancelled for ${registration.name}.`);
  }

  return (
    <div className="my-events-page">
      <div className="page-heading">
        <p className="eyebrow">Your plans</p>
        <h1>My Events</h1>
        <p>Events you have registered for in this app.</p>
      </div>

      {message && <p className="registration-message" role="status">{message}</p>}

      {registrations.length === 0 ? (
        <div className="my-events-empty">
          <p>You have no registered events yet.</p>
          <Link className="hero-link" to="/events">Explore events</Link>
        </div>
      ) : (
        <>
          <section className="my-events-section">
            <h2>Upcoming ({upcoming.length})</h2>
            {upcoming.length > 0 ? (
              <div className="my-events-grid">
                {upcoming.map((registration) => (
                  <RegistrationCard
                    key={registration.eventId}
                    registration={registration}
                    completed={false}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <p>No upcoming registered events.</p>
            )}
          </section>

          <section className="my-events-section">
            <h2>Completed ({completed.length})</h2>
            {completed.length > 0 ? (
              <div className="my-events-grid">
                {completed.map((registration) => (
                  <RegistrationCard
                    key={registration.eventId}
                    registration={registration}
                    completed
                  />
                ))}
              </div>
            ) : (
              <p>No completed events yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}