import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {BeforeAfter, Phone, Tap} from '../../primitives';
import {A, C, F, onLeaf} from './theme';
import {EvidencePin, Grain, KnockOut, Plate, ScoreChip, StepRow, Vignette, lerp, ramp} from './parts';

// ── Shot map (30fps) ────────────────────────────────────────────────────────
const S = {
  name: [0, 72],
  nowWhat: [72, 126],
  thesis: [126, 210],
  scan: [210, 285],
  identify: [285, 360],
  score: [360, 450],
  evidence: [450, 555],
  cause: [555, 615],
  plan: [615, 720],
  remind: [720, 795],
  recheck: [795, 870],
  compare: [870, 990],
  telling: [990, 1065],
  objections: [1065, 1155],
  mark: [1155, 1230],
  end: [1230, 1350],
} as const;

const len = (k: keyof typeof S) => S[k][1] - S[k][0];

const Shot: React.FC<{k: keyof typeof S; children: React.ReactNode}> = ({k, children}) => (
  <Sequence from={S[k][0]} durationInFrames={len(k)} layout="none">
    {children}
  </Sequence>
);

// ── 1 · THE NAME ────────────────────────────────────────────────────────────
const ShotName: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 72, Easing.linear), 1.0, 1.14);
  const words = ['Solanum', 'lycopersicum'];
  const rule = ramp(f, 34, 62, Easing.inOut(Easing.cubic));

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={push} />
      <Vignette strength={0.62} />
      <AbsoluteFill style={{transform: `translateX(${-rule * 260}px)`}}>
        <div style={{position: 'absolute', left: 44, top: 838, whiteSpace: 'nowrap'}}>
          {words.map((w, i) => {
            const t = ramp(f, 6 + i * 9, 24 + i * 9);
            return (
              <span
                key={w}
                style={{
                  display: 'inline-block',
                  marginRight: 26,
                  fontFamily: F.editorial,
                  fontStyle: 'italic',
                  fontWeight: 700,
                  fontSize: 86,
                  letterSpacing: '-0.03em',
                  color: C.bone,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 26}px)`,
                  textShadow: '0 8px 40px rgba(0,0,0,0.6)',
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 44,
            top: 976,
            height: 4,
            width: rule * 1500,
            background: C.bone,
            opacity: 0.9,
          }}
        />
      </AbsoluteFill>
      <Grain opacity={0.13} />
    </AbsoluteFill>
  );
};

// ── 2 · NOW WHAT ────────────────────────────────────────────────────────────
const ShotNowWhat: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 54, Easing.linear), 1.14, 1.19);
  const scrim = ramp(f, 0, 16);
  const t = ramp(f, 6, 26, Easing.out(Easing.poly(4)));

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={push} blur={lerp(ramp(f, 0, 40), 0, 7)} />
      <AbsoluteFill style={{background: `rgba(8,11,9,${scrim * 0.78})`}} />
      <div
        style={{
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px)`,
          filter: 'brightness(1.9) saturate(1.15) contrast(1.15) drop-shadow(0 6px 30px rgba(0,0,0,0.7))',
        }}
      >
        <KnockOut text={'Now\nwhat?'} left={74} top={860} size={210} lineHeight={0.86} />
      </div>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

// ── 3 · WHERE THEY STOP ─────────────────────────────────────────────────────
const ShotThesis: React.FC = () => {
  const f = useCurrentFrame();
  const drift = ramp(f, 0, 84, Easing.linear);
  const wipe = ramp(f, 66, 84, Easing.in(Easing.cubic));
  const line1 = ramp(f, 4, 22);
  const line2 = ramp(f, 16, 36);

  return (
    <AbsoluteFill style={{background: C.inkDeep, overflow: 'hidden'}}>
      <Plate scale={1.24} x={-drift * 120} brightness={0.42} blur={3} />
      <AbsoluteFill style={{background: 'rgba(8,11,9,0.5)'}} />
      <div style={{position: 'absolute', left: 78, top: 560, width: 940}}>
        <div
          style={{
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 116,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            color: C.bone,
            opacity: line1,
            transform: `translateY(${(1 - line1) * 24}px)`,
          }}
        >
          Most plant apps
        </div>
        <div
          style={{
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 116,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            color: C.bone,
            opacity: line2,
            transform: `translateY(${(1 - line2) * 24}px)`,
          }}
        >
          <span style={{color: C.struggling}}>stop</span> at the name.
        </div>
      </div>
      <AbsoluteFill
        style={{background: C.inkDeep, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}
      />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ── 4 · THE PHOTO BECOMES A SCAN ────────────────────────────────────────────
const ShotScan: React.FC = () => {
  const f = useCurrentFrame();
  const pull = lerp(ramp(f, 0, 60, Easing.out(Easing.poly(4))), 1.14, 0.42);
  const rise = ramp(f, 0, 44, Easing.out(Easing.cubic));
  const chrome = ramp(f, 26, 46);
  const bracket = ramp(f, 38, 56, Easing.out(Easing.poly(4)));
  const sweep = ramp(f, 52, 74, Easing.inOut(Easing.quad));

  const phoneW = 700;
  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={1.3} blur={26} brightness={0.3} />
      <AbsoluteFill style={{background: 'rgba(8,11,9,0.55)'}} />
      <AbsoluteFill
        style={{
          transform: `translate(${lerp(rise, -20, -86)}px, ${lerp(rise, 460, 120)}px) perspective(1500px) rotateY(-13deg) rotate(-4deg) scale(${lerp(rise, 1.6, 1)})`,
          transformOrigin: '50% 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{position: 'relative', opacity: chrome}}>
          <Phone width={phoneW}>
            <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
              <div style={{position: 'absolute', inset: 0, transform: 'scale(1.06)'}}>
                <Img
                  src={staticFile(A('tomato-symptoms.jpg'))}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
              {[
                [40, 300, 0, 0],
                [40, 300, 1, 0],
                [40, 300, 0, 1],
                [40, 300, 1, 1],
              ].map(([, , rx, ry], i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    [rx ? 'right' : 'left']: lerp(bracket, 120, 46),
                    [ry ? 'bottom' : 'top']: lerp(bracket, 640, 430),
                    width: 96,
                    height: 96,
                    borderTop: ry ? 'none' : `8px solid ${C.bone}`,
                    borderBottom: ry ? `8px solid ${C.bone}` : 'none',
                    borderLeft: rx ? 'none' : `8px solid ${C.bone}`,
                    borderRight: rx ? `8px solid ${C.bone}` : 'none',
                    filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
                    opacity: bracket * 0.95,
                  } as React.CSSProperties}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${sweep * 100}%`,
                  height: 6,
                  background: `linear-gradient(90deg, transparent, ${C.thriving}, transparent)`,
                  opacity: sweep > 0 && sweep < 1 ? 0.95 : 0,
                  boxShadow: `0 0 40px ${C.thriving}`,
                }}
              />
              <Tap x={phoneW / 2} y={1180} start={34} />
            </div>
          </Phone>
        </div>
      </AbsoluteFill>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

// ── 5 · IT IS A TOMATO ──────────────────────────────────────────────────────
const ShotIdentify: React.FC = () => {
  const f = useCurrentFrame();
  const settle = lerp(ramp(f, 0, 34, Easing.out(Easing.cubic)), 1.06, 1.0);
  const name = ramp(f, 6, 24);
  const sci = ramp(f, 16, 34);
  const bar = ramp(f, 26, 58, Easing.out(Easing.cubic));
  const whip = lerp(ramp(f, 62, 75, Easing.in(Easing.poly(4))), 1, 2.1);

  return (
    <AbsoluteFill style={{background: C.surface, transform: `scale(${settle * whip})`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 820, overflow: 'hidden'}}>
        <Img
          src={staticFile(A('tomato-symptoms.jpg'))}
          style={{width: '100%', height: 1180, objectFit: 'cover', marginTop: -230}}
        />
        <AbsoluteFill
          style={{background: 'linear-gradient(to bottom, transparent 55%, rgba(253,253,251,1))'}}
        />
      </div>
      <div style={{position: 'absolute', left: 74, right: 74, top: 880}}>
        <div
          style={{
            fontFamily: F.ui,
            fontSize: 96,
            fontWeight: 750,
            letterSpacing: '-0.02em',
            color: C.ink,
            opacity: name,
            transform: `translateY(${(1 - name) * 22}px)`,
          }}
        >
          Tomato
        </div>
        <div
          style={{
            fontFamily: F.editorial,
            fontStyle: 'italic',
            fontSize: 46,
            color: C.secondaryText,
            marginTop: 6,
            opacity: sci,
          }}
        >
          Solanum lycopersicum
        </div>

        <div style={{marginTop: 74, opacity: ramp(f, 24, 40)}}>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <div
              style={{
                fontFamily: F.ui,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: C.secondaryText,
              }}
            >
              CONFIDENCE
            </div>
            <div
              style={{
                fontFamily: F.ui,
                fontSize: 62,
                fontWeight: 750,
                fontVariantNumeric: 'tabular-nums',
                color: C.primary,
              }}
            >
              {Math.round(bar * 94)}%
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              height: 16,
              borderRadius: 99,
              background: C.primarySoft,
              overflow: 'hidden',
            }}
          >
            <div style={{width: `${bar * 94}%`, height: '100%', background: C.primary, borderRadius: 99}} />
          </div>
        </div>

        <div
          style={{
            marginTop: 58,
            opacity: ramp(f, 44, 60),
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '26px 30px',
            borderRadius: 24,
            background: 'rgba(179,56,44,0.09)',
            border: `1px solid rgba(179,56,44,0.2)`,
          }}
        >
          <div
            style={{
              fontFamily: F.ui,
              fontSize: 58,
              fontWeight: 750,
              color: C.struggling,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            41
          </div>
          <div style={{fontFamily: F.ui, fontSize: 32, fontWeight: 600, color: C.ink}}>
            Visible health · Struggling
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 6 · FORTY-ONE ───────────────────────────────────────────────────────────
const ShotScore: React.FC = () => {
  const f = useCurrentFrame();
  const crop = lerp(ramp(f, 0, 66, Easing.out(Easing.poly(4))), 2.6, 1.0);
  const drift = ramp(f, 0, 90, Easing.linear);
  const val = ramp(f, 4, 48, Easing.out(Easing.poly(4))) * 41;
  const ringT = ramp(f, 4, 54, Easing.out(Easing.cubic));
  const R = 250;
  const CIRC = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={1.5} brightness={0.24} blur={10} />
      <AbsoluteFill
        style={{
          transform: `scale(${crop}) translate(${-drift * 30}px, ${-drift * 22}px)`,
          transformOrigin: '62% 40%',
        }}
      >
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={540} cy={780} r={R} fill="none" stroke="rgba(251,249,244,0.12)" strokeWidth={26} />
          <circle
            cx={540}
            cy={780}
            r={R}
            fill="none"
            stroke={C.struggling}
            strokeWidth={26}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - ringT * 0.41)}
            transform="rotate(-90 540 780)"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 560,
            textAlign: 'center',
            fontFamily: F.ui,
            fontSize: 420,
            fontWeight: 780,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            fontVariantNumeric: 'tabular-nums',
            color: C.bone,
          }}
        >
          {Math.round(val)}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1000,
            textAlign: 'center',
            fontFamily: F.ui,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: C.boneDim,
            opacity: ramp(f, 30, 46),
          }}
        >
          VISIBLE HEALTH
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1090,
            display: 'flex',
            justifyContent: 'center',
            opacity: ramp(f, 44, 58),
          }}
        >
          <div
            style={{
              fontFamily: F.ui,
              fontSize: 34,
              fontWeight: 700,
              color: C.bone,
              background: C.struggling,
              padding: '12px 30px',
              borderRadius: 99,
            }}
          >
            Struggling
          </div>
        </div>
      </AbsoluteFill>
      <Vignette strength={0.55} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ── 7 · THE EVIDENCE ────────────────────────────────────────────────────────
const pinA = onLeaf(0.333, 0.475);
const pinB = onLeaf(0.555, 0.717);
const pinC = onLeaf(0.183, 0.8);

const ShotEvidence: React.FC = () => {
  const f = useCurrentFrame();
  const pull = lerp(ramp(f, 0, 105, Easing.out(Easing.quad)), 1.18, 1.06);
  const drift = ramp(f, 0, 105, Easing.linear) * 20;

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <AbsoluteFill
        style={{transform: `translateX(${drift}px) scale(${pull})`, transformOrigin: '38% 46%'}}
      >
        <Plate />
        <AbsoluteFill style={{background: 'rgba(8,11,9,0.2)'}} />
        <EvidencePin {...pinA} label="concentric brown lesions" side="right" leader={96} start={4} pulseAt={88} />
        <EvidencePin {...pinB} label="yellow halos" side="left" leader={78} start={22} pulseAt={88} />
        <EvidencePin {...pinC} label="lower-canopy spread" side="right" leader={66} start={40} pulseAt={88} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 74,
          top: 150,
          opacity: ramp(f, 0, 18),
          fontFamily: F.ui,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: '0.28em',
          color: C.bone,
          textShadow: '0 4px 24px rgba(0,0,0,0.7)',
        }}
      >
        WHAT IT SAW
      </div>
      <Vignette strength={0.45} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ── 8 · LIKELY CAUSE ────────────────────────────────────────────────────────
const ShotCause: React.FC = () => {
  const f = useCurrentFrame();
  const inT = ramp(f, 0, 20, Easing.out(Easing.poly(4)));
  const wipe = ramp(f, 46, 60, Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={1.34} x={80} brightness={0.35} blur={7} />
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `perspective(1600px) rotateY(9deg) translateX(${lerp(inT, 120, 0)}px)`,
          opacity: inT,
        }}
      >
        <div
          style={{
            marginLeft: 70,
            width: 1120,
            background: C.surface,
            borderRadius: 34,
            padding: '52px 56px',
            boxShadow: '0 50px 120px rgba(0,0,0,0.55)',
          }}
        >
          <div
            style={{
              fontFamily: F.ui,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: C.secondaryText,
            }}
          >
            LIKELY CAUSE
          </div>
          <div
            style={{
              fontFamily: F.ui,
              fontSize: 84,
              fontWeight: 750,
              letterSpacing: '-0.025em',
              color: C.ink,
              marginTop: 14,
            }}
          >
            Septoria leaf spot
          </div>
          <div style={{display: 'flex', gap: 14, marginTop: 26}}>
            {['Moderate severity', 'Fungal'].map((t, i) => (
              <div
                key={t}
                style={{
                  fontFamily: F.ui,
                  fontSize: 28,
                  fontWeight: 650,
                  color: i === 0 ? C.stable : C.primary,
                  background: i === 0 ? 'rgba(176,128,14,0.14)' : C.primarySoft,
                  padding: '12px 22px',
                  borderRadius: 12,
                  opacity: ramp(f, 14 + i * 6, 30 + i * 6),
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: C.surface, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}} />
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};

// ── 9 · WHAT TO DO ──────────────────────────────────────────────────────────
const steps = [
  {title: 'Remove affected leaves', detail: 'Lower canopy first. Bag them, do not compost.', rec: 'Once'},
  {
    title: 'Water at the soil line',
    detail: 'Splashing spreads spores upward through the plant.',
    rec: 'Avoid overhead watering',
    warning: true,
  },
  {title: 'Improve airflow', detail: 'Thin crowded stems so leaves dry within the hour.', rec: 'Once'},
  {title: 'Mulch the base', detail: 'A barrier between soil and the lowest leaves.', rec: 'Every 14 days'},
];

const ShotPlan: React.FC = () => {
  const f = useCurrentFrame();
  const track = ramp(f, 10, 100, Easing.inOut(Easing.quad));
  const inT = ramp(f, 0, 24, Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={1.4} x={-140} brightness={0.22} blur={20} />
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 44,
          width: 900,
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 110,
          lineHeight: 0.98,
          letterSpacing: '-0.04em',
          color: C.bone,
          opacity: ramp(f, 4, 24),
          transform: `translateY(${(1 - ramp(f, 4, 24)) * 26}px)`,
          textShadow: '0 10px 50px rgba(0,0,0,0.7)',
        }}
      >
        What
        <br />
        to do.
      </div>
      <AbsoluteFill
        style={{
          transform: `perspective(1700px) rotateY(-16deg) rotate(2deg) translate(${lerp(inT, 130, 148)}px, ${lerp(inT, 320, 236)}px)`,
          opacity: inT,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0}}>
          <Phone width={760}>
            <div style={{position: 'absolute', inset: 0, background: C.surface, overflow: 'hidden'}}>
              <div
                style={{
                  padding: '60px 54px 0 54px',
                  transform: `translateY(${-track * 150}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: F.ui,
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: '0.28em',
                    color: C.secondaryText,
                  }}
                >
                  TREATMENT PLAN
                </div>
                <div style={{marginTop: 26}}>
                  {steps.map((s, i) => (
                    <StepRow
                      key={s.title}
                      index={i + 1}
                      title={s.title}
                      detail={s.detail}
                      recurrence={s.rec}
                      warning={s.warning}
                      progress={ramp(f, 14 + i * 17, 34 + i * 17)}
                    />
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 26,
                    padding: '30px 0',
                    textAlign: 'center',
                    borderRadius: 18,
                    border: `2px solid ${C.primary}`,
                    fontFamily: F.ui,
                    fontSize: 36,
                    fontWeight: 650,
                    color: C.primary,
                    opacity: ramp(f, 88, 104),
                  }}
                >
                  Set re-check reminder
                </div>
                <div
                  style={{
                    marginTop: 22,
                    textAlign: 'center',
                    fontFamily: F.ui,
                    fontSize: 26,
                    color: C.secondaryText,
                    opacity: ramp(f, 94, 108),
                  }}
                >
                  Cambium will ask you to photograph the same leaf.
                </div>
              </div>
            </div>
          </Phone>
        </div>
      </AbsoluteFill>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ── 10 · SEVEN DAYS ─────────────────────────────────────────────────────────
const ShotRemind: React.FC = () => {
  const f = useCurrentFrame();
  const drop = ramp(f, 8, 32, Easing.out(Easing.back(1.6)));
  const out = ramp(f, 62, 75, Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={1.16} brightness={0.5} blur={16} />
      <AbsoluteFill style={{background: 'rgba(8,11,9,0.42)'}} />
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: lerp(drop, -260, 700) - out * 900,
          opacity: drop * (1 - out),
          background: 'rgba(250,249,246,0.94)',
          backdropFilter: 'blur(24px)',
          borderRadius: 40,
          padding: '34px 38px',
          display: 'flex',
          gap: 26,
          alignItems: 'center',
          boxShadow: '0 40px 90px rgba(0,0,0,0.45)',
        }}
      >
        <Img src={staticFile(A('cambium-icon.png'))} style={{width: 96, height: 96, borderRadius: 22}} />
        <div style={{flex: 1}}>
          <div style={{fontFamily: F.ui, fontSize: 26, fontWeight: 700, letterSpacing: '0.06em', color: C.secondaryText}}>
            CAMBIUM · now
          </div>
          <div style={{fontFamily: F.ui, fontSize: 42, fontWeight: 700, color: C.ink, marginTop: 8}}>
            Re-check your tomato
          </div>
          <div style={{fontFamily: F.ui, fontSize: 34, color: C.secondaryText, marginTop: 4}}>
            Photograph the same leaf.
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1290,
          textAlign: 'center',
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 96,
          color: C.bone,
          opacity: ramp(f, 36, 54) * (1 - out),
          textShadow: '0 10px 50px rgba(0,0,0,0.6)',
        }}
      >
        Seven days later
      </div>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ── 11 · RE-CHECK ───────────────────────────────────────────────────────────
const ShotRecheck: React.FC = () => {
  const f = useCurrentFrame();
  const pull = lerp(ramp(f, 0, 46, Easing.out(Easing.poly(4))), 1.62, 1.0);
  const tilt = lerp(ramp(f, 0, 46, Easing.out(Easing.cubic)), 9, 0);
  const rise = ramp(f, 44, 66, Easing.out(Easing.cubic));
  const handoff = ramp(f, 66, 75, Easing.in(Easing.cubic));

  const row = (label: string, value: string, i: number) => (
    <div
      key={label}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 0',
        borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
        opacity: ramp(f, 2 + i * 6, 18 + i * 6),
      }}
    >
      <div style={{fontFamily: F.ui, fontSize: 36, color: C.secondaryText}}>{label}</div>
      <div style={{fontFamily: F.ui, fontSize: 38, fontWeight: 700, color: C.ink}}>{value}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{background: C.inkDeep, overflow: 'hidden'}}>
      <Plate scale={1.3} brightness={0.2} blur={22} />
      <AbsoluteFill
        style={{
          transform: `perspective(2000px) rotateX(${tilt}deg) scale(${pull}) translateY(${-handoff * 260}px)`,
          transformOrigin: '50% 34%',
          opacity: 1 - handoff * 0.4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 56,
            top: 300,
            background: C.surface,
            borderRadius: 40,
            padding: '46px 48px',
            boxShadow: '0 60px 140px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              fontFamily: F.ui,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: C.secondaryText,
            }}
          >
            RECOVERY · TOMATO
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 26,
              background: 'rgba(0,0,0,0.05)',
              padding: 6,
              borderRadius: 16,
            }}
          >
            {['Active', 'Resolved', 'Stopped'].map((t, i) => (
              <div
                key={t}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '16px 0',
                  borderRadius: 12,
                  background: i === 0 ? C.surface : 'transparent',
                  boxShadow: i === 0 ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                  fontFamily: F.ui,
                  fontSize: 32,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? C.ink : C.secondaryText,
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div style={{marginTop: 12}}>
            {row('Re-check reminder', 'in 7 days', 0)}
            {row('Treatment steps', '4', 1)}
            {row('Photos in this episode', '2', 2)}
          </div>

          <div
            style={{
              position: 'relative',
              marginTop: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              background: C.primary,
              borderRadius: 22,
              padding: '32px 0',
              opacity: ramp(f, 20, 34),
            }}
          >
            <div style={{width: 46, height: 36, borderRadius: 9, border: `4px solid ${C.bone}`}} />
            <div style={{fontFamily: F.ui, fontSize: 46, fontWeight: 700, color: C.bone}}>
              Re-check this plant
            </div>
            <Tap x={484} y={50} start={38} color="rgba(251,249,244,0.95)" />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 56,
            top: 1180,
            background: C.surface,
            borderRadius: 40,
            padding: '40px 48px 46px',
            opacity: rise,
            transform: `translateY(${(1 - rise) * 90}px)`,
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{fontFamily: F.ui, fontSize: 40, fontWeight: 700, color: C.ink}}>
            Before and after
          </div>
          <div
            style={{
              position: 'relative',
              marginTop: 24,
              height: 380,
              borderRadius: 22,
              background: C.primarySoft,
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile(A('tomato-symptoms.jpg'))}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
            <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, background: C.bone}} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 166,
                marginLeft: -24,
                width: 48,
                height: 48,
                borderRadius: 24,
                background: C.bone,
                boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};

// ── 12 · THE SAME PHOTOGRAPH ────────────────────────────────────────────────
const Annotated: React.FC = () => (
  <AbsoluteFill>
    <Plate />
    <AbsoluteFill style={{background: 'rgba(8,11,9,0.24)'}} />
    {[pinA, pinB, pinC].map((p, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: p.x - 52,
          top: p.y - 52,
          width: 104,
          height: 104,
          borderRadius: '50%',
          border: `2.5px solid ${C.bone}`,
          boxShadow: '0 0 22px rgba(0,0,0,0.45)',
        }}
      />
    ))}
    <div style={{position: 'absolute', left: 64, top: 190}}>
      <ScoreChip score={41} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 330,
        background: 'rgba(12,16,13,0.74)',
        backdropFilter: 'blur(6px)',
        borderRadius: 14,
        padding: '14px 22px',
        fontFamily: F.ui,
        fontSize: 36,
        fontWeight: 650,
        color: C.bone,
      }}
    >
      Septoria leaf spot · Moderate
    </div>
  </AbsoluteFill>
);

