import { CSSProperties } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AvatarVariant = 'yellow' | 'purple' | 'pink' | 'custom';

interface OMGAvatarProps {
  emoji?: string;
  initial?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  square?: boolean;
  className?: string;
  style?: CSSProperties;
}

const sizeConfig: Record<AvatarSize, { wh: number; fontSize: number }> = {
  sm: { wh: 32, fontSize: 16 },
  md: { wh: 44, fontSize: 20 },
  lg: { wh: 56, fontSize: 26 },
  xl: { wh: 72, fontSize: 36 },
};

const variantBg: Record<AvatarVariant, string> = {
  yellow: 'var(--omg-yellow)',
  purple: 'var(--omg-purple)',
  pink:   'var(--omg-pink)',
  custom: 'transparent',
};

const variantColor: Record<AvatarVariant, string> = {
  yellow: 'var(--omg-ink)',
  purple: '#fff',
  pink:   '#fff',
  custom: 'var(--omg-ink)',
};

export function OMGAvatar({ emoji, initial, size = 'lg', variant = 'yellow', square, className = '', style }: OMGAvatarProps) {
  const { wh, fontSize } = sizeConfig[size];
  const borderRadius = square ? (wh < 50 ? 10 : 14) : '50%';

  return (
    <div
      className={`flex items-center justify-content-center flex-shrink-0 border-[2.5px] border-[var(--omg-ink)] shadow-[3px_3px_0px_var(--omg-ink)] ${className}`}
      style={{
        width: wh,
        height: wh,
        borderRadius,
        background: variantBg[variant],
        color: variantColor[variant],
        fontSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        ...style,
      }}
    >
      {emoji || initial}
    </div>
  );
}
