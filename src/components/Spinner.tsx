export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
