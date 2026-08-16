#!/usr/bin/env bash
# Shared path resolution for remotion-ads. Safe on macOS bash 3.2.
# shellcheck disable=SC2034

agent_skills_realpath() {
  local src="$1"
  if command -v realpath >/dev/null 2>&1; then
    realpath "$src"
    return
  fi
  python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$src"
}

agent_skills_is_home() {
  local candidate="$1"
  [ -n "$candidate" ] \
    && [ -f "$candidate/shared/remotion-ads/SKILL.md" ] \
    && [ -d "$candidate/ad-studio" ]
}

agent_skills_walk_from() {
  local dir="$1"
  while [ "$dir" != "/" ]; do
    if agent_skills_is_home "$dir"; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir=$(dirname "$dir")
  done
  return 1
}

agent_skills_resolve_home() {
  local explicit="${AGENT_SKILLS_HOME:-}"
  if agent_skills_is_home "$explicit"; then
    printf '%s\n' "$explicit"
    return 0
  fi

  local config="${AGENT_SKILLS_CONFIG:-$HOME/.config/agent-skills/home}"
  if [ -f "$config" ]; then
    local stored
    stored=$(tr -d '\r\n' < "$config")
    if agent_skills_is_home "$stored"; then
      printf '%s\n' "$stored"
      return 0
    fi
  fi

  local here="$1"
  if [ -n "$here" ]; then
    local walked
    if walked=$(agent_skills_walk_from "$here"); then
      printf '%s\n' "$walked"
      return 0
    fi
  fi

  if walked=$(agent_skills_walk_from "$(pwd)"); then
    printf '%s\n' "$walked"
    return 0
  fi

  local guess
  for guess in \
    "$HOME/maskedsyntax/agent-skills" \
    "$HOME/src/agent-skills" \
    "$HOME/code/agent-skills" \
    "$HOME/dev/agent-skills" \
    "$HOME/agent-skills"
  do
    if agent_skills_is_home "$guess"; then
      printf '%s\n' "$guess"
      return 0
    fi
  done

  return 1
}

agent_skills_emit_paths() {
  local home="$1"
  printf 'AGENT_SKILLS_HOME=%s\n' "$home"
  printf 'SKILL_ROOT=%s\n' "$home/shared/remotion-ads"
  printf 'STUDIO_ROOT=%s\n' "$home/ad-studio"
  printf 'CLAUDE_SKILL=%s\n' "$home/claude/ad"
  printf 'CODEX_SKILL=%s\n' "$home/codex/remotion-ads"
  printf 'AD_BIN=%s\n' "$home/bin/ad"
}