const ShotCompare: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 16, 96, Easing.inOut(Easing.cubic));
  const capA = ramp(f, 4, 20) * (1 - ramp(f, 62, 76));
  const capB = ramp(f, 78, 94);
  const lift = ramp(f, 110, 120, Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{background: C.inkDeep, transform: `translateY(${-lift * 1920}px)`}}>
      <BeforeAfter before={<Annotated />} after={<Plate />} progress={p} />
      <div
        style={{
          position: 'absolute',
          left: p * 1080 - 2,
          top: 0,
          width: 4,
          height: 1920,
          background: C.bone,
          opacity: p > 0.01 && p < 0.99 ? 0.9 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: p * 1080 - 38,
          top: 920,
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: C.bone,
          opacity: p > 0.01 && p < 0.99 ? 1 : 0,
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 190,
          textAlign: 'center',
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 74,
          color: C.bone,
          textShadow: '0 10px 50px rgba(0,0,0,0.75)',
          opacity: capA,
        }}
      >
        Same photograph.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 190,
          textAlign: 'center',
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 74,
          color: C.bone,
          textShadow: '0 10px 50px rgba(0,0,0,0.75)',
          opacity: capB,
        }}
      >
        Everything you couldn’t see.
      </div>
      <Grain opacity={0.09} />
    </AbsoluteFill>
  );
};

