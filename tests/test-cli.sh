#!/usr/bin/env bash
# Validate path resolution and helpers from outside the repo.
set -euo pipefail

REPO=$(cd "$(dirname "$0")/.." && pwd)
AD="$REPO/bin/ad"
FAIL=0

assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if printf '%s' "$haystack" | grep -q "$needle"; then
    echo "ok  $label"
  else
    echo "fail  $label"
    echo "  missing: $needle"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}

echo "== resolve from /tmp via absolute CLI =="
OUT=$(cd /tmp && "$AD" --print-paths)
assert_contains "$OUT" "AGENT_SKILLS_HOME=$REPO" "home from script location"
assert_contains "$OUT" "SKILL_ROOT=$REPO/shared/remotion-ads" "skill root"
assert_contains "$OUT" "STUDIO_ROOT=$REPO/ad-studio" "studio root"
assert_contains "$OUT" "PRODUCT_ROOT=" "prints product root"
assert_contains "$OUT" "CLAUDE_SKILL=$REPO/claude/ad" "claude adapter"
assert_contains "$OUT" "CODEX_SKILL=$REPO/codex/remotion-ads" "codex adapter"

echo "== resolve via AGENT_SKILLS_HOME =="
OUT=$(cd /tmp && AGENT_SKILLS_HOME="$REPO" "$AD" --print-paths /tmp)
assert_contains "$OUT" "AGENT_SKILLS_HOME=$REPO" "env home"

echo "== inspect fixture =="
INSPECT=$(cd /tmp && "$AD" --inspect "$REPO/tests/fixtures/sample-app")
assert_contains "$INSPECT" "sample-app" "inspect names fixture"
assert_contains "$INSPECT" "README.md" "inspect finds README"
assert_contains "$INSPECT" "package.json" "inspect finds package.json"

echo "== scaffold into a temp product =="
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
cp -R "$REPO/tests/fixtures/sample-app/." "$WORK/"
SCAFFOLD=$(cd /tmp && "$AD" --scaffold "$WORK" --campaign "sample-notes-test" --duration 8 --format vertical)
assert_contains "$SCAFFOLD" "CAMPAIGN=sample-notes-test" "campaign slug"
assert_contains "$SCAFFOLD" "CAMPAIGN_DIR=$WORK/marketing/ads/sample-notes-test" "campaign dir"
[ -f "$WORK/marketing/PRODUCT.md" ] || { echo "fail  PRODUCT.md missing"; FAIL=1; }
[ -f "$WORK/marketing/ads/sample-notes-test/storyboard.md" ] || { echo "fail  storyboard missing"; FAIL=1; }
[ -f "$REPO/ad-studio/src/projects/sample-notes-test/Ad.tsx" ] || { echo "fail  studio project missing"; FAIL=1; }
echo "ok  scaffold files"

# Do not leave the fixture campaign in the studio.
rm -rf "$REPO/ad-studio/src/projects/sample-notes-test"
rm -rf "$REPO/ad-studio/public/sample-notes-test"
rm -rf "$REPO/ad-studio/renders/sample-notes-test"
"$REPO/shared/remotion-ads/scripts/generate-registry.sh" >/dev/null

echo "== resolve.sh --json =="
JSON=$(cd /tmp && "$REPO/shared/remotion-ads/scripts/resolve.sh" --json)
assert_contains "$JSON" "\"SKILL_ROOT\"" "json keys"

echo "== adapter resolve through symlink-style invocation =="
OUT=$(cd /tmp && "$REPO/claude/ad/resolve.sh")
assert_contains "$OUT" "SKILL_ROOT=$REPO/shared/remotion-ads" "claude adapter resolve"
OUT=$(cd /tmp && "$REPO/codex/remotion-ads/resolve.sh")
assert_contains "$OUT" "STUDIO_ROOT=$REPO/ad-studio" "codex adapter resolve"

if [ "$FAIL" -ne 0 ]; then
  echo
  echo "SOME CHECKS FAILED"
  exit 1
fi

echo
echo "ALL CLI CHECKS PASSED"
