export function ErrorBanner({ error }: { error: Error }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      Couldn't load data: {error.message}
    </div>
  );
}
