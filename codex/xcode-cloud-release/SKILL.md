---
name: xcode-cloud-release
description: Prepare, validate, and ship an Apple-platform app (iOS, iPadOS, macOS, watchOS, tvOS, visionOS) through Xcode Cloud and App Store Connect. Use when the user asks to release, upload, distribute, archive, prepare TestFlight or App Store builds, increment build numbers, troubleshoot Xcode Cloud CI, or make a repository ready for an Xcode Cloud workflow. Do not use for ordinary feature development that does not involve CI, signing, distribution, TestFlight, or App Store Connect.
---

# Xcode Cloud Release

Own the repository-side release workflow for an Apple-platform project while treating Xcode Cloud and App Store Connect as the distribution system.

Everything about the project — schemes, targets, identifiers, versions, platforms, branches — is **discovered from the repository at invocation time**. Never assume values from a previous project, and never carry values between runs.

## Workflow

```
Inspect project → Discover configuration → Check Git state → Validate scheme/targets
→ Local xcodebuild validation → Tests when available → Version/build number check
→ Prepare repository for Xcode Cloud → Signing diagnostics (no credential exposure)
→ Commit/push only when explicitly requested
→ Xcode Cloud archives, signs, distributes → App Store Connect / TestFlight
```

## 1. Discover the project

Do this before changing anything. Discover, do not assume.

```bash
git status --short --branch
git rev-parse --show-toplevel
```

Find the project container and dependency tooling:

```bash
find . -maxdepth 3 -name '*.xcworkspace' -o -maxdepth 3 -name '*.xcodeproj' \
  -o -maxdepth 2 -name 'Package.swift' -o -maxdepth 2 -name 'Podfile' \
  -o -maxdepth 2 -name 'Project.swift' | grep -v '\.xcodeproj/project.xcworkspace'
```

Then list schemes and targets using whichever container applies:

```bash
xcodebuild -list -workspace <Discovered>.xcworkspace
# or
xcodebuild -list -project <Discovered>.xcodeproj
```

Rules for choosing the container and scheme:

- If a CocoaPods `Podfile` or a multi-project workspace exists, use the `.xcworkspace`.
- Otherwise use the `.xcodeproj`.
- For a generated project (Tuist, XcodeGen, Swift Package Manager plugins), run the generation step first and treat generated files as build output, not as things to hand-edit.
- Identify the **application** scheme intended for distribution — not test, framework, package, or example schemes. If several application schemes exist, ask which one is the release scheme rather than guessing.

Read the current build settings from the discovered scheme/target instead of hard-coding them:

```bash
xcodebuild -showBuildSettings -scheme <DiscoveredScheme> \
  -workspace <Discovered>.xcworkspace 2>/dev/null | \
  grep -E 'PRODUCT_BUNDLE_IDENTIFIER|MARKETING_VERSION|CURRENT_PROJECT_VERSION|DEVELOPMENT_TEAM|CODE_SIGN_STYLE|SUPPORTED_PLATFORMS|.*DEPLOYMENT_TARGET|PRODUCT_NAME'
```

From this establish: bundle identifier, marketing version, build number, signing style, team configuration, supported platforms, deployment targets, and product name.

Also check:

- whether the release scheme is **shared** (`<container>/xcshareddata/xcschemes/`)
- test targets present in the scheme
- existing `ci_scripts/`
- release branches: `git branch -a`, plus any default branch recorded in the remote

## 2. Respect existing repository instructions

Before proposing changes, read whatever the repository already documents and follow it:

`AGENTS.md`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `fastlane/Fastfile`, `Package.swift`, `Podfile`, Tuist configuration, `ci_scripts/`, `.github/workflows/`.

If the repository has an established release process, extend it. Do not replace an existing workflow with a preferred one; if the existing workflow conflicts with Xcode Cloud, explain the conflict and let the user decide.

## 3. Protect existing production apps

Treat the app as one that may already be live with real users. Never automatically:

- change the bundle identifier
- change the Apple Developer Team ID or create a new app identity
- reset or rewrite signing configuration
- remove or weaken entitlements or capabilities
- change App Groups, Keychain Access Groups, CloudKit containers, associated domains, or push notification environments
- change StoreKit product or subscription identifiers
- alter persisted-data identifiers (Core Data / SwiftData store names, container identifiers, UserDefaults suites)
- raise or lower deployment targets
- force-push or rewrite Git history
- print, commit, or otherwise expose credentials

If one of these genuinely appears necessary, **stop that change and explain the issue**, including what would break for existing users. The user decides.

## 4. Validate locally

Run the smallest useful build for the discovered scheme, on a destination matching a platform the project actually supports.

```bash
xcodebuild \
  -workspace <Discovered>.xcworkspace \
  -scheme <DiscoveredScheme> \
  -configuration Debug \
  -destination '<destination matching a supported platform>' \
  CODE_SIGNING_ALLOWED=NO \
  build
```

Pick the destination from `SUPPORTED_PLATFORMS`. Generic destinations avoid depending on a specific installed simulator:

| Platform | Destination |
| --- | --- |
| iOS / iPadOS | `generic/platform=iOS Simulator` |
| macOS | `platform=macOS` |
| watchOS | `generic/platform=watchOS Simulator` |
| tvOS | `generic/platform=tvOS Simulator` |
| visionOS | `generic/platform=visionOS Simulator` |

For a multiplatform app, validate the platform the release targets; validate others only if the user asks.

