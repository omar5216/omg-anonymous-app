import { ReactNode, HTMLAttributes } from 'react';

interface OMGCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hero';
  children: ReactNode;
}

export function OMGCard({ variant = 'default', className = '', children, ...rest }: OMGCardProps) {
  return (
    <div className={`${variant === 'hero' ? 'omg-card-hero' : 'omg-card'} ${className}`} {...rest}>
      {children}
    </div>
  );
}
