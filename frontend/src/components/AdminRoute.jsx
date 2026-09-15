import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Like ProtectedRoute, but also requires role === 'admin'. A logged-in
// customer who isn't an admin gets bounced to the homepage rather than the
// login page, since logging in again wouldn't change their role.
export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-sm text-stone">Loading…</div>;
  }
    if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
