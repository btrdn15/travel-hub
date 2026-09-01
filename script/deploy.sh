#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Pull latest code"
git pull origin main

echo "==> Install dependencies"
npm install

echo "==> Build frontend + server"
npm run build

if [[ ! -f dist/public/index.html ]]; then
  echo "ERROR: dist/public/index.html missing after build"
  exit 1
fi

echo "==> Restart app"
pm2 restart travel-hub --update-env

echo "==> Done. Check:"
ls -la dist/public/index.html
curl -sI http://127.0.0.1:5000/ | head -3
