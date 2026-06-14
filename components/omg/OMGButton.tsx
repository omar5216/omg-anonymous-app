'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'purple' | 'yellow' | 'white' | 'red' | 'ghost';
type Size = 'default' | 'sm';

interface OMGButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  half?: boolean;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  purple: 'omg-btn-purple',
  yellow: 'omg-btn-yellow',
  white:  'omg-btn-white',
  red:    'omg-btn-red',
  ghost:  'omg-btn-ghost',
};

export function OMGButton({ variant = 'purple', size = 'default', half, className = '', children, ...rest }: OMGButtonProps) {
  return (
    <button
      className={[
        'omg-btn',
        variantClass[variant],
        size === 'sm' ? 'omg-btn-sm' : '',
        half ? 'omg-btn-half' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
