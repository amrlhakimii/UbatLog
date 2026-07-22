import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-fade-up items-center gap-2 rounded-full px-5 py-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
      style={{ background: 'rgba(20,20,24,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <CheckCircle2 size={16} className="text-brand-300" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
