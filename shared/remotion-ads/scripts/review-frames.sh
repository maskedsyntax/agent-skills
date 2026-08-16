#!/usr/bin/env bash
# Extract review stills from a rendered ad or composition.
# Usage: review-frames.sh --id <composition> [--fps 30] [--duration 15]
set -e
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# shellcheck source=lib.sh
. "$SCRIPT_DIR/lib.sh"

ID=""
FPS=30
DURATION=15

while [ $# -gt 0 ]; do
  case "$1" in
    --id) ID="$2"; shift 2 ;;
    --fps) FPS="$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[ -n "$ID" ] || { echo "error: --id is required" >&2; exit 2; }

HOME_DIR=$(agent_skills_resolve_home "$SCRIPT_DIR") || {
  echo "error: could not locate agent-skills repo" >&2
  exit 1
}
STUDIO="$HOME_DIR/ad-studio"
DIR="$STUDIO/renders/$ID/review"
mkdir -p "$DIR"

# First frame, ~1.5s hook, mid, late, last
total=$((DURATION * FPS))
last=$((total - 1))
[ "$last" -lt 0 ] && last=0
mid=$((total / 2))
hook=$((FPS + FPS / 2))
late=$((total * 4 / 5))

for frame in 0 "$hook" "$mid" "$late" "$last"; do
  out="$DIR/frame-$(printf '%04d' "$frame").png"
  (cd "$STUDIO" && npx remotion still "src/index.ts" "$ID" "$out" --frame="$frame")
  echo "$out"
done
