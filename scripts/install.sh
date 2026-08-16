#!/usr/bin/env bash
# Install the ad CLI and Claude/Codex skill links.
set -e
SELF="$0"
while [ -L "$SELF" ]; do
  DIR=$(cd "$(dirname "$SELF")" && pwd)
  LINK=$(readlink "$SELF")
  case "$LINK" in
    /*) SELF="$LINK" ;;
    *) SELF="$DIR/$LINK" ;;
  esac
done
REPO_ROOT=$(cd "$(dirname "$SELF")/.." && pwd)

if [ ! -f "$REPO_ROOT/shared/remotion-ads/SKILL.md" ]; then
  echo "error: this installer must live inside the agent-skills repo" >&2
  exit 1
fi

CONFIG_DIR="$HOME/.config/agent-skills"
mkdir -p "$CONFIG_DIR"
printf '%s\n' "$REPO_ROOT" > "$CONFIG_DIR/home"
echo "wrote $CONFIG_DIR/home"

BIN_DIR="${AGENT_SKILLS_BIN_DIR:-$HOME/.local/bin}"
mkdir -p "$BIN_DIR"
ln -sfn "$REPO_ROOT/bin/ad" "$BIN_DIR/ad"
echo "linked $BIN_DIR/ad"

mkdir -p "$HOME/.claude/skills"
ln -sfn "$REPO_ROOT/claude/ad" "$HOME/.claude/skills/ad"
echo "linked $HOME/.claude/skills/ad  ->  /ad"

mkdir -p "$HOME/.codex/skills"
ln -sfn "$REPO_ROOT/codex/remotion-ads" "$HOME/.codex/skills/remotion-ads"
echo "linked $HOME/.codex/skills/remotion-ads"

mkdir -p "$HOME/.agents/skills"
ln -sfn "$REPO_ROOT/shared/remotion-ads" "$HOME/.agents/skills/remotion-ads"
echo "linked $HOME/.agents/skills/remotion-ads"

chmod +x \
  "$REPO_ROOT/bin/ad" \
  "$REPO_ROOT/scripts/install.sh" \
  "$REPO_ROOT/shared/remotion-ads/scripts/"*.sh

echo
echo "Installed."
echo "From any product repo:"
echo "  ad ."
echo "In Claude Code:"
echo "  /ad"
echo "In Codex:"
echo "  \$remotion-ads"
