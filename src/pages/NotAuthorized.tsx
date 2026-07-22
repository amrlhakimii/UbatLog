import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';

export function NotAuthorized() {
  const { user, signOut } = useAuth();

  return (
    <div className="app-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-sm animate-fade-up p-8 text-center">
        <span className="text-3xl">🔒</span>
        <h1 className="mt-2 font-display text-xl font-extrabold tracking-tight text-gray-900">
          Not authorized
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {user?.email} isn't on the authorized list for UbatLog. Contact an admin if you think
          this is a mistake.
        </p>
        <Button variant="secondary" onClick={() => signOut()} className="mt-6 w-full">
          Sign out
        </Button>
      </Card>
    </div>
  );
}
