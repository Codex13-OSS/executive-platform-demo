#!/usr/bin/env bash
set -euo pipefail

REQUIRED_BRANCH="polish/lia-os-cinematic-compact-v085"
REQUIRED_BASE="6f963e3"

BRANCH="$(git branch --show-current)"
HEAD="$(git rev-parse --short HEAD)"

echo "===== LIA GUARD ====="
echo "BRANCH=$BRANCH"
echo "HEAD=$HEAD"

if [ "$BRANCH" != "$REQUIRED_BRANCH" ]; then
  echo "ABORT: rama incorrecta. Esperada: $REQUIRED_BRANCH"
  exit 42
fi

if ! git merge-base --is-ancestor "$REQUIRED_BASE" HEAD; then
  echo "ABORT: este HEAD no viene de la base segura $REQUIRED_BASE"
  exit 43
fi

if git status --short | grep -q .; then
  echo "WARN: hay cambios sin commit:"
  git status --short
fi

npm --prefix frontend run build

echo "OK: workspace válido para LÍA O.S"
