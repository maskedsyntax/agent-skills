import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const KineticText: React.FC<{
  text: string;
  size?: number;
  color?: string;
  delay?: number;
  stagger?: number;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  crop?: boolean;
  fontFamily?: string;
  letterSpacing?: number;
  maxWidth?: number;
}> = ({
  text,
  size = 120,
  color = '#F4F1EA',
  delay = 0,
  stagger = 3,
  weight = 700,
  align = 'left',
  crop = false,
  fontFamily = 'Georgia, "Times New Roman", serif',
  letterSpacing = -0.04,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:
          align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        gap: `0 ${size * 0.22}px`,
        maxWidth,
        overflow: crop ? 'hidden' : undefined,
        lineHeight: 0.9,
      }}
    >
      {words.map((word, i) => {
        const local = frame - delay - i * stagger;
        const t = interpolate(local, [0, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              fontFamily,
              fontWeight: weight,
              fontSize: size,
              letterSpacing: `${letterSpacing}em`,
              color,
              opacity: t,
              transform: `translateY(${(1 - t) * size * 0.35}px) rotate(${(1 - t) * -3}deg)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const GiantWord: React.FC<{
  children: string;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  opacity?: number;
  fontFamily?: string;
}> = ({
  children,
  size = 280,
  color = 'rgba(255,255,255,0.12)',
  x = 0,
  y = 0,
  opacity = 1,
  fontFamily = 'Georgia, "Times New Roman", serif',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      fontFamily,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.8,
      letterSpacing: '-0.06em',
      color,
      opacity,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}
  >
    {children}
  </div>
);
