# Product intelligence

Do not summarize the README and stop. Understand what the product actually does.

## Scan first

```bash
ad --inspect "$PRODUCT_ROOT"
```

Then open the highest-signal files from that inventory.

## Read in this order

1. Root `README` / landing copy / store listing — claimed positioning
2. App entry, navigation, information architecture — what users actually see
3. Onboarding, empty states, first-run — the intended aha
4. Core feature implementations — the real workflow
5. Paywall, pricing, entitlements — what is sold
6. Settings, privacy, accounts — trust constraints
7. Screenshots, recordings, icons, marketing folders — visual truth
8. Existing `marketing/` files — preserve human intent
9. Previous ads — do not repeat a failed angle blindly

## Infer

- What it does in one concrete sentence
- Who it is for (primary and secondary)
- The problem in the user's words
- The outcome they want, not the feature they tap
- Differentiators that a viewer can **see**
- Strongest 3–8 second demo moment
- Buying objections
- Weak angles (generic productivity, fake urgency, feature laundry lists)
- Strong angles (specific job, specific emotion, specific visual)

## Platform clues

| Signal | Likely product |
| --- | --- |
| `*.xcodeproj`, `*.xcworkspace` | Native Apple app |
| `pubspec.yaml` + `lib/` | Flutter |
| `package.json` + `app/` or `src/` with React Native / Expo | Mobile JS |
| `next.config.*`, `app/`, marketing site | Web / SaaS |
| `Cargo.toml`, `go.mod`, CLI READMEs | Developer tool |

Use the real UI chrome: phone for mobile, browser/mac window for web/desktop. Do not put a CLI in a fake iPhone unless that is how users actually use it.

## Strongest demo moment

Prefer a moment that shows a **result**, not a settings screen.

Examples: a processed photo appearing, a task completing, a messy inbox becoming a single next action, a generated output replacing a blank page.

If no recording exists, plan a simulated interaction (scroll, tap, cursor) over real screenshots. Do not invent a customer dashboard full of fake metrics.

## Write-up

Put the synthesis into `marketing/PRODUCT.md` and `marketing/AUDIENCE.md`. Keep it specific. Ban: "intuitive", "powerful", "seamless", "next-generation", "all-in-one" unless you can point to a concrete behavior.
