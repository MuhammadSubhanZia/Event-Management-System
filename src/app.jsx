import { Link, Route, Routes } from 'react-router';
import { useSelector } from 'react-redux';

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
  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-content">
          <Link className="brand" to="/">Event Management</Link>
          <nav aria-label="Main navigation">
            <Link to="/">Home</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">Event Management System</div>
      </footer>
    </div>
  );
}