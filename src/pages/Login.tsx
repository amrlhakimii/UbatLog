import { Navigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
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
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <Card className="w-full max-w-sm animate-fade-up p-8 text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          <span className="text-brand-600">Ubat</span>
          <span className="text-gray-900">Log</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">Clinic medication purchase log</p>
        <Button onClick={() => signIn()} size="lg" className="mt-6 w-full">
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}
