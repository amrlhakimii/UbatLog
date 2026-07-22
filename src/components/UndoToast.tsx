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
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-fade-up items-center gap-4 rounded-full px-5 py-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
      style={{ background: 'rgba(20,20,24,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="cursor-pointer text-sm font-semibold text-brand-300 hover:text-brand-200"
      >
        Undo
      </button>
    </div>
  );
}
