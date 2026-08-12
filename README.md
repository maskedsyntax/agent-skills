# codex-skills

Reusable Codex skills for development, release automation, research, and other workflows.

## Skills

### xcode-cloud-release

Prepare, validate, and ship Apple-platform applications using Xcode Cloud and App Store Connect.

Supports project discovery, build validation, versioning checks, CI preparation, signing diagnostics, TestFlight workflows, and App Store release preparation.

[Documentation →](xcode-cloud-release/README.md)

## Installation

Install a skill for all repositories:

```sh
mkdir -p ~/.agents/skills
cp -R <skill-name> ~/.agents/skills/
```

Or install it into a single repository:

```sh
mkdir -p .agents/skills
cp -R <skill-name> .agents/skills/
```

Then invoke it in Codex:

```
$<skill-name> <your request>
```

## License

[MIT](LICENSE)
