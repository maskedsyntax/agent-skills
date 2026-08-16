# xcode-cloud-release

A Codex skill for preparing, validating, and shipping Apple-platform applications through **Xcode Cloud** and **App Store Connect**.

It treats Xcode Cloud as the system that archives, signs, and distributes your app, and takes ownership of everything on the repository side that has to be correct before that can work.

## What it does

- Discovers the project's real configuration: `.xcodeproj` / `.xcworkspace`, schemes, application targets, bundle identifier, marketing version, build number, signing style, team configuration, supported platforms, and deployment targets
- Checks Git state and identifies the intended release branch
- Runs the smallest useful local `xcodebuild` validation for a platform the project actually supports
- Runs the scheme's tests when test targets exist
- Reviews and safely increments version and build numbers
- Prepares the repository for Xcode Cloud: shared schemes, `ci_scripts/` hooks, committed dependency lockfiles
- Diagnoses signing problems without touching your app identity or credentials
- Reports exactly what still has to be configured in Xcode Cloud and App Store Connect
- Troubleshoots failing Xcode Cloud builds from their logs

Supported platforms: **iOS, iPadOS, macOS, watchOS, tvOS, visionOS** — whichever the underlying Xcode project supports.

## When to use it

Use it when you are releasing or distributing: preparing a TestFlight or App Store build, bumping a build number, making a repository Xcode Cloud-ready, or debugging an Xcode Cloud workflow failure.

Do not use it for ordinary feature development that has nothing to do with CI, signing, or distribution.

## Installation

Install for all repositories:

```sh
mkdir -p ~/.agents/skills
cp -R codex/xcode-cloud-release ~/.agents/skills/
```

Or install into a single repository:

```sh
mkdir -p .agents/skills
cp -R codex/xcode-cloud-release .agents/skills/
```

## Example prompts

```
$xcode-cloud-release Prepare this project for the next TestFlight build.
```

```
$xcode-cloud-release Validate whether this project is ready for Xcode Cloud.
```

```
$xcode-cloud-release Prepare the next release build, increment the build number safely,
validate it, and tell me what remains to configure in Xcode Cloud.
```

```
$xcode-cloud-release This Xcode Cloud build failed. Here is the log — find the real cause.
```

## Safety philosophy

The skill assumes your app may already be live on the App Store with real users, so it is deliberately conservative. It will **never** automatically:

- change the bundle identifier or Apple Developer Team ID
- create a new application identity
- reset signing configuration, or remove entitlements or capabilities
- change App Groups, Keychain Access Groups, CloudKit containers, associated domains, or push notification environments
- change StoreKit product or subscription identifiers
- alter persisted-data identifiers
- change deployment targets
- force-push or rewrite Git history
- expose credentials

If one of those changes genuinely looks necessary, it stops and explains the problem instead of making the change.

It also assumes nothing about your setup: values come from the repository it is invoked in, not from defaults. And it respects what your repository already documents — `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, `Fastfile`, `Package.swift`, `Podfile`, Tuist configuration, `ci_scripts/` — rather than overriding an established workflow.

Commits and pushes happen only when you explicitly ask for them.

## Credentials

The skill contains no credentials and will not put any in your repository — no `.p8` keys, certificates, provisioning profiles, API keys, passwords, or tokens.

When a secret is needed, it tells you the environment-variable *name* the repository expects and asks you to set its *value* as a secret environment variable in the Xcode Cloud workflow.

## Xcode Cloud requirements

Before Xcode Cloud can build your project you need:

- an Apple Developer Program membership with Xcode Cloud access
- an app record in App Store Connect (for TestFlight or App Store distribution)
- the repository connected to Xcode Cloud as a source-code provider
- a **shared** scheme for the application target
- an Xcode Cloud workflow with a start condition, environment, and actions

## What it can and cannot automate

| The skill can | You still do |
| --- | --- |
| Discover and validate project configuration | Create the Xcode Cloud workflow |
| Build and test locally | Choose the start condition and Xcode version |
| Bump version and build numbers | Set secret environment variables in Xcode Cloud |
| Share schemes and commit them | Create or manage the App Store Connect app record |
| Write `ci_scripts/` hooks | Configure TestFlight groups and testers |
| Diagnose signing configuration | Manage certificates, profiles, and capabilities in the Developer portal |
| Commit and push when you ask | Submit for App Store review |

## License

See the repository `LICENSE`.
