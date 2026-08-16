#!/usr/bin/env bash
# Scaffold product marketing files + studio campaign project.
# Usage: new-campaign.sh --product <dir> [--campaign <slug>] [--strategy <name>]
set -e
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# shellcheck source=lib.sh
. "$SCRIPT_DIR/lib.sh"

PRODUCT=""
CAMPAIGN=""
STRATEGY=""
DURATION="15"
FORMAT="vertical"

while [ $# -gt 0 ]; do
  case "$1" in
    --product) PRODUCT="$2"; shift 2 ;;
    --campaign) CAMPAIGN="$2"; shift 2 ;;
    --strategy) STRATEGY="$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[ -n "$PRODUCT" ] || { echo "error: --product is required" >&2; exit 2; }
[ -d "$PRODUCT" ] || { echo "error: product dir not found: $PRODUCT" >&2; exit 1; }

PRODUCT=$(cd "$PRODUCT" && pwd)
HOME_DIR=$(agent_skills_resolve_home "$SCRIPT_DIR") || {
  echo "error: could not locate agent-skills repo" >&2
  exit 1
}
SKILL_ROOT="$HOME_DIR/shared/remotion-ads"
STUDIO_ROOT="$HOME_DIR/ad-studio"
TEMPLATES="$SKILL_ROOT/templates"

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

PRODUCT_SLUG=$(slugify "$(basename "$PRODUCT")")
DATE_STAMP=$(date +%Y%m%d)
if [ -z "$CAMPAIGN" ]; then
  if [ -n "$STRATEGY" ]; then
    CAMPAIGN="${PRODUCT_SLUG}-${DATE_STAMP}-$(slugify "$STRATEGY")"
  else
    CAMPAIGN="${PRODUCT_SLUG}-${DATE_STAMP}"
  fi
fi
CAMPAIGN=$(slugify "$CAMPAIGN")

mkdir -p "$PRODUCT/marketing/ads/$CAMPAIGN"
mkdir -p "$STUDIO_ROOT/src/projects/$CAMPAIGN"
mkdir -p "$STUDIO_ROOT/public/$CAMPAIGN"
mkdir -p "$STUDIO_ROOT/renders/$CAMPAIGN"

copy_if_missing() {
  local src="$1" dest="$2"
  if [ ! -f "$dest" ]; then
    cp "$src" "$dest"
  fi
}

copy_if_missing "$TEMPLATES/PRODUCT.md" "$PRODUCT/marketing/PRODUCT.md"
copy_if_missing "$TEMPLATES/AUDIENCE.md" "$PRODUCT/marketing/AUDIENCE.md"
copy_if_missing "$TEMPLATES/CLAIMS.md" "$PRODUCT/marketing/CLAIMS.md"

for f in brief.md strategy.md hooks.md concepts.md storyboard.md asset-audit.md critique.md manifest.json; do
  dest="$PRODUCT/marketing/ads/$CAMPAIGN/$f"
  if [ ! -f "$dest" ]; then
    cp "$TEMPLATES/$f" "$dest"
  fi
done

python3 - "$PRODUCT/marketing/ads/$CAMPAIGN/manifest.json" "$CAMPAIGN" "$PRODUCT_SLUG" "$PRODUCT" "$DURATION" "$FORMAT" "${STRATEGY:-}" <<'PY'
import json, sys, datetime
path, campaign, product_slug, product, duration, fmt, strategy = sys.argv[1:8]
try:
    data = json.load(open(path))
except Exception:
    data = {}
data.update({
    "campaign": campaign,
    "product": product_slug,
    "product_root": product,
    "created_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "duration_seconds": int(duration),
    "format": fmt,
    "strategy": strategy or None,
    "status": "scaffolded",
    "renders": [],
    "variants": [],
})
json.dump(data, open(path, "w"), indent=2)
print("", end="")
PY

WIDTH=1080
HEIGHT=1920
if [ "$FORMAT" = "square" ]; then
  HEIGHT=1080
elif [ "$FORMAT" = "horizontal" ]; then
  WIDTH=1920
  HEIGHT=1080
fi
FRAMES=$((DURATION * 30))

if [ ! -f "$STUDIO_ROOT/src/projects/$CAMPAIGN/index.ts" ]; then
  cat > "$STUDIO_ROOT/src/projects/$CAMPAIGN/index.ts" <<EOF
import {Ad} from './Ad';
import type {Project} from '../types';

export const project: Project = {
  id: '$CAMPAIGN',
  component: Ad,
  durationInFrames: $FRAMES,
  fps: 30,
  width: $WIDTH,
  height: $HEIGHT,
};
EOF
fi

if [ ! -f "$STUDIO_ROOT/src/projects/$CAMPAIGN/Ad.tsx" ]; then
  cat > "$STUDIO_ROOT/src/projects/$CAMPAIGN/Ad.tsx" <<'EOF'
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {KineticText} from '../../primitives/KineticText';

export const Ad: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0B0B0F'}}>
      <KineticText text="Replace this" size={140} />
    </AbsoluteFill>
  );
};
EOF
fi

"$SCRIPT_DIR/generate-registry.sh"

printf 'CAMPAIGN=%s\n' "$CAMPAIGN"
printf 'PRODUCT_ROOT=%s\n' "$PRODUCT"
printf 'CAMPAIGN_DIR=%s\n' "$PRODUCT/marketing/ads/$CAMPAIGN"
printf 'STUDIO_PROJECT=%s\n' "$STUDIO_ROOT/src/projects/$CAMPAIGN"
printf 'STUDIO_PUBLIC=%s\n' "$STUDIO_ROOT/public/$CAMPAIGN"
printf 'RENDERS=%s\n' "$STUDIO_ROOT/renders/$CAMPAIGN"
