import React from 'react';
import {AbsoluteFill, Img, interpolate, Easing, staticFile, useCurrentFrame} from 'remotion';
import {A, C, F, PLATE} from './theme';

/** Eased 0..1 across a window, measured from the start of the enclosing Sequence. */
export const ramp = (
  frame: number,
  from: number,
  to: number,
  ease: (t: number) => number = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/**
 * The hero photograph, always rendered at the same known geometry so evidence
 * markers and knock-out type can be positioned in the same coordinate space.
 */
export const Plate: React.FC<{
  scale?: number;
  x?: number;
  y?: number;
  blur?: number;
  brightness?: number;
  src?: string;
}> = ({scale = 1, x = 0, y = 0, blur = 0, brightness = 1, src = 'tomato-symptoms.jpg'}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: '38% 46%',
      filter: `${blur ? `blur(${blur}px) ` : ''}brightness(${brightness})`,
    }}
  >
    <Img
      src={staticFile(A(src))}
      style={{
        position: 'absolute',
        left: PLATE.x,
        top: PLATE.y,
        width: PLATE.w,
        height: PLATE.h,
        objectFit: 'cover',
      }}
    />
  </AbsoluteFill>
);

/** Type with the photograph showing through the letterforms. */
export const KnockOut: React.FC<{
  text: string;
  left: number;
  top: number;
  size: number;
  opacity?: number;
  lineHeight?: number;
}> = ({text, left, top, size, opacity = 1, lineHeight = 0.92}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      opacity,
      fontFamily: F.editorial,
      fontWeight: 700,
      fontSize: size,
      lineHeight,
      letterSpacing: '-0.035em',
      color: 'transparent',
      whiteSpace: 'pre',
      backgroundImage: `url(${staticFile(A('tomato-symptoms.jpg'))})`,
      backgroundSize: `${PLATE.w}px ${PLATE.h}px`,
      backgroundPosition: `${PLATE.x - left}px ${PLATE.y - top}px`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
    }}
  >
    {text}
  </div>
);

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.16}) => (
  <AbsoluteFill
    style={{
      opacity,
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
      backgroundImage: `url(${staticFile(A('botanical-paper.jpg'))})`,
      backgroundSize: 'cover',
    }}
  />
);

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.5}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(120% 80% at 50% 42%, transparent 38%, rgba(6,9,7,${strength}) 100%)`,
    }}
  />
);

/** A treatment step row as it is composed in ScanResultView. */
export const StepRow: React.FC<{
  index: number;
  title: string;
  detail: string;
  recurrence?: string;
  warning?: boolean;
  progress: number;
}> = ({index, title, detail, recurrence, warning, progress}) => (
  <div
    style={{
      display: 'flex',
      gap: 22,
      alignItems: 'flex-start',
      opacity: progress,
      transform: `translateY(${(1 - progress) * 34}px)`,
      padding: '20px 0',
      borderTop: index === 1 ? 'none' : `1px solid ${C.border}`,
    }}
  >
    <div
      style={{
        fontFamily: F.editorial,
        fontSize: 64,
        lineHeight: 0.8,
        fontWeight: 700,
        color: C.primary,
        minWidth: 62,
        marginLeft: -34,
      }}
    >
      {index}
    </div>
    <div style={{flex: 1}}>
      <div style={{fontFamily: F.ui, fontSize: 40, fontWeight: 650, color: C.ink}}>{title}</div>
      <div style={{fontFamily: F.ui, fontSize: 30, color: C.secondaryText, marginTop: 6, lineHeight: 1.3}}>
        {detail}
      </div>
      {recurrence ? (
        <div
          style={{
            display: 'inline-block',
            marginTop: 12,
            fontFamily: F.ui,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: warning ? C.stable : C.primary,
            background: warning ? 'rgba(176,128,14,0.13)' : C.primarySoft,
            padding: '7px 14px',
            borderRadius: 10,
          }}
        >
          {recurrence}
        </div>
      ) : null}
    </div>
  </div>
);

/** Evidence pin: ring on the lesion, leader line, label slab. */
export const EvidencePin: React.FC<{
  x: number;
  y: number;
  label: string;
  side: 'left' | 'right';
  leader: number;
  start: number;
  pulseAt: number;
}> = ({x, y, label, side, leader, start, pulseAt}) => {
  const frame = useCurrentFrame();
  const ring = ramp(frame, start, start + 16);
  const line = ramp(frame, start + 10, start + 26);
  const text = ramp(frame, start + 20, start + 34);
  const pulse = Math.sin(Math.max(0, frame - pulseAt) * 0.42) * Math.max(0, 1 - (frame - pulseAt) / 18);
  const r = lerp(ring, 8, 52) * (1 + (frame > pulseAt ? Math.max(0, pulse) * 0.16 : 0));
  const dir = side === 'right' ? 1 : -1;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          border: `2.5px solid ${C.bone}`,
          opacity: ring * 0.95,
          boxShadow: '0 0 22px rgba(0,0,0,0.45)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: side === 'right' ? x + r + 6 : x - r - 6 - leader * line,
          top: y - 1,
          width: leader * line,
          height: 2,
          background: C.bone,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: side === 'right' ? x + r + 12 + leader : undefined,
          right: side === 'left' ? 1080 - (x - r - 12 - leader) : undefined,
          top: y - 27,
          opacity: text,
          transform: `translateX(${(1 - text) * 16 * -dir}px)`,
          background: 'rgba(12,16,13,0.74)',
          backdropFilter: 'blur(6px)',
          padding: '11px 18px',
          borderRadius: 12,
          fontFamily: F.ui,
          fontSize: 34,
          fontWeight: 600,
          color: C.bone,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </>
  );
};

/** Score chip as it reads in the diagnosis header. */
export const ScoreChip: React.FC<{score: number; opacity?: number; scale?: number}> = ({
  score,
  opacity = 1,
  scale = 1,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'left center',
      background: 'rgba(12,16,13,0.78)',
      backdropFilter: 'blur(8px)',
      padding: '16px 26px 16px 20px',
      borderRadius: 20,
    }}
  >
    <div
      style={{
        fontFamily: F.ui,
        fontSize: 56,
        fontWeight: 750,
        fontVariantNumeric: 'tabular-nums',
        color: C.struggling,
      }}
    >
      {Math.round(score)}
    </div>
    <div>
      <div style={{fontFamily: F.ui, fontSize: 21, letterSpacing: '0.14em', color: C.boneDim, fontWeight: 600}}>
        VISIBLE HEALTH
      </div>
      <div style={{fontFamily: F.ui, fontSize: 26, fontWeight: 650, color: C.bone}}>Struggling</div>
    </div>
  </div>
);
