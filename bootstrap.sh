#!/bin/bash
# bootstrap.sh — IMBA Reserve VPS Setup
# Fresh Ubuntu 22.04/24.04, run as root
# Usage: bash bootstrap.sh <DOMAIN> <EMAIL>
# Example: bash bootstrap.sh reserve.imba.run admin@imba.run

set -euo pipefail

DOMAIN="${1:?Usage: bootstrap.sh <DOMAIN> <EMAIL> [GH_DEPLOY_PUBKEY]}"
EMAIL="${2:?Usage: bootstrap.sh <DOMAIN> <EMAIL> [GH_DEPLOY_PUBKEY]}"
# Optional: public key from GitHub secret DEPLOY_SSH_KEY (so GitHub Actions can rsync here)
GH_DEPLOY_PUBKEY="${3:-${GH_DEPLOY_PUBKEY:-}}"
APP_DIR="/var/www/imba-run-next"
REMNANODE_DIR="/opt/remnawave-node"
NODE_VERSION="20"

log() { echo -e "\033[1;32m[$(date +%H:%M:%S)] $*\033[0m"; }
err() { echo -e "\033[1;31m[ERROR] $*\033[0m" >&2; exit 1; }

[[ $(id -u) -eq 0 ]] || err "Run as root"

log "=== IMBA Bootstrap: $DOMAIN ==="

# ── 1. System packages ────────────────────────────────────────────────────────
log "Installing system packages..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  curl wget git rsync nginx certbot python3-certbot-nginx \
  ca-certificates gnupg lsb-release ufw jq

# ── 2. Docker ─────────────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
else
  log "Docker already installed"
fi

# ── 3. Node.js + pm2 ──────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  log "Installing Node.js $NODE_VERSION..."
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2 --quiet
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

# ── 4. App directories ────────────────────────────────────────────────────────
log "Creating app directories..."
mkdir -p "$APP_DIR"
mkdir -p "$REMNANODE_DIR"

# ── 5. remnanode ─────────────────────────────────────────────────────────────
log "Setting up remnawave node..."

# SECRET_KEY — embedded mTLS certs, copy from panel or generate new node
# To get: ssh root@38.19.201.176 "cat /opt/remnawave-node/.env"
if [[ -z "${REMNA_SECRET_KEY:-}" ]]; then
  echo ""
  echo "  ┌─────────────────────────────────────────────────────────────┐"
  echo "  │  REMNA_SECRET_KEY not set.                                  │"
  echo "  │  Get it: ssh root@38.19.201.176 'cat /opt/remnawave-node/.env' │"
  echo "  │  Then: export REMNA_SECRET_KEY='eyJ...'                     │"
  echo "  │  And re-run this script, or add node manually in panel.     │"
  echo "  └─────────────────────────────────────────────────────────────┘"
  echo ""
  SKIP_REMNANODE=1
fi

if [[ "${SKIP_REMNANODE:-0}" -ne 1 ]]; then
  cat > "$REMNANODE_DIR/.env" <<EOF
NODE_PORT=2222
XTLS_API_PORT=61000
SECRET_KEY=${REMNA_SECRET_KEY}
EOF

  cat > "$REMNANODE_DIR/docker-compose.yml" <<'EOF'
services:
  remnanode:
    image: remnawave/node:latest
    container_name: remnanode
    hostname: remnanode
    network_mode: host
    restart: always
    cap_add:
      - NET_ADMIN
    ulimits:
      nofile:
        soft: 1048576
        hard: 1048576
    env_file: .env
EOF

  log "Pre-pulling remnanode image..."
  docker pull remnawave/node:latest

  log "Starting remnanode..."
  cd "$REMNANODE_DIR"
  docker compose up -d
  cd -

  log "remnanode started on port 2222"
fi

# ── 6. nginx ──────────────────────────────────────────────────────────────────
log "Configuring nginx..."

# Temporary HTTP config for certbot
cat > /etc/nginx/sites-available/imba-run <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    root /var/www/html;
    location /.well-known/acme-challenge/ { }
    location / { return 301 https://\$host\$request_uri; }
}
EOF

ln -sf /etc/nginx/sites-available/imba-run /etc/nginx/sites-enabled/imba-run
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── 7. SSL cert ───────────────────────────────────────────────────────────────
log "Obtaining SSL certificate for $DOMAIN..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL" \
  --redirect || log "WARNING: certbot failed — check DNS A record points to this IP"

# ── 8. nginx final config ─────────────────────────────────────────────────────
log "Writing final nginx config..."

