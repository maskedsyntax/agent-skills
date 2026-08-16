import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const Cursor: React.FC<{
  x: number;
  y: number;
  opacity?: number;
  color?: string;
}> = ({x, y, opacity = 1, color = '#FFFFFF'}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '0 14px 22px 0',
      borderColor: `transparent ${color} transparent transparent`,
      transform: 'rotate(-20deg)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
      pointerEvents: 'none',
    }}
  />
);

export const Tap: React.FC<{
  x: number;
  y: number;
  start?: number;
  color?: string;
}> = ({x, y, start = 0, color = 'rgba(255,255,255,0.85)'}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - start, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 28 + t * 46,
        height: 28 + t * 46,
        marginLeft: -(14 + t * 23),
        marginTop: -(14 + t * 23),
        borderRadius: 99,
        border: `2px solid ${color}`,
        opacity: 1 - t,
        pointerEvents: 'none',
      }}
    />
  );
};
