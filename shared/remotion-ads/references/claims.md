# Claims

A claim is any statement a viewer could take as fact.

If it is not in `CLAIMS.md` → **Verified**, it does not go on screen.

## Classes

### Verified

Supported by the repository, official store listing, or evidence the user supplied in this session.

Examples: platforms the project builds, features that exist in code, prices in the repo or listing, "no account" when auth is absent, "works offline" when the app is local-first.

### Requires evidence

Tempting marketing lines that are not yet proven.

Examples: "loved by thousands", "saves 4 hours a week", "the fastest way", "#1 on the App Store".

Move these here. Do not use them.

### Prohibited / unsupported

Do not write, imply, or stage:

- user counts, downloads, MAU
- star ratings, review quotes, testimonials
- revenue, valuation, growth rates
- conversion, retention, success percentages
- productivity / time-saved numbers
- scarcity ("only 3 left", fake countdown)
- awards, press logos, "as seen in"
- competitor scores you cannot source
- medical, financial, or legal guarantees

## Visual claims count

A 4.9-star badge, a wall of avatars, a "12,403 teams" ticker, or a fake TestimonialCard is a claim. Same rule.

`ReviewCard` in the studio is for **real** reviews the user provided. If none exist, do not use it.

## Safe substitutes

- Show the product doing the job
- Quote the viewer's own frustration (relatable, not attributed to a named customer)
- Use verbs the UI actually performs
- Price only if it is in the repo or the user stated it

## Gate

Before implementation, list every on-screen sentence and badge. Check each against `CLAIMS.md`. Rewrite failures. Do this again after the critic pass.
