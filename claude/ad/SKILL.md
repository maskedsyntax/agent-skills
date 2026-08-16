---
name: ad
description: Create a cinematic Remotion product ad for this repository. Use when the user runs /ad, asks for a product ad, promo video, social ad, App Store preview, Remotion commercial, hook, storyboard, or performance creative.
argument-hint: "[path] [--duration 15] [--format vertical] [--strategy name] [--variants 3] [--concepts-only] [--no-render]"
---

# /ad

You are invoking the shared **remotion-ads** skill.

## Locate the canonical skill

```
!`${CLAUDE_SKILL_DIR}/resolve.sh`
```

If that output is empty, run `ad --print-paths` from PATH.

Then **immediately read** `$SKILL_ROOT/SKILL.md` and follow every phase.

Do not invent a parallel workflow.
Do not ask the user to paste `strategies.md`, `critic.md`, or Remotion instructions.
Load supporting files from `$SKILL_ROOT/references/` only when a phase needs them.

## Target

- Default product repo: `${CLAUDE_PROJECT_DIR}`
- If `$ARGUMENTS` starts with a path, that path is the product repo
- Remaining tokens are workflow options (`--duration`, `--format`, `--strategy`, `--variants`, `--campaign`, `--concepts-only`, `--no-render`)

Arguments: $ARGUMENTS

## Implementation home

All Remotion work happens in `$STUDIO_ROOT`. Campaign metadata is written back to `$PRODUCT_ROOT/marketing/`.
