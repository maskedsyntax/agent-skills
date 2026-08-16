import React from 'react';
import {AbsoluteFill} from 'remotion';

export const ParallaxLayer: React.FC<{
  x?: number;
  y?: number;
  depth?: number;
  children: React.ReactNode;
}> = ({x = 0, y = 0, depth = 1, children}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x * depth}px, ${y * depth}px)`,
      pointerEvents: 'none',
    }}
  >
    {children}
  </AbsoluteFill>
);

export const MacroShot: React.FC<{
  scale?: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
}> = ({scale = 2.4, x = 0, y = 0, children}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: '50% 50%',
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Focus: React.FC<{
  blur?: number;
  saturate?: number;
  children: React.ReactNode;
}> = ({blur = 0, saturate = 1, children}) => (
  <AbsoluteFill
    style={{
      filter: `blur(${blur}px) saturate(${saturate})`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Spotlight: React.FC<{
  x?: number;
  y?: number;
  radius?: number;
  darkness?: number;
  children?: React.ReactNode;
}> = ({x = 50, y = 50, radius = 36, darkness = 0.55, children}) => (
  <AbsoluteFill>
    {children}
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, transparent ${radius}%, rgba(0,0,0,${darkness}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  </AbsoluteFill>
);
