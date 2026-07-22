import { useEffect } from 'react';

interface UndoToastProps {
  message: string;
  durationMs?: number;
  onUndo: () => void;
  onExpire: () => void;
}

export function UndoToast({ message, durationMs = 5000, onUndo, onExpire }: UndoToastProps) {
  useEffect(() => {
    const timer = setTimeout(onExpire, durationMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg">
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="text-sm font-semibold text-brand-300 hover:text-brand-200"
      >
        Undo
      </button>
    </div>
  );
}
