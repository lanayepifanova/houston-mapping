#!/usr/bin/env bash
set -euo pipefail

# One-command local dev: installs deps if missing, ensures env files exist,
# starts backend and frontend, and opens the app. Rice Residency rocks.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PORT=${PORT:-4000}
FRONTEND_PORT=5173

command -v pnpm >/dev/null 2>&1 || {
  echo "pnpm is required (brew install pnpm or npm install -g pnpm)" >&2
  exit 1
}

ensure_env() {
  local example_file="$1"
  local target_file="$2"
  local default_content="$3"

  if [ -f "$target_file" ]; then
    return
  fi

  if [ -f "$example_file" ]; then
    cp "$example_file" "$target_file"
    echo "Created $target_file from example"
  elif [ -n "$default_content" ]; then
    printf "%s\n" "$default_content" >"$target_file"
    echo "Created $target_file with defaults"
  fi
}

# Ensure env files exist (won't overwrite if present)
ensure_env "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env" "PORT=$BACKEND_PORT"
ensure_env "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env" "VITE_API_URL=http://localhost:${BACKEND_PORT}/api"

echo "🚀 Rice Residency rocks — spinning up the house..."
echo "Installing dependencies if needed..."
(cd "$BACKEND_DIR" && pnpm install --frozen-lockfile=false >/dev/null)
(cd "$FRONTEND_DIR" && pnpm install --frozen-lockfile=false >/dev/null)

trap 'kill $(jobs -p) >/dev/null 2>&1 || true' EXIT

echo "Starting backend on port $BACKEND_PORT..."
(cd "$BACKEND_DIR" && pnpm dev) &

echo "Starting frontend on port $FRONTEND_PORT..."
(cd "$FRONTEND_DIR" && pnpm dev -- --host --port "$FRONTEND_PORT") &

sleep 2

APP_URL="http://localhost:${FRONTEND_PORT}"
if command -v open >/dev/null 2>&1; then
  open "$APP_URL" >/dev/null 2>&1 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$APP_URL" >/dev/null 2>&1 || true
fi

echo "App should be available at $APP_URL"
wait