cat > /etc/nginx/sites-available/imba-run <<'NGINXEOF'
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 443 ssl;
    server_name PLACEHOLDER_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/PLACEHOLDER_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/PLACEHOLDER_DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location /api/action/ {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass 1;
        proxy_no_cache 1;
        add_header Cache-Control "no-store, no-cache" always;
    }

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name PLACEHOLDER_DOMAIN;
    return 301 https://$host$request_uri;
}
NGINXEOF

# Replace placeholder
sed -i "s/PLACEHOLDER_DOMAIN/$DOMAIN/g" /etc/nginx/sites-available/imba-run

nginx -t && systemctl reload nginx
log "nginx configured"

# ── 9. .env.production.local ──────────────────────────────────────────────────
log "Writing .env.production.local..."

# Copy env from main VPS if accessible, otherwise use template
ENV_FILE="$APP_DIR/.env.production.local"

if [[ -f "/root/imba-env-backup/.env.production.local" ]]; then
  cp /root/imba-env-backup/.env.production.local "$ENV_FILE"
  log "Copied .env from backup"
else
  cat > "$ENV_FILE" <<'ENVEOF'
# Fill these before GitHub Actions deploy triggers
APP_URL=https://PLACEHOLDER_DOMAIN
IMBA_API_URL=http://${IMBA_API_HOST:-YOUR_API_HOST}:8100
NEXT_PUBLIC_API_URL=https://api.imba.live
NEXT_PUBLIC_VK_CLIENT_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
OAUTH_REDIRECT_BASE=https://PLACEHOLDER_DOMAIN
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
ENVEOF
  sed -i "s/PLACEHOLDER_DOMAIN/$DOMAIN/g" "$ENV_FILE"
  log "WARNING: .env.production.local is a template — fill in secrets before deploy"
fi

# ── 10. pm2 placeholder ───────────────────────────────────────────────────────
log "Creating pm2 placeholder (real app comes via GitHub Actions)..."

mkdir -p "$APP_DIR"
cat > "$APP_DIR/server.js" <<'EOF'
// Placeholder — real server.js comes from GitHub Actions deploy
const http = require('http')
http.createServer((_, res) => {
  res.writeHead(503)
  res.end('Deploying... check back in 2 minutes.')
}).listen(3100)
console.log('Placeholder on :3100')
EOF

pm2 delete imba-run 2>/dev/null || true
PORT=3100 pm2 start "$APP_DIR/server.js" --name imba-run
pm2 save

# ── 11. UFW firewall ──────────────────────────────────────────────────────────
log "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (redirect)
ufw allow 443/tcp   # HTTPS
ufw allow 2222/tcp  # remnanode xray
ufw allow 61000/tcp # remnanode XTLS API (internal, but needed by panel)
ufw --force enable

# ── 12. Journal log rotation ──────────────────────────────────────────────────
journalctl --vacuum-size=50M
mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/size-limit.conf <<EOF
[Journal]
SystemMaxUse=50M
EOF
systemctl restart systemd-journald

# ── 13. GitHub Actions SSH access ────────────────────────────────────────────
if [[ -n "$GH_DEPLOY_PUBKEY" ]]; then
  log "Adding GitHub Actions deploy key to authorized_keys..."
  mkdir -p /root/.ssh
  chmod 700 /root/.ssh
  echo "$GH_DEPLOY_PUBKEY" >> /root/.ssh/authorized_keys
  chmod 600 /root/.ssh/authorized_keys
  log "Deploy key added — GitHub Actions can now rsync to this server"
else
  log "WARNING: No GH_DEPLOY_PUBKEY provided."
  log "  Get public key: gh secret get DEPLOY_SSH_KEY (base64 decode, extract pub)"
  log "  Or: run with arg 3 = the public key string"
  log "  GitHub Actions rsync will fail until this is added."
fi

# ── Done ──────────────────────────────────────────────────────────────────────
PUBLIC_IP=$(curl -s https://api.ipify.org 2>/dev/null || curl -s https://ifconfig.me)

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           IMBA Bootstrap Complete                           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Server IP:    $PUBLIC_IP"
echo "║  Domain:       $DOMAIN"
echo "║  Next step:    Add GitHub Secret DEPLOY_HOST=$PUBLIC_IP     ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  MANUAL STEPS:                                              ║"
echo "║  1. Update DNS A record: $DOMAIN → $PUBLIC_IP"
echo "║  2. Fill secrets in $ENV_FILE"
echo "║  3. Push a commit to trigger GitHub Actions deploy          ║"
if [[ "${SKIP_REMNANODE:-0}" -eq 1 ]]; then
echo "║  4. Set REMNA_SECRET_KEY env var and re-run bootstrap       ║"
echo "║     OR add this node manually in remnawave panel            ║"
fi
echo "╚══════════════════════════════════════════════════════════════╝"
