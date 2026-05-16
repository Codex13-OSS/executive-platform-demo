#!/usr/bin/env bash
set -euo pipefail

REQUIRED_BRANCH="polish/lia-os-cinematic-compact-v085"
REQUIRED_BASE="6f2a293"

BRANCH="$(git branch --show-current || true)"
HEAD="$(git rev-parse --short HEAD)"

echo "===== LIA GUARD v2 ====="
echo "BRANCH=$BRANCH"
echo "HEAD=$HEAD"
echo "REQUIRED_BASE=$REQUIRED_BASE"

# Codex Cloud puede montar la rama seleccionada como una rama interna llamada "work".
# Eso SOLO se permite si el HEAD viene del commit seguro.
if [ "$BRANCH" != "$REQUIRED_BRANCH" ] && [ "$BRANCH" != "work" ]; then
  echo "ABORT: rama incorrecta. Esperada: $REQUIRED_BRANCH o work válido de Codex."
  exit 42
fi

if ! git merge-base --is-ancestor "$REQUIRED_BASE" HEAD; then
  echo "ABORT: este HEAD no viene de la base segura $REQUIRED_BASE"
  exit 43
fi

if grep -RniE "LOGIN APP ACTIVE V5|APP DASHBOARD V5 ACTIVO|app-shell-v5|test-pr35-v5|PR35" frontend/src >/tmp/lia-v5-check.txt 2>/dev/null; then
  echo "ABORT: detecté residuos de V5/PR35 roto:"
  cat /tmp/lia-v5-check.txt
  exit 44
fi

if git status --short | grep -q .; then
  echo "WARN: hay cambios sin commit:"
  git status --short
fi

npm --prefix frontend run build

echo "OK: workspace válido para LÍA O.S"
