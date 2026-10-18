import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

export default function ProtectedRoute() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}