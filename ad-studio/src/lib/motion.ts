import {Easing} from 'remotion';

export type MotionStyle =
  | 'fomo'
  | 'urgency'
  | 'aspirational'
  | 'pain-solution'
  | 'transformation'
  | 'curiosity'
  | 'contrarian'
  | 'product-first'
  | 'demo'
  | 'speed'
  | 'social-proof'
  | 'objection-killer'
  | 'relatable'
  | 'story'
  | 'challenge'
  | 'feature-wow'
  | 'premium'
  | 'chaos-calm'
  | 'loss-aversion'
  | 'identity';

type MotionPreset = {
  ease: (t: number) => number;
  cutBias: 'hard' | 'soft';
};

export const motionFor = (style: MotionStyle): MotionPreset => {
  switch (style) {
    case 'fomo':
    case 'urgency':
    case 'speed':
    case 'challenge':
      return {ease: Easing.out(Easing.cubic), cutBias: 'hard'};
    case 'premium':
    case 'aspirational':
    case 'identity':
    case 'product-first':
      return {ease: Easing.inOut(Easing.cubic), cutBias: 'soft'};
    case 'chaos-calm':
      return {ease: Easing.out(Easing.quad), cutBias: 'hard'};
    case 'demo':
    case 'feature-wow':
      return {ease: Easing.bezier(0.22, 1, 0.36, 1), cutBias: 'hard'};
    default:
      return {ease: Easing.inOut(Easing.quad), cutBias: 'soft'};
  }
};
