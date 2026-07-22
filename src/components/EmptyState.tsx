export function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="text-3xl">{emoji}</span>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