// ── 13 · IT WAS TELLING YOU ─────────────────────────────────────────────────
const ShotTelling: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 75, Easing.linear), 1.04, 1.13);
  const l1 = ramp(f, 6, 28);
  const l2 = ramp(f, 24, 46);
  const out = ramp(f, 64, 75);

  return (
    <AbsoluteFill style={{background: C.inkDeep, opacity: 1 - out}}>
      <Plate src="monstera.jpg" scale={push} brightness={0.86} />
      <AbsoluteFill
        style={{background: 'linear-gradient(to top, rgba(8,11,9,0.85) 18%, transparent 62%)'}}
      />
      <div style={{position: 'absolute', left: 76, bottom: 300, width: 900}}>
        <div
          style={{
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.12,
            color: C.bone,
            opacity: l1,
            transform: `translateY(${(1 - l1) * 22}px)`,
          }}
        >
          The plant was telling you.
        </div>
        <div
          style={{
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.12,
            color: C.thriving,
            marginTop: 14,
            opacity: l2,
            transform: `translateY(${(1 - l2) * 22}px)`,
          }}
        >
          Now you can read it.
        </div>
      </div>
      <Grain opacity={0.11} />
    </AbsoluteFill>
  );
};

// ── 14 · THE THREE OBJECTIONS ───────────────────────────────────────────────
const ShotObjections: React.FC = () => {
  const f = useCurrentFrame();
  const card = f < 30 ? 0 : f < 60 ? 1 : 2;
  const local = f - card * 30;
  const t = ramp(local, 0, 12, Easing.out(Easing.poly(4)));

  if (card === 0) {
    return (
      <AbsoluteFill style={{background: C.inkDeep}}>
        <Plate scale={lerp(ramp(local, 0, 30, Easing.linear), 1.5, 1.58)} brightness={0.22} blur={14} />
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 700,
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 172,
            letterSpacing: '-0.045em',
            lineHeight: 0.94,
            color: C.bone,
            opacity: t,
            transform: `translateY(${(1 - t) * 30}px)`,
          }}
        >
          No
          <br />
          account.
        </div>
        <Grain opacity={0.1} />
      </AbsoluteFill>
    );
  }

  if (card === 1) {
    return (
      <AbsoluteFill style={{background: '#0F1511', overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: 352,
            top: 210,
            transform: `perspective(1500px) rotateY(-22deg) rotate(-6deg) scale(${lerp(t, 1.1, 1.0)})`,
            opacity: t,
          }}
        >
          <Phone width={760}>
            <div style={{position: 'absolute', inset: 0, background: C.surface}}>
              <div style={{padding: '70px 50px'}}>
                <div style={{fontFamily: F.ui, fontSize: 54, fontWeight: 750, color: C.ink}}>Garden</div>
                {['Tomato', 'Monstera', 'Basil'].map((n, i) => (
                  <div
                    key={n}
                    style={{
                      marginTop: 24,
                      padding: 22,
                      borderRadius: 22,
                      background: i === 0 ? 'rgba(179,56,44,0.09)' : C.primarySoft,
                      fontFamily: F.ui,
                      fontSize: 38,
                      fontWeight: 600,
                      color: C.ink,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </Phone>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 1180,
            width: 700,
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1.06,
            color: C.bone,
            opacity: ramp(local, 6, 20),
          }}
        >
          Your Garden stays on your iPhone.
        </div>
        <Grain opacity={0.09} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{background: C.bone}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(A('botanical-paper.jpg'))})`,
          backgroundSize: 'cover',
          opacity: 0.6,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: C.ink,
            opacity: t,
            transform: `scale(${lerp(t, 0.94, 1)})`,
          }}
        >
          Three scans free,
          <br />
          every month.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 15 · THE MARK ───────────────────────────────────────────────────────────
const ShotMark: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 40, Easing.out(Easing.cubic)), 0.86, 1.0);
  const word = ramp(f, 26, 46);

  return (
    <AbsoluteFill style={{background: C.bone}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(A('botanical-paper.jpg'))})`,
          backgroundSize: 'cover',
          opacity: 0.55,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Img
          src={staticFile(A('cambium-icon.png'))}
          style={{
            width: 380,
            height: 380,
            borderRadius: 86,
            transform: `scale(${push})`,
            boxShadow: `${lerp(push, 40, 14)}px 40px 90px rgba(27,32,25,0.28)`,
          }}
        />
        <div
          style={{
            marginTop: 66,
            fontFamily: F.editorial,
            fontWeight: 700,
            fontSize: 108,
            letterSpacing: '0.02em',
            color: C.ink,
            opacity: word,
            transform: `translateY(${(1 - word) * 16}px)`,
          }}
        >
          Cambium
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 16 · THE END FRAME ──────────────────────────────────────────────────────
const ShotEnd: React.FC = () => {
  const f = useCurrentFrame();
  const drift = lerp(ramp(f, 0, 120, Easing.linear), 1.0, 1.03);
  const a = ramp(f, 0, 18);
  const b = ramp(f, 14, 32);
  const c = ramp(f, 26, 44);

  return (
    <AbsoluteFill style={{background: C.bone}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(A('botanical-paper.jpg'))})`,
          backgroundSize: 'cover',
          opacity: 0.55,
          transform: `scale(${drift})`,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Img
          src={staticFile(A('cambium-icon.png'))}
          style={{width: 200, height: 200, borderRadius: 46, opacity: a, boxShadow: '14px 24px 60px rgba(27,32,25,0.24)'}}
        />
        <div
          style={{
            marginTop: 58,
            fontFamily: F.ui,
            fontSize: 58,
            fontWeight: 750,
            letterSpacing: '0.06em',
            color: C.ink,
            opacity: b,
          }}
        >
          Identify. Diagnose. Re-check.
        </div>
        <div
          style={{
            marginTop: 74,
            fontFamily: F.ui,
            fontSize: 46,
            fontWeight: 650,
            color: C.bone,
            background: C.primary,
            padding: '26px 54px',
            borderRadius: 20,
            opacity: c,
          }}
        >
          on the App Store
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: F.mono,
            fontSize: 34,
            color: C.secondaryText,
            opacity: c,
          }}
        >
          getcambiumapp.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// ── Hook variants ───────────────────────────────────────────────────────────
// Same film, different first two seconds. Each replaces shots 1–2 only.

/** L2 — the damage counted out loud. */
const HookSpots: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 126, Easing.linear), 1.06, 1.2);
  const marks = [pinA, pinB, pinC, onLeaf(0.44, 0.6), onLeaf(0.26, 0.62), onLeaf(0.6, 0.53)];
  const words = ['Spot.', 'Spot.', 'Spot.'];

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '38% 46%'}}>
        <Plate />
        {marks.map((m, i) => {
          const t = ramp(f, 6 + i * 13, 20 + i * 13, Easing.out(Easing.poly(4)));
          const r = lerp(t, 90, 46);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: m.x - r,
                top: m.y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: `3px solid ${C.bone}`,
                opacity: t * 0.95,
                boxShadow: '0 0 22px rgba(0,0,0,0.5)',
              }}
            />
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 66, bottom: 220}}>
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: 24,
              fontFamily: F.editorial,
              fontWeight: 700,
              fontSize: 116,
              color: C.bone,
              opacity: ramp(f, 10 + i * 22, 24 + i * 22),
              textShadow: '0 8px 40px rgba(0,0,0,0.8)',
            }}
          >
            {w}
          </span>
        ))}
      </div>
      <Vignette strength={0.55} />
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

/** R2 — the search they already ran. */
const HookSearch: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 126, Easing.linear), 1.14, 1.24);
  const query = 'brown spots yellow ring???';
  const chars = Math.round(ramp(f, 4, 60, Easing.linear) * query.length);
  const caret = Math.floor(f / 8) % 2 === 0;
  const verdict = ramp(f, 78, 96);

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={push} brightness={0.62} />
      <AbsoluteFill style={{background: 'rgba(8,11,9,0.42)'}} />
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 800,
          background: 'rgba(250,249,246,0.95)',
          borderRadius: 26,
          padding: '30px 34px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            border: `5px solid ${C.secondaryText}`,
            flexShrink: 0,
          }}
        />
        <div style={{fontFamily: F.ui, fontSize: 44, color: C.ink, whiteSpace: 'pre'}}>
          {query.slice(0, chars)}
          {caret ? '|' : ' '}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 960,
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 96,
          lineHeight: 1.06,
          color: C.bone,
          opacity: verdict,
          transform: `translateY(${(1 - verdict) * 20}px)`,
          textShadow: '0 10px 40px rgba(0,0,0,0.75)',
        }}
      >
        You already tried that.
      </div>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

/** C2 — the right answer, stamped on a dying leaf. */
const HookCorrect: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(ramp(f, 0, 126, Easing.linear), 1.02, 1.22);
  const stamp = ramp(f, 8, 20, Easing.out(Easing.poly(4)));
  const word = ramp(f, 14, 30);
  const second = ramp(f, 76, 96);

  return (
    <AbsoluteFill style={{background: C.inkDeep}}>
      <Plate scale={push} />
      <AbsoluteFill style={{background: 'rgba(8,11,9,0.22)'}} />
      <div
        style={{
          position: 'absolute',
          left: 74,
          top: 720,
          width: 172,
          height: 172,
          borderRadius: 86,
          background: C.thriving,
          opacity: stamp,
          transform: `scale(${lerp(stamp, 1.6, 1)}) rotate(${lerp(stamp, -14, -6)}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.ui,
          fontSize: 108,
          fontWeight: 800,
          color: C.bone,
          boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
        }}
      >
        ✓
      </div>
      <div
        style={{
          position: 'absolute',
          left: 74,
          top: 940,
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 168,
          letterSpacing: '-0.04em',
          color: C.bone,
          opacity: word,
          textShadow: '0 10px 50px rgba(0,0,0,0.75)',
        }}
      >
        Correct.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 78,
          top: 1140,
          fontFamily: F.editorial,
          fontWeight: 700,
          fontSize: 88,
          color: C.struggling,
          opacity: second,
          transform: `translateY(${(1 - second) * 18}px)`,
          textShadow: '0 10px 40px rgba(0,0,0,0.8)',
        }}
      >
        Still dying.
      </div>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

/** Alternate close: lead with the free tier instead of the three verbs. */
const EndFree: React.FC = () => {
  const f = useCurrentFrame();
  const drift = lerp(ramp(f, 0, 120, Easing.linear), 1.0, 1.03);
  const a = ramp(f, 0, 18);
  const b = ramp(f, 14, 32);
  const c = ramp(f, 26, 44);

  return (
    <AbsoluteFill style={{background: C.bone}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(A('botanical-paper.jpg'))})`,
          backgroundSize: 'cover',
          opacity: 0.55,
          transform: `scale(${drift})`,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Img
          src={staticFile(A('cambium-icon.png'))}
          style={{width: 200, height: 200, borderRadius: 46, opacity: a, boxShadow: '14px 24px 60px rgba(27,32,25,0.24)'}}
        />
        <div
          style={{
            marginTop: 56,
            textAlign: 'center',
            fontFamily: F.editorial,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: C.ink,
            opacity: b,
          }}
        >
          Three scans free.
          <br />
          No account.
        </div>
        <div
          style={{
            marginTop: 66,
            fontFamily: F.ui,
            fontSize: 46,
            fontWeight: 650,
            color: C.bone,
            background: C.primary,
            padding: '26px 54px',
            borderRadius: 20,
            opacity: c,
          }}
        >
          Cambium on the App Store
        </div>
        <div style={{marginTop: 40, fontFamily: F.mono, fontSize: 34, color: C.secondaryText, opacity: c}}>
          getcambiumapp.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export type HookId = 'name' | 'spots' | 'search' | 'correct';
export type CtaId = 'verbs' | 'free';

// ── Film ────────────────────────────────────────────────────────────────────
export const Film: React.FC<{hook?: HookId; cta?: CtaId}> = ({hook = 'name', cta = 'verbs'}) => (
  <AbsoluteFill style={{background: C.inkDeep}}>
    {hook === 'name' ? (
      <>
        <Shot k="name"><ShotName /></Shot>
        <Shot k="nowWhat"><ShotNowWhat /></Shot>
      </>
    ) : (
      <Sequence from={0} durationInFrames={126} layout="none">
        {hook === 'spots' ? <HookSpots /> : hook === 'search' ? <HookSearch /> : <HookCorrect />}
      </Sequence>
    )}
    <Shot k="thesis"><ShotThesis /></Shot>
    <Shot k="scan"><ShotScan /></Shot>
    <Shot k="identify"><ShotIdentify /></Shot>
    <Shot k="score"><ShotScore /></Shot>
    <Shot k="evidence"><ShotEvidence /></Shot>
    <Shot k="cause"><ShotCause /></Shot>
    <Shot k="plan"><ShotPlan /></Shot>
    <Shot k="remind"><ShotRemind /></Shot>
    <Shot k="recheck"><ShotRecheck /></Shot>
    <Shot k="compare"><ShotCompare /></Shot>
    <Shot k="telling"><ShotTelling /></Shot>
    <Shot k="objections"><ShotObjections /></Shot>
    <Shot k="mark"><ShotMark /></Shot>
    <Shot k="end">{cta === 'free' ? <EndFree /> : <ShotEnd />}</Shot>

    <Sequence from={0} durationInFrames={960}>
      <Audio src={staticFile(A('bed.wav'))} volume={0.62} />
    </Sequence>
    <Sequence from={960} durationInFrames={390}>
      <Audio src={staticFile(A('lift.wav'))} volume={0.78} />
    </Sequence>
    <Sequence from={34} durationInFrames={20}>
      <Audio src={staticFile(A('soft-whoosh.wav'))} volume={0.5} />
    </Sequence>
    <Sequence from={196} durationInFrames={20}>
      <Audio src={staticFile(A('soft-whoosh.wav'))} volume={0.45} />
    </Sequence>
    <Sequence from={244} durationInFrames={10}>
      <Audio src={staticFile(A('camera-click.wav'))} volume={0.8} />
    </Sequence>
    <Sequence from={805} durationInFrames={10}>
      <Audio src={staticFile(A('camera-click.wav'))} volume={0.7} />
    </Sequence>
    <Sequence from={1065} durationInFrames={20}>
      <Audio src={staticFile(A('soft-whoosh.wav'))} volume={0.42} />
    </Sequence>
    <Sequence from={1155} durationInFrames={30}>
      <Audio src={staticFile(A('success-chime.wav'))} volume={0.55} />
    </Sequence>
  </AbsoluteFill>
);

export const Ad: React.FC = () => <Film />;
export const AdHookSpots: React.FC = () => <Film hook="spots" />;
export const AdHookSearch: React.FC = () => <Film hook="search" />;
export const AdHookCorrect: React.FC = () => <Film hook="correct" />;
export const AdCtaFree: React.FC = () => <Film cta="free" />;
