#!/usr/bin/env bash
# Scan a product repository for marketing-relevant files.
# Usage: inspect.sh <product-root>
set -e
TARGET=${1:-.}
if [ ! -d "$TARGET" ]; then
  echo "error: not a directory: $TARGET" >&2
  exit 1
fi

TARGET=$(cd "$TARGET" && pwd)

python3 - "$TARGET" <<'PY'
import json, os, sys
from pathlib import Path

root = Path(sys.argv[1])
skip_dirs = {
    ".git", "node_modules", ".build", "build", "DerivedData",
    "Pods", ".next", "dist", "coverage", ".gradle",
    "vendor", "__pycache__", ".venv", "venv", "Carthage",
    "ad-studio", ".remotion",
}

doc_names = {
    "README.md", "README", "CLAUDE.md", "AGENTS.md", "CONTRIBUTING.md",
    "PRODUCT.md", "AUDIENCE.md", "CLAIMS.md",
}
config_names = {
    "package.json", "pubspec.yaml", "Cargo.toml", "go.mod",
    "pyproject.toml", "composer.json", "Gemfile",
    "app.json", "app.config.js", "app.config.ts",
    "Info.plist", "AndroidManifest.xml",
}
asset_exts = {
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
    ".mp4", ".mov", ".webm", ".m4v",
    ".wav", ".mp3", ".aac", ".m4a", ".aiff",
}
marketing_dirs = {
    "marketing", "screenshots", "assets", "public", "static",
    "fastlane", "store", "listings", "brand", "media", "press",
    "Images.xcassets", "AppIcon.appiconset",
}

docs, configs, assets, marketing = [], [], [], []
app_store, existing_ads = [], []

for dirpath, dirnames, filenames in os.walk(root):
    rel_dir = Path(dirpath).relative_to(root)
    parts = set(rel_dir.parts)
    dirnames[:] = [d for d in dirnames if d not in skip_dirs and not d.startswith(".")]
    if any(p in skip_dirs for p in parts):
        continue
    depth = len(rel_dir.parts)
    for name in filenames:
        path = Path(dirpath) / name
        rel = str(path.relative_to(root))
        lower = name.lower()
        if name in doc_names or lower.startswith("readme"):
            docs.append(rel)
        if name in config_names:
            configs.append(rel)
        suffix = path.suffix.lower()
        if suffix in asset_exts and depth <= 6:
            assets.append(rel)
        if "fastlane/metadata" in rel or "appstore" in lower or "play-store" in lower or "playstore" in lower:
            app_store.append(rel)
        if rel.startswith("marketing/ads/") or "/ads/" in rel:
            existing_ads.append(rel)
    for name in dirnames:
        if name in marketing_dirs:
            marketing.append(str((Path(dirpath) / name).relative_to(root)))

print(json.dumps({
    "root": str(root),
    "name": root.name,
    "docs": sorted(set(docs))[:80],
    "configs": sorted(set(configs))[:40],
    "marketing_dirs": sorted(set(marketing))[:40],
    "assets": sorted(set(assets))[:200],
    "store_metadata": sorted(set(app_store))[:40],
    "existing_ads": sorted(set(existing_ads))[:80],
    "has_marketing_brief": (root / "marketing" / "PRODUCT.md").exists(),
}, indent=2))
PY
