# Remotion implementation

Work in the shared studio. Do not scaffold a new Remotion app in the product repo.

```text
$STUDIO_ROOT/
  src/primitives/     reusable cinematic parts
  src/projects/<id>/  this campaign
  public/<id>/        this campaign's assets
  renders/<id>/       outputs
```

## Register a campaign

`src/projects/<id>/index.ts` exports:

```ts
export const project = {
  id: '<id>',
  component: Ad,
  durationInFrames: 450, // 15s * 30fps
  fps: 30,
  width: 1080,
  height: 1920,
};
```

Then:

```bash
"$SKILL_ROOT/scripts/generate-registry.sh"
```

## Primitives

Import from `../../primitives`:

| Primitive | Use for |
| --- | --- |
| `Camera` / `useCameraPath` | x/y/scale/rotate/tilt/perspective/blur |
| `Phone` / `MacWindow` / `BrowserWindow` | device chrome around real UI |
| `MacroShot` | extreme crop |
| `ScreenRecording` | real video assets |
| `ParallaxLayer` | depth |
| `KineticText` | huge type |
| `SplitScreen` | one contrast, not a layout system |
| `Cursor` / `Tap` | simulated interaction |
| `Spotlight` / `Focus` | attention |
| `MatchCut` / `MaskTransition` | graphic cuts |
| `BeforeAfter` | honest deltas |
| `ReviewCard` | **real** reviews only |
| `SoundHit` | timed audio accents |

Build a new primitive in `src/primitives/` when a campaign needs one more than once.

## Motion

```ts
import {interpolate, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
```

Prefer `interpolate` + `Easing`. Use `spring` when the strategy wants organic settle (feel-good, some UI). FOMO/challenge should feel edited, not physics-simulated.

Map strategy → motion in `src/lib/motion.ts` (`motionFor('chaos-calm')`, etc).

## Assets

Put files in `public/<id>/` and load with `staticFile('<id>/shot-home.png')`.

Never reference absolute machine paths inside compositions.

## Render

```bash
ad --render <id>
ad --still <id> 0
```

Review frames:

```bash
"$SKILL_ROOT/scripts/review-frames.sh" --id <id> --duration 15
```

## Quality bar before first render

- At least one extreme crop and one pull-out or push-in
- Device is not locked center-frame for the full duration
- Type is 2–7 words when present
- No unverified claims
- Composition id matches campaign slug
