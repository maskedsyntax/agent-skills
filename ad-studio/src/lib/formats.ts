export type AdFormat = 'vertical' | 'square' | 'horizontal';

export const FORMATS: Record<AdFormat, {width: number; height: number}> = {
  vertical: {width: 1080, height: 1920},
  square: {width: 1080, height: 1080},
  horizontal: {width: 1920, height: 1080},
};

export const DEFAULT_FPS = 30;
