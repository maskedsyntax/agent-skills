import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Camera, sampleCamera} from '../../primitives/Camera';
import {Phone} from '../../primitives/Device';
import {GiantWord, KineticText} from '../../primitives/KineticText';
import {Spotlight} from '../../primitives/Layers';

const ScreenUI: React.FC = () => (
  <div
    style={{
      height: '100%',
      background: 'linear-gradient(180deg, #1A1A22 0%, #0C0C10 100%)',
      padding: '72px 28px 28px',
      color: '#F4F1EA',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <div style={{fontSize: 13, letterSpacing: 3, opacity: 0.5, textTransform: 'uppercase'}}>
      Today
    </div>
    <div style={{fontSize: 36, fontWeight: 700, marginTop: 10, letterSpacing: -1}}>Inbox</div>
    {['Ship the cut', 'Kill the slideshow', 'Leave one idea'].map((row, i) => (
      <div
        key={row}
        style={{
          marginTop: 18,
          padding: '16px 18px',
          borderRadius: 16,
          background: i === 1 ? '#F4F1EA' : 'rgba(255,255,255,0.06)',
          color: i === 1 ? '#111' : '#F4F1EA',
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        {row}
      </div>
    ))}
  </div>
);

export const Ad: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = sampleCamera(frame, [
    {frame: 0, scale: 3.2, x: 180, y: 420, rotateY: -18, rotateX: 8},
    {frame: 28, scale: 2.1, x: 40, y: 160, rotateY: -8, rotateX: 4},
    {frame: 58, scale: 1.05, x: 0, y: 40, rotateY: 10, rotateX: -2},
    {frame: 90, scale: 0.92, x: 0, y: -10, rotateY: 0, rotateX: 0},
  ]);
  const wordX = interpolate(frame, [0, 90], [-80, -280]);
  const bg = interpolate(frame, [0, 90], [8, 16]);

  return (
    <AbsoluteFill style={{backgroundColor: `hsl(240 10% ${bg}%)`, overflow: 'hidden'}}>
      <GiantWord x={wordX} y={220} size={320} color="rgba(244,241,234,0.08)">
        SHOTS
      </GiantWord>
      <Spotlight x={55} y={42} radius={32} darkness={0.4}>
        <Camera {...cam} origin="50% 60%">
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <Phone width={440}>
              <ScreenUI />
            </Phone>
          </AbsoluteFill>
        </Camera>
      </Spotlight>
      <Sequence from={18}>
        <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 72px 160px'}}>
          <KineticText text="not slides" size={92} color="#F4F1EA" />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