Run the scheme's tests when test targets exist (`xcodebuild test` with the same destination). Never report tests as passing if they were not run, and never report a build as clean if it was skipped.

`CODE_SIGNING_ALLOWED=NO` is acceptable for local simulator validation only. Never disable signing in the Release/Archive configuration to make CI pass.

## 5. Versioning

Change version numbers only when the user asked to prepare a new build or release. Show the current values before changing them.

- `MARKETING_VERSION` — user-visible version (e.g. `1.4.2`)
- `CURRENT_PROJECT_VERSION` — build number (e.g. `87`)

Rules:

- Never decrement a build number.
- Use `agvtool` only if the project is already configured for Apple Generic Versioning; do not introduce a new versioning system during a release.
- If the project derives versions from a script, `.xcconfig`, or `Info.plist`, edit at that source of truth, not in a second place.
- If the next valid App Store Connect build number is unknown, apply a clearly stated local increment and say it was not verified against App Store Connect. Do not invent a number and claim it is valid.
- Xcode Cloud can supply `CI_BUILD_NUMBER`; if the project already uses it, do not also bump the number in the repository.

## 6. Prepare the repository for Xcode Cloud

**Shared scheme.** Xcode Cloud can only build shared schemes. If the release scheme is not shared, share it through normal Xcode scheme configuration and commit the resulting file under `xcshareddata/xcschemes/`. Never commit anything from `xcuserdata/`.

**Custom scripts.** Xcode Cloud runs `ci_scripts/ci_post_clone.sh`, `ci_scripts/ci_pre_xcodebuild.sh`, and `ci_scripts/ci_post_xcodebuild.sh` from the repository root. Add one only when the project actually needs it (dependency tooling, project generation, non-default setup). Any script must:

1. use a portable shebang (`#!/bin/sh` or `#!/bin/bash`)
2. set strict error handling (`set -e`, or stricter)
3. read secrets from environment variables — never hard-code or echo them
4. be committed executable (`chmod +x`)
5. install dependencies deterministically (respect lockfiles)

Do not create an empty or ceremonial `ci_scripts/` directory.

**Dependencies.** Ensure resolved dependency state is committed as the project's convention expects (`Package.resolved`, `Podfile.lock`), so cloud builds resolve reproducibly.

## 7. Secrets

The repository must never contain App Store Connect API keys (`.p8`), certificates, provisioning profiles, passwords, tokens, service-account credentials, or private environment files. Check that any newly added files and `.gitignore` respect this.

When a secret is required, state the exact environment-variable **name** the repository expects and tell the user to set its **value** as a secret environment variable in the Xcode Cloud workflow. Never place the value in the repository, and never print a secret's value in output or logs.

## 8. Signing diagnostics

Prefer Xcode Cloud managed signing for distribution unless the repository already has an established manual-signing workflow.

When signing fails, diagnose without modifying identity: Apple Developer team configuration, bundle identifier registration, capabilities/entitlements matching the App ID, signing style (automatic vs manual), certificate and profile expectations, and App Store Connect/Xcode Cloud permissions. Report the cause; do not generate, export, or install credentials unless explicitly asked.

## 9. Xcode Cloud workflow design

When asked how to configure the workflow, recommend the smallest useful setup and name the discovered values:

- **Start condition:** the repository's actual release branch, a tag pattern, or a manual start. Determine the intended release branch from the repository; ask when ambiguous. Do not assume every push to the default branch should produce a production candidate.
- **Environment:** a stable Xcode version compatible with the project's deployment targets and Swift version.
- **Actions:** Build → Test (if test targets exist) → Archive.
- **Distribution:** App Store Connect, TestFlight first unless the user says otherwise.

Always separate clearly:

- what was changed **in the repository**
- what the user must still configure in **Xcode / App Store Connect / Xcode Cloud** (workflow creation, environment secrets, TestFlight groups, distribution settings, app record)

Repository changes alone cannot create server-side Xcode Cloud settings. Do not imply otherwise.

## 10. Git behavior

Before any commit: show `git diff --stat`, inspect the actual diff, confirm no secret or `xcuserdata` file is included, and re-run the relevant validation. Do not discard or sweep up unrelated user changes.

Commit or push only when the user explicitly asked for it in the current task. If pushing: confirm the intended branch, never force-push, never rewrite published history, and push only after validation succeeds unless the user accepts a known failure.

A push may satisfy an Xcode Cloud start condition, but do not claim a cloud build started or succeeded unless that was actually verified.

## 11. Troubleshooting Xcode Cloud failures

Given a failing log:

1. Find the **first** meaningful failure, not the trailing cascade.
2. Classify it: dependency resolution, scheme/target visibility, compile, test, custom script, signing, archive/export, or environment/Xcode-version mismatch.
3. Reproduce locally with `xcodebuild` where possible.
4. Make the smallest fix.
5. Re-run the narrow local check.
6. State explicitly what could not be reproduced locally.

Common causes: the scheme is not shared; a generated project was not generated before `xcodebuild`; a CocoaPods project was built via the project instead of the workspace; a script is missing the executable bit; a required environment secret is unset. For SPM, avoid resetting packages unless resolution is genuinely the problem.

## Final response format

Keep the report short and concrete.

**Release state** — what is ready and what is not.
**Validated** — commands and checks that actually passed.
**Changed** — files and version changes.
**Xcode Cloud** — server-side configuration still required.
**Next action** — the single next step for the user.

Never claim a build, upload, TestFlight processing step, review submission, or App Store release succeeded unless it was actually verified.
