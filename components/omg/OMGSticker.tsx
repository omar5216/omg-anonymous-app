import { ReactNode, CSSProperties } from 'react';

type StickerVariant = 'yellow' | 'purple' | 'white' | 'pink' | 'red';
type StickerShape = 'pill' | 'circle';

interface OMGStickerProps {
  variant?: StickerVariant;
  shape?: StickerShape;
  children: ReactNode;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const variantClass: Record<StickerVariant, string> = {
  yellow: 'omg-stk-yellow',
  purple: 'omg-stk-purple',
  white:  'omg-stk-white',
  pink:   'omg-stk-pink',
  red:    'omg-stk-red',
};

export function OMGSticker({ variant = 'yellow', shape = 'pill', children, size, className = '', style }: OMGStickerProps) {
  const shapeClass = shape === 'circle' ? 'omg-stk-circle' : 'omg-stk-pill';
  const sizeStyle = size ? { width: size, height: size, fontSize: size < 30 ? 9 : 14 } : {};

  return (
    <span
      className={`omg-stk ${shapeClass} ${variantClass[variant]} ${className}`}
      style={{ ...sizeStyle, ...style }}
    >
      {children}
    </span>
  );
}
