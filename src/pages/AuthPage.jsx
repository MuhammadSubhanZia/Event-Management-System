import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router';
import { setCurrentUser } from '../store/authSlice';
import { loginUser, registerUser } from '../utils/authStorage';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isRegister && form.name.trim().length < 2) {
      setError('Enter a name with at least 2 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must have at least 8 characters.');
      return;
    }

    if (isRegister && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const user = isRegister
        ? await registerUser(form)
        : await loginUser(form);

      dispatch(setCurrentUser(user));
      navigate('/', { replace: true });
    } catch (problem) {
      setError(problem.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>{isRegister ? 'Create an account' : 'Welcome back'}</h1>
      <p>
        {isRegister
          ? 'Register to keep track of events you want to attend.'
          : 'Log in to manage your event registrations.'}
      </p>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={updateField}
              required
            />
          </div>
        )}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={form.password}
            onChange={updateField}
            required
          />
        </div>

        {isRegister && (
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={updateField}
              required
            />
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Please wait...'
            : isRegister ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p className="auth-switch">
        {isRegister ? 'Already have an account?' : 'New here?'}{' '}
        <Link to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </section>
  );
}