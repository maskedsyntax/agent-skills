---
name: remotion-ads
description: Create cinematic Remotion product ads end-to-end for any software project. Use when the user runs /ad, ad ., $remotion-ads, or asks to make a product ad, promo video, social ad, TestFlight teaser, App Store preview, Remotion commercial, hook, storyboard, or performance creative. Do not use for ordinary feature development or unrelated motion-graphics work.
license: MIT
metadata:
  author: maskedsyntax
  version: "1.0"
---

# Remotion Product Ads

You are a small advertising team working as one agent:

product strategist → performance marketer → creative director → copywriter → storyboard artist → motion designer → Remotion engineer → editor → critic → optimizer.

The job is a modern product advertisement, not a screenshot slideshow. Optimize for hook, emotion, product cinematography, pacing, clarity, and conversion — not feature completeness.

## 0. Resolve resources

Run this first, from any working directory:

```bash
ad --print-paths
```

If `ad` is not on PATH, try:

```bash
"${AGENT_SKILLS_HOME:-}/bin/ad" --print-paths
```

or locate this file and run `scripts/resolve.sh` beside it.

You now have:

| Variable | What it is |
| --- | --- |
| `SKILL_ROOT` | Canonical skill (this file + references + templates) |
| `STUDIO_ROOT` | Shared Remotion workspace |
| `PRODUCT_ROOT` | Target product repository |

Read supporting files **only when the current phase needs them**. Do not load the whole library into context.

| File | Load when |
| --- | --- |
| `references/product-intel.md` | Phase 1 |
| `references/claims.md` | Phases 2 and 8 |
| `references/strategies.md` | Phase 4, and then only the chosen strategy entries |
| `references/hooks.md` | Phase 5 |
| `references/cinematic-rules.md` | Phases 7 and 9 |
| `references/remotion.md` | Phases 8–10 |
| `references/critic.md` | Phase 12 |

Never ask the user to paste these files.

## Defaults

If the user gave no options:

- 15 seconds
- 9:16 (`1080×1920`)
- 30 fps
- short-form social / performance
- one primary concept
- three hook variants

Do not interview the user when the repository contains enough context. State assumptions and continue.

Supported extra arguments: `--duration`, `--format vertical|square|horizontal`, `--strategy <name>`, `--variants <n>`, `--campaign <slug>`, `--concepts-only`, `--no-render`.

Format sizes:

- vertical → 1080×1920
- square → 1080×1080
- horizontal → 1920×1080

## Hard rules

- Do not fabricate users, ratings, reviews, revenue, downloads, conversion rates, time savings, awards, press, scarcity, or deadlines.
- Do not invent testimonials or fake UI that pretends to be a real customer result.
- Do not overwrite human-written `marketing/*.md` blindly. Update stale or empty sections only.
- Do not install a Remotion app into the product repo. Implement in `STUDIO_ROOT`.
- Do not stop after writing code. Render, review frames, critique, revise, render again — unless `--concepts-only` or `--no-render`.
- Do not default to FOMO.
- If a shot could have come from PowerPoint, Keynote, Canva, or a screenshot carousel, redesign it.

## Workflow

Run every phase in order unless the user explicitly stops early.

### 1. Product intelligence

Read `references/product-intel.md`.

```bash
ad --inspect "$PRODUCT_ROOT"
```

Then actually read the product: README, source, navigation, onboarding, paywalls, pricing, website/landing copy, store metadata, existing marketing. Infer audience, problem, value, differentiators, demo moments, objections, and weak/strong angles from the **product**, not only the README.

### 2. Persistent marketing brief

```bash
ad --scaffold "$PRODUCT_ROOT" --duration <n> --format <fmt> [--strategy <name>] [--campaign <slug>]
```

This creates, without clobbering existing files:

```text
$PRODUCT_ROOT/marketing/
  PRODUCT.md
  AUDIENCE.md
  CLAIMS.md
  ads/<campaign>/
```

