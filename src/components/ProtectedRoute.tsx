import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NavBar } from './NavBar';
import { QuickActions } from './QuickActions';
import { NotAuthorized } from '../pages/NotAuthorized';

export function ProtectedRoute() {
  const { user, loading, authorized } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized) {
    return <NotAuthorized />;
  }

  return (
    <div className="app-bg">
      <NavBar />
      <Outlet />
      <QuickActions />
    </div>
  );
}
