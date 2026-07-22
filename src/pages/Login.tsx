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
        <p className="label-eyebrow">Welcome to</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-gray-900">
          Klinik Soma
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          <span className="text-brand-600 font-semibold">Ubat</span>
          <span className="font-semibold text-gray-700">Log</span> — clinic medication purchase log
        </p>
        <Button onClick={() => signIn()} size="lg" className="mt-6 w-full">
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}
