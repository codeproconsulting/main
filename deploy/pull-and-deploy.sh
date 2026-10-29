#!/bin/bash
# Script to pull latest code and redeploy

set -e

BRANCH=${1:-main}

echo "--- Pulling latest from $BRANCH ---"
git pull origin $BRANCH

echo "--- Installing & Building ---"
npm ci
npm run build

echo "--- Restarting PM2 ---"
pm2 startOrReload deploy/ecosystem.config.cjs --update-env

echo "--- Done! ---"
