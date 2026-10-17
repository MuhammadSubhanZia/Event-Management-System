import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useNavigate } from 'react-router';
import AuthPage from './pages/AuthPage';
import { clearCurrentUser } from './store/authSlice';

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
      <header className="site-header">
        <div className="container header-content">
          <Link className="brand" to="/">Event Management</Link>

          <nav className="nav-links" aria-label="Main navigation">
            <Link to="/">Home</Link>
            {currentUser ? (
              <>
                <span className="nav-user">Hi, {currentUser.name}</span>
                <button className="nav-button" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
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