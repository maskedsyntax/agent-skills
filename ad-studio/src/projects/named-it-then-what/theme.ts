// Palette and type scale lifted from Cambium/DesignSystem/CambiumDesign.swift so the
// rebuilt interface matches the shipping app rather than a generic "app-looking" mock.

export const C = {
  ink: '#1B2019',
  inkDeep: '#0C100D',
  bone: '#FBF9F4',
  boneDim: 'rgba(251,249,244,0.66)',
  surface: '#FDFDFB',
  surfaceDark: '#161D18',
  primary: '#256E47',
  primarySoft: '#E6F1E6',
  thriving: '#2E8C52',
  stable: '#B0800E',
  struggling: '#B3382C',
  secondaryText: '#5A6157',
  border: 'rgba(0,0,0,0.08)',
} as const;

export const F = {
  editorial: 'Georgia, "Times New Roman", serif',
  ui: '-apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace',
} as const;

export const A = (id: string) => `named-it-then-what/${id}`;

// The hero photograph is 900x1200 covering a 1080x1920 frame: it scales by height
// (1920/1200 = 1.6) to 1440x1920 and is centred, so it sits at x = -180.
export const PLATE = {w: 1440, h: 1920, x: -180, y: 0} as const;

/** Normalised point on the source photograph -> frame coordinates. */
export const onLeaf = (fx: number, fy: number) => ({
  x: PLATE.x + fx * PLATE.w,
  y: PLATE.y + fy * PLATE.h,
});
