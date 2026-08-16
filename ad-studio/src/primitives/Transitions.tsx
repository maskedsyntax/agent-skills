import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const SplitScreen: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  split?: number;
  vertical?: boolean;
}> = ({left, right, split = 50, vertical = false}) => (
  <AbsoluteFill style={{display: 'flex', flexDirection: vertical ? 'column' : 'row'}}>
    <div style={{flexBasis: `${split}%`, overflow: 'hidden', position: 'relative'}}>{left}</div>
    <div style={{flex: 1, overflow: 'hidden', position: 'relative'}}>{right}</div>
  </AbsoluteFill>
);

export const BeforeAfter: React.FC<{
  before: React.ReactNode;
  after: React.ReactNode;
  progress: number;
}> = ({before, after, progress}) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <AbsoluteFill>
      <AbsoluteFill>{before}</AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `inset(0 0 0 ${p * 100}%)`,
        }}
      >
        {after}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MaskTransition: React.FC<{
  children: React.ReactNode;
  progress: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'circle';
}> = ({children, progress, direction = 'up'}) => {
  const p = Math.max(0, Math.min(1, progress));
  const clip =
    direction === 'circle'
      ? `circle(${p * 80}% at 50% 50%)`
      : direction === 'up'
        ? `inset(${(1 - p) * 100}% 0 0 0)`
        : direction === 'down'
          ? `inset(0 0 ${(1 - p) * 100}% 0)`
          : direction === 'left'
            ? `inset(0 0 0 ${(1 - p) * 100}%)`
            : `inset(0 ${(1 - p) * 100}% 0 0)`;
  return <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>;
};

export const MatchCut: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  at: number;
}> = ({from, to, at}) => {
  const frame = useCurrentFrame();
  const crossed = frame >= at;
  const flash = interpolate(frame, [at, at + 3], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      {crossed ? to : from}
      <AbsoluteFill style={{background: '#fff', opacity: crossed ? flash : 0}} />
    </AbsoluteFill>
  );
};
