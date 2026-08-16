# agent-skills

Reusable agent skills for Codex, Grok, Claude, OpenCode, and other coding agents.

Skills that share a lot of knowledge live in `shared/`. Agent folders (`claude/`, `codex/`) hold thin adapters so each tool can invoke the same workflow.

## Skills

### remotion-ads

Create cinematic Remotion product ads end-to-end from any software repository.

Inspects the product, writes a marketing brief, ranks strategies, storyboards, implements in a shared Remotion studio, renders, critiques, and revises.

| Interface | How |
| --- | --- |
| CLI | `ad .` |
| Claude Code | `/ad` |
| Codex | `$remotion-ads` |

[Documentation →](shared/remotion-ads/README.md)

### Codex

#### xcode-cloud-release

Prepare, validate, and ship Apple-platform applications using Xcode Cloud and App Store Connect.

Supports project discovery, build validation, versioning checks, CI preparation, signing diagnostics, TestFlight workflows, and App Store release preparation.

[Documentation →](codex/xcode-cloud-release/README.md)

## Installation

### remotion-ads

```sh
./scripts/install.sh
```

Then, from any product repo:

```sh
ad .
```

### Other skills

Install a skill for all repositories:

```sh
mkdir -p ~/.agents/skills
cp -R <agent>/<skill-name> ~/.agents/skills/
```

Or install it into a single repository:

```sh
mkdir -p .agents/skills
cp -R <agent>/<skill-name> .agents/skills/
```

Then invoke it in your agent:

```
$<skill-name> <your request>
```

Shared skills should be installed with `scripts/install.sh` so Claude, Codex, and the `ad` CLI all point at the same files.

## License

[MIT](LICENSE)
