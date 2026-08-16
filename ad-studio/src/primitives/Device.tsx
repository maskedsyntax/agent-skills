import React from 'react';
import {Img, staticFile} from 'remotion';

const bezel = {
  background: '#111114',
  boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
};

type ScreenProps = {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  background?: string;
};

const Screen: React.FC<ScreenProps> = ({src, alt, children, background = '#000'}) => {
  if (src) {
    return (
      <Img
        src={src.startsWith('http') || src.startsWith('data:') ? src : staticFile(src)}
        alt={alt ?? ''}
        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
      />
    );
  }
  return (
    <div style={{width: '100%', height: '100%', background, overflow: 'hidden', position: 'relative'}}>
      {children}
    </div>
  );
};

export const Phone: React.FC<
  ScreenProps & {width?: number; radius?: number}
> = ({width = 420, radius = 48, ...screen}) => {
  const height = Math.round(width * (19.5 / 9));
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        padding: 12,
        ...bezel,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 96,
          height: 22,
          borderRadius: 12,
          background: '#0A0A0C',
          zIndex: 2,
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: radius - 10,
          overflow: 'hidden',
        }}
      >
        <Screen {...screen} />
      </div>
    </div>
  );
};

export const MacWindow: React.FC<
  ScreenProps & {width?: number; height?: number; title?: string}
> = ({width = 920, height = 600, title = '', ...screen}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 14,
        overflow: 'hidden',
        ...bezel,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 36,
          background: '#1C1C22',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 10, height: 10, borderRadius: 10, background: c}} />
        ))}
        <div style={{flex: 1, textAlign: 'center', color: '#9A9AA3', fontSize: 13, fontFamily: 'system-ui'}}>
          {title}
        </div>
      </div>
      <div style={{flex: 1, minHeight: 0}}>
        <Screen {...screen} />
      </div>
    </div>
  );
};

export const BrowserWindow: React.FC<
  ScreenProps & {width?: number; height?: number; url?: string}
> = ({width = 920, height = 640, url = 'https://', ...screen}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 14,
        overflow: 'hidden',
        ...bezel,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 48,
          background: '#1C1C22',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 10,
          flexShrink: 0,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 10, height: 10, borderRadius: 10, background: c}} />
        ))}
        <div
          style={{
            flex: 1,
            height: 26,
            borderRadius: 8,
            background: '#0F0F13',
            color: '#B8B8C2',
            fontSize: 13,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
          }}
        >
          {url}
        </div>
      </div>
      <div style={{flex: 1, minHeight: 0}}>
        <Screen {...screen} />
      </div>
    </div>
  );
};
