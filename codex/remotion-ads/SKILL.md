---
name: remotion-ads
description: Create cinematic Remotion product ads end-to-end for any software project. Use when the user runs $remotion-ads, ad ., or asks to make a product ad, promo video, social ad, App Store preview, Remotion commercial, hook, storyboard, or performance creative.
license: MIT
metadata:
  author: maskedsyntax
  version: "1.0"
---

# remotion-ads (Codex)

This file is a thin adapter. The full workflow lives in the shared skill.

1. Run `ad --print-paths`, or `resolve.sh` in this folder if `ad` is not on PATH.
2. Read `$SKILL_ROOT/SKILL.md` immediately.
3. Follow every phase there. Load `references/` only as directed.
4. Implement in `$STUDIO_ROOT`. Write campaign files to the product `marketing/ads/` directory.

Do not ask the user to paste strategy, critic, or Remotion files.
Do not duplicate this workflow in a new document.
Do not install Remotion inside the product repository.

If `ad` is missing, tell the user to run `scripts/install.sh` from the agent-skills repo, then continue using the resolved `SKILL_ROOT` from this checkout (`../../shared/remotion-ads` relative to this file).
