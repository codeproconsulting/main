#!/bin/bash
# VPS Setup script for proconsulting.uk unified monorepo

set -e

echo "--- Starting ProConsulting Setup ---"

# 1. Update system
sudo apt-get update

# 2. Install Node.js (LTS) if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. Install PM2, Nginx, Certbot
sudo npm install -g pm2
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 4. Create .env if missing
if [ ! -f .env ]; then
    echo "Creating .env from example..."
    cp deploy/env.example .env
    echo "IMPORTANT: Please edit .env with your real API keys later!"
fi

# 5. Install dependencies and build
echo "Installing dependencies and building app..."
npm install
npm run build

# 6. Configure Nginx
echo "Configuring Nginx..."
sudo cp deploy/nginx/proconsulting.uk.conf /etc/nginx/sites-available/
if [ ! -f /etc/nginx/sites-enabled/proconsulting.uk.conf ]; then
    sudo ln -s /etc/nginx/sites-available/proconsulting.uk.conf /etc/nginx/sites-enabled/
fi

# Remove default nginx config if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

sudo nginx -t
sudo systemctl restart nginx

# 7. Start/Restart app with PM2
echo "Starting app with PM2..."
pm2 start deploy/ecosystem.config.cjs
pm2 save

echo "--- Setup Complete! ---"
echo "Next steps:"
echo "1. Edit .env with your real API keys."
echo "2. Point your DNS to this server IP."
echo "3. Run 'sudo certbot --nginx -d proconsulting.uk -d www.proconsulting.uk' for SSL."
