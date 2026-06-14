import { ReactNode } from 'react';

interface OMGPosterBackgroundProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

export function OMGPosterBackground({ children, className = '', maxWidth = '430px' }: OMGPosterBackgroundProps) {
  return (
    <div className={`omg-grid-bg min-h-screen ${className}`}>
      <div className="mx-auto w-full" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
