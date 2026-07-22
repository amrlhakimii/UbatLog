import type { HTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
