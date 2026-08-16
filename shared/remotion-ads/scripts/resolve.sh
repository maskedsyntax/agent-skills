#!/usr/bin/env bash
# Print resolved remotion-ads paths. Optional: --json
set -e
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# shellcheck source=lib.sh
. "$SCRIPT_DIR/lib.sh"

JSON=0
for arg in "$@"; do
  case "$arg" in
    --json) JSON=1 ;;
  esac
done

HOME_DIR=$(agent_skills_resolve_home "$SCRIPT_DIR") || {
  echo "error: could not locate agent-skills repo" >&2
  echo "Set AGENT_SKILLS_HOME or run scripts/install.sh" >&2
  exit 1
}

if [ "$JSON" -eq 1 ]; then
  python3 - "$HOME_DIR" <<'PY'
import json, sys
home = sys.argv[1]
print(json.dumps({
    "AGENT_SKILLS_HOME": home,
    "SKILL_ROOT": home + "/shared/remotion-ads",
    "STUDIO_ROOT": home + "/ad-studio",
    "CLAUDE_SKILL": home + "/claude/ad",
    "CODEX_SKILL": home + "/codex/remotion-ads",
    "AD_BIN": home + "/bin/ad",
}, indent=2))
PY
else
  agent_skills_emit_paths "$HOME_DIR"
fi
