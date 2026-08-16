import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

export type CameraState = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  perspective: number;
  blur: number;
  opacity: number;
};

export type CameraProps = Partial<CameraState> & {
  origin?: string;
  children: React.ReactNode;
};

const DEFAULTS: CameraState = {
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  perspective: 1400,
  blur: 0,
  opacity: 1,
};

export const Camera: React.FC<CameraProps> = ({
  children,
  origin = '50% 50%',
  ...rest
}) => {
  const cam = {...DEFAULTS, ...rest};
  return (
    <AbsoluteFill
      style={{
        opacity: cam.opacity,
        transformOrigin: origin,
        transform: [
          `perspective(${cam.perspective}px)`,
          `translate(${cam.x}px, ${cam.y}px)`,
          `scale(${cam.scale})`,
          `rotate(${cam.rotate}deg)`,
          `rotateX(${cam.rotateX}deg)`,
          `rotateY(${cam.rotateY}deg)`,
        ].join(' '),
        filter: cam.blur ? `blur(${cam.blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export type CameraKeyframe = {frame: number} & Partial<CameraState>;

export const sampleCamera = (
  frame: number,
  keyframes: CameraKeyframe[],
): CameraState => {
  if (keyframes.length === 0) {
    return DEFAULTS;
  }
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  const keys = Object.keys(DEFAULTS) as (keyof CameraState)[];
  const result = {...DEFAULTS};

  keys.forEach((key) => {
    const points = sorted.filter((k) => k[key] !== undefined);
    if (points.length === 0) {
      return;
    }
    if (points.length === 1 || frame <= points[0].frame) {
      result[key] = (points[0][key] as number) ?? DEFAULTS[key];
      return;
    }
    const last = points[points.length - 1];
    if (frame >= last.frame) {
      result[key] = (last[key] as number) ?? DEFAULTS[key];
      return;
    }
    let i = 0;
    while (i < points.length - 1 && points[i + 1].frame < frame) {
      i += 1;
    }
    const a = points[i];
    const b = points[i + 1];
    result[key] = interpolate(frame, [a.frame, b.frame], [a[key] as number, b[key] as number], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  return result;
};

export const useCameraPath = (frame: number, keyframes: CameraKeyframe[]): CameraState =>
  sampleCamera(frame, keyframes);
