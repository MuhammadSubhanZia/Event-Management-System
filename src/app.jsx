import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router';
import AuthPage from './pages/AuthPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventsPage from './pages/EventsPage';
import MyEventsPage from './pages/MyEventsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { clearCurrentUser } from './store/authSlice';

function navClass({ isActive }) {
  return isActive ? 'nav-active' : undefined;
}

function Home() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <section className="hero">
      <p className="eyebrow">Find something worth attending</p>
      <h1>Discover events. Make plans. Keep track.</h1>
      <p className="hero-description">
        Explore upcoming events and manage your registrations in one place.
      </p>
      <p className="welcome">
        Welcome, {currentUser ? currentUser.name : 'guest'}.
      </p>

      <div className="hero-actions">
        <Link className="hero-link" to="/events">Browse events</Link>
        {currentUser && (
          <Link className="secondary-link" to="/my-events">My Events</Link>
        )}
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="message">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

export default function App() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(clearCurrentUser());
    navigate('/');
  }

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <div className="container header-content">
          <Link className="brand" to="/">Event Management</Link>

          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/events" className={navClass}>Events</NavLink>

            {currentUser ? (
              <>
                <NavLink to="/my-events" className={navClass}>
                  My Events
                </NavLink>
                <span className="nav-user">Hi, {currentUser.name}</span>
                <button
                  className="nav-button"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>Login</NavLink>
                <NavLink to="/register" className={navClass}>Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-events" element={<MyEventsPage />} />
          </Route>
          <Route path="/login" element={<AuthPage key="login" mode="login" />} />
          <Route path="/register" element={<AuthPage key="register" mode="register" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">Event Management System</div>
      </footer>
    </div>
  );
}