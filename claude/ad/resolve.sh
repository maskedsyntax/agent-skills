#!/usr/bin/env bash
# Resolve shared remotion-ads paths even when this folder is a symlink.
set -e
HERE=$(python3 -c 'import os,sys; print(os.path.dirname(os.path.realpath(sys.argv[1])))' "$0")
exec "$HERE/../../shared/remotion-ads/scripts/resolve.sh" "$@"
