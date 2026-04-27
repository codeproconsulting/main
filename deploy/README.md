# 🚀 ProConsulting VPS Deployment Guide

This guide provides step-by-step instructions for deploying the **unified ProConsulting platform** (Main, Education, and Immigration sections) to a Ubuntu/Debian VPS.

## 📋 Prerequisites
- A VPS running **Ubuntu 22.04+** or **Debian 11+**.
- A domain name (e.g., `proconsulting.uk`) pointed to your VPS IP address.
- SSH access to your server.

---

## 🛠️ Quick Installation

### 1. Connect and Clone
Connect to your VPS via SSH and clone the repository:
```bash
git clone https://github.com/codeproconsulting/main.git
cd main
```

### 2. Run the Setup Script
The included script will automatically install Node.js, Nginx, PM2, and Certbot, then build and start the application:
```bash
sudo bash deploy/install.sh
```

### 3. Configure Environment Variables
Edit the `.env` file to add your real API keys for Ghost CMS and Google Sheets:
```bash
nano .env
```
After editing, rebuild and restart the app:
```bash
npm run build
pm2 restart proconsulting-main
```

### 4. Enable SSL (HTTPS)
Once your DNS is pointing to the server IP, run Certbot to secure your site:
```bash
sudo certbot --nginx -d proconsulting.uk -d www.proconsulting.uk
```

---

## 🔄 Updating the Website
Whenever you push new changes to GitHub, you can update your live site by running:
```bash
bash deploy/pull-and-deploy.sh
```

---

## 📂 Deployment File Structure
| File | Purpose |
|------|---------|
| `deploy/install.sh` | One-shot setup: Installs dependencies, configures Nginx, and starts the app. |
| `deploy/pull-and-deploy.sh` | Pulls latest code from Git, rebuilds, and restarts the service. |
| `deploy/ecosystem.config.cjs` | PM2 process configuration (Runs on port 3000). |
| `deploy/nginx/proconsulting.uk.conf` | Nginx config for routing and Ghost CMS proxy. |
| `deploy/env.example` | Template for environment variables. |

---

## 🛠️ Troubleshooting & Commands

### PM2 Management
```bash
pm2 status                  # Check app status
pm2 logs proconsulting-main # View live logs
pm2 restart all             # Restart the application
```

### Nginx Management
```bash
sudo nginx -t               # Test configuration for errors
sudo systemctl restart nginx # Apply changes
```

### Checking Logs
If the app doesn't start, check the PM2 error logs:
```bash
pm2 logs proconsulting-main --err
```

---

## 📝 Notes on Ghost CMS
- The Nginx configuration assumes Ghost is running on `localhost:2368`.
- If your Ghost instance is on a different port or server, update `deploy/nginx/proconsulting.uk.conf`.
- All blogs (Education/Immigration) fetch content via the Ghost Content API using the key provided in `.env`.
