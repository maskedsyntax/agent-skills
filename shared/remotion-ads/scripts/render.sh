#!/usr/bin/env bash
# Render a composition from the shared ad studio.
# Usage: render.sh --id <composition> [--out <path>] [--still <frame>]
set -e
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# shellcheck source=lib.sh
. "$SCRIPT_DIR/lib.sh"

ID=""
OUT=""
STILL=""
CODEC="h264"

while [ $# -gt 0 ]; do
  case "$1" in
    --id) ID="$2"; shift 2 ;;
    --out) OUT="$2"; shift 2 ;;
    --still) STILL="$2"; shift 2 ;;
    --codec) CODEC="$2"; shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[ -n "$ID" ] || { echo "error: --id is required" >&2; exit 2; }

HOME_DIR=$(agent_skills_resolve_home "$SCRIPT_DIR") || {
  echo "error: could not locate agent-skills repo" >&2
  exit 1
}
STUDIO="$HOME_DIR/ad-studio"

if [ ! -d "$STUDIO/node_modules/remotion" ]; then
  echo "Installing ad-studio dependencies..."
  (cd "$STUDIO" && npm install)
fi

mkdir -p "$STUDIO/renders/$ID"

if [ -n "$STILL" ]; then
  if [ -z "$OUT" ]; then
    OUT="$STUDIO/renders/$ID/frame-${STILL}.png"
  fi
  (cd "$STUDIO" && npx remotion still "src/index.ts" "$ID" "$OUT" --frame="$STILL")
else
  if [ -z "$OUT" ]; then
    OUT="$STUDIO/renders/$ID/${ID}.mp4"
  fi
  (cd "$STUDIO" && npx remotion render "src/index.ts" "$ID" "$OUT" --codec="$CODEC")
fi

echo "OUTPUT=$OUT"