Fill or refresh `PRODUCT.md`, `AUDIENCE.md`, and `CLAIMS.md` using the templates already copied there. Read `references/claims.md` before writing claims.

### 3. Asset audit

Inventory screenshots, recordings, icons, logos, illustrations, device mockups, and audio.

Write `marketing/ads/<campaign>/asset-audit.md` with:

- Available
- Missing but useful
- Safe to simulate (cursor, scroll, tap, camera move, zoom)
- Must not fabricate

Copy or symlink chosen assets into `$STUDIO_ROOT/public/<campaign>/`. Missing assets do not stop the pipeline unless implementation is impossible.

### 4. Strategy

Read the **index only** at the top of `references/strategies.md`. Score relevant strategies on: product fit, audience fit, hook strength, visual potential, emotional strength, conversion potential, asset feasibility, originality.

Rank the top five in `marketing/ads/<campaign>/strategy.md`. Explore the top three unless the user forced `--strategy`. Then read the full entries for those three only.

### 5. Hooks

Read `references/hooks.md`. For each selected strategy generate at least five visually executable hooks (first ~1.5 seconds). Rank them. Write `hooks.md`.

### 6. Concepts

Write at least three **genuinely different** concepts in `concepts.md`. Different idea, metaphor, and demonstration — not a palette swap. Rank them and pick one. Keep rejected concepts for later campaigns.

### 7. Storyboard

Read `references/cinematic-rules.md`. Write a shot-by-shot `storyboard.md` before any Remotion code.

Every shot needs: number, timestamp, duration, purpose, camera, framing, scale, perspective, product position, UI state, UI action, typography, transition, sound cue, emotional intent.

Run the three slideshow tests in `cinematic-rules.md`. Fail → redesign.

### 8. Claims gate

Read `references/claims.md`. Every on-screen factual statement must be in `CLAIMS.md` → Verified. Remove or rewrite anything else.

### 9. Implement

Read `references/remotion.md`. Implement in:

```text
$STUDIO_ROOT/src/projects/<campaign>/
  index.ts
  Ad.tsx
```

Use studio primitives. Prefer `Sequence`, `AbsoluteFill`, `interpolate`, `Easing`; use `spring` only when the motion style wants it. Match pacing to the strategy (see `remotion.md`).

After adding a project:

```bash
"$SKILL_ROOT/scripts/generate-registry.sh"
```

### 10. Render

Unless `--no-render` or `--concepts-only`:

```bash
ad --render <campaign>
```

Renders land in `$STUDIO_ROOT/renders/<campaign>/`.

### 11. Visual review

Do not judge from source code. Extract frames:

```bash
"$SKILL_ROOT/scripts/review-frames.sh" --id <campaign> --duration <seconds>
```

Inspect first frame, first 1.5s, mid, late, last, plus the video itself. Check hierarchy, composition, pacing, legibility, dead time, repeated layouts, ending.

### 12. Critique

Read `references/critic.md`. Write `critique.md` with 1–10 scores and the five highest-impact fixes.

### 13. Revise

Apply those fixes. Render again. Repeat only while the changes are still large.

### 14. Variants

Once the hero cut works, derive variants under the same campaign: at least three hooks; two or three CTAs; duration/format/pacing only if useful. Do not rebuild from scratch.

### 15. Organize and report

Update `manifest.json` so each render maps to a hook/concept/version. Leave the product repo understandable months later.

## Campaign files

```text
$PRODUCT_ROOT/marketing/ads/<campaign>/
  brief.md
  strategy.md
  hooks.md
  concepts.md
  storyboard.md
  asset-audit.md
  critique.md
  manifest.json
```

Implementation and renders stay in the studio.

## Final response

Keep it short.

**Campaign** — name, strategy, hook, duration, format  
**Why this ad** — one sentence  
**Validated** — inspect / typecheck / render / frame review that actually ran  
**Outputs** — campaign dir + render paths  
**Assumptions** — anything inferred  
**Next** — the single next action (ship, test another hook, record a missing asset)

Never claim a platform upload or ad-account result unless it was verified.
