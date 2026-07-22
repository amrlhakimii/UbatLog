import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-[0_4px_14px_rgba(255,64,129,0.35)] hover:shadow-[0_6px_18px_rgba(255,64,129,0.45)] hover:brightness-105',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800',
  danger: 'bg-red-600 text-white shadow-[0_4px_14px_rgba(220,38,38,0.3)] hover:bg-red-700',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
