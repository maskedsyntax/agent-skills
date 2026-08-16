# remotion-ads

A reusable skill that turns any software repository into a cinematic Remotion product ad.

One command from a product repo:

```sh
ad .
```

In Claude Code:

```text
/ad
```

In Codex:

```text
$remotion-ads
```

The agent inspects the product, writes a marketing brief, picks a strategy, storyboards, implements in a **shared** Remotion studio, renders, critiques, revises, and produces hook variants.

## Install / setup (once)

From this `agent-skills` checkout:

```sh
./scripts/install.sh
```

That will:

- record this repo in `~/.config/agent-skills/home`
- symlink `ad` to `~/.local/bin/ad`
- symlink Claude skill `~/.claude/skills/ad` → `/ad`
- symlink Codex skill `~/.codex/skills/remotion-ads`
- symlink `~/.agents/skills/remotion-ads`

Ensure `~/.local/bin` is on your `PATH`.

No API keys. The first render runs `npm install` inside `ad-studio/`.

## Basic usage

```sh
ad .
ad . --duration 8
ad . --format horizontal
ad . --strategy demo
ad . --variants 3
ad . --concepts-only
ad . --no-render
```

Helpers (no agent):

```sh
ad --print-paths
ad --inspect .
ad --scaffold .
ad --studio
ad --render smoke-test
```

## Output

**In the product repo**

```text
marketing/
  PRODUCT.md
  AUDIENCE.md
  CLAIMS.md
  ads/<campaign>/
    brief.md
    strategy.md
    hooks.md
    concepts.md
    storyboard.md
    asset-audit.md
    critique.md
    manifest.json
```

**In this repo (shared studio)**

```text
ad-studio/src/projects/<campaign>/
ad-studio/public/<campaign>/
ad-studio/renders/<campaign>/
```

## Architecture

| Piece | Location |
| --- | --- |
| Orchestration | `shared/remotion-ads/SKILL.md` |
| Strategies | `shared/remotion-ads/references/strategies.md` |
| Critique | `shared/remotion-ads/references/critic.md` |
| Cinematic rules | `shared/remotion-ads/references/cinematic-rules.md` |
| Remotion notes | `shared/remotion-ads/references/remotion.md` |
| Templates | `shared/remotion-ads/templates/` |
| CLI | `bin/ad` |
| Remotion primitives | `ad-studio/src/primitives/` |
| Generated campaigns | `ad-studio/src/projects/` + product `marketing/ads/` |
| Claude adapter | `claude/ad/SKILL.md` |
| Codex adapter | `codex/remotion-ads/SKILL.md` |

One source of truth. Agent folders are thin adapters.

## Defaults

15s · 9:16 · 1080×1920 · 30fps · performance social · one concept · three hook variants.

## Safety

The skill will not invent users, ratings, testimonials, revenue, downloads, or fake urgency. It treats the app UI as a filmed subject, not a slide.
