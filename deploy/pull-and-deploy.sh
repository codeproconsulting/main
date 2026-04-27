#!/bin/bash
# Script to pull latest code and redeploy

set -e

BRANCH=${1:-main}

echo "--- Pulling latest from $BRANCH ---"
git pull origin $BRANCH

echo "--- Installing & Building ---"
npm install
npm run build

echo "--- Restarting PM2 ---"
pm2 restart proconsulting-main

echo "--- Done! ---"
