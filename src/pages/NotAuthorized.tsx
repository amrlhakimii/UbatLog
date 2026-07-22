import { useAuth } from '../hooks/useAuth';

export function NotAuthorized() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-xl font-bold text-gray-900">Not authorized</h1>
        <p className="mt-2 text-sm text-gray-500">
          {user?.email} isn't on the authorized list for UbatLog. Contact an admin if you think
          this is a mistake.
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
