import React from 'react';
import {Audio, OffthreadVideo, staticFile} from 'remotion';

export const ScreenRecording: React.FC<{
  src: string;
  startFrom?: number;
  muted?: boolean;
  style?: React.CSSProperties;
}> = ({src, startFrom = 0, muted = true, style}) => (
  <OffthreadVideo
    src={src.startsWith('http') ? src : staticFile(src)}
    startFrom={startFrom}
    muted={muted}
    style={{width: '100%', height: '100%', objectFit: 'cover', ...style}}
  />
);

export const SoundHit: React.FC<{
  src: string;
  volume?: number;
}> = ({src, volume = 1}) => (
  <Audio src={src.startsWith('http') ? src : staticFile(src)} volume={volume} />
);

export const ReviewCard: React.FC<{
  quote: string;
  attribution?: string;
  stars?: number;
}> = ({quote, attribution, stars}) => (
  <div
    style={{
      maxWidth: 720,
      padding: '36px 40px',
      borderRadius: 28,
      background: 'rgba(20,20,24,0.88)',
      color: '#F4F1EA',
      fontFamily: 'Georgia, serif',
    }}
  >
    {typeof stars === 'number' ? (
      <div style={{letterSpacing: 4, marginBottom: 12, color: '#E8C36A'}}>
        {'★'.repeat(stars)}
      </div>
    ) : null}
    <div style={{fontSize: 36, lineHeight: 1.25}}>“{quote}”</div>
    {attribution ? (
      <div style={{marginTop: 16, fontFamily: 'system-ui', fontSize: 18, opacity: 0.7}}>
        {attribution}
      </div>
    ) : null}
  </div>
);
