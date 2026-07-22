export function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-brand-300 opacity-90 blur-[80px]" />
      <div className="absolute -right-24 top-1/5 h-[360px] w-[360px] rounded-full bg-brand-600 opacity-70 blur-[90px]" />
      <div className="absolute -bottom-40 left-1/4 h-[480px] w-[480px] rounded-full bg-brand-200 opacity-95 blur-[100px]" />
    </div>
  );
}
