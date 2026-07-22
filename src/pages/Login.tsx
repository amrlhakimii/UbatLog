import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-purple-700">UbatLog</h1>
        <p className="mt-2 text-sm text-gray-500">Clinic medication purchase log</p>
        <button
          type="button"
          onClick={() => signIn()}
          className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
