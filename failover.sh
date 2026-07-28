#!/bin/bash
# failover.sh — IMBA Failover Procedure
# Run locally on Mac when main VPS is down or RKN-blocked
# Usage: bash failover.sh <NEW_VPS_IP> <RESERVE_DOMAIN>
# Example: bash failover.sh 185.30.20.10 reserve.imba.run

set -euo pipefail

NEW_IP="${1:?Usage: failover.sh <NEW_VPS_IP> <RESERVE_DOMAIN>}"
RESERVE_DOMAIN="${2:?Usage: failover.sh <NEW_VPS_IP> <RESERVE_DOMAIN>}"
DEPLOY_EMAIL="hello@sitesynth.com"
GITHUB_REPO="Actiq/esim-vpn-card"
REMNAWAVE_PANEL="${REMNAWAVE_PANEL_IP:?Set REMNAWAVE_PANEL_IP env var}"
IMBA_SSH_KEY="${IMBA_SSH_KEY:-$HOME/.ssh/id_ed25519}"
TG_CHANNEL="@imba_live"

log() { echo -e "\033[1;32m[$(date +%H:%M:%S)] $*\033[0m"; }
warn() { echo -e "\033[1;33m[WARN] $*\033[0m"; }

log "=== IMBA Failover: $RESERVE_DOMAIN → $NEW_IP ==="

# ── Step 1: Get remnanode SECRET_KEY from panel ───────────────────────────────
log "Fetching remnanode SECRET_KEY from panel..."
REMNA_SECRET_KEY=$(ssh -i "$IMBA_SSH_KEY" root@$REMNAWAVE_PANEL \
  "cat /opt/remnawave-node/.env | grep SECRET_KEY | cut -d= -f2-") || \
  { warn "Could not reach panel — set REMNA_SECRET_KEY manually"; }

# ── Step 1b: Get GitHub Actions deploy public key ────────────────────────────
log "Getting GitHub Actions deploy public key..."
# DEPLOY_SSH_KEY secret contains the private key; extract matching pub key
# We need to add the public key to the new VPS authorized_keys
GH_DEPLOY_PUBKEY=""
if command -v gh &>/dev/null; then
  # Get the pub key from local agent or derive from private key in secret
  # We store the public key separately as DEPLOY_SSH_PUBKEY secret
  GH_DEPLOY_PUBKEY=$(gh secret get DEPLOY_SSH_PUBKEY --repo "$GITHUB_REPO" 2>/dev/null || echo "")
fi
if [[ -z "$GH_DEPLOY_PUBKEY" ]]; then
  warn "Could not fetch DEPLOY_SSH_PUBKEY secret — add it manually to GitHub:"
  warn "  gh secret set DEPLOY_SSH_PUBKEY --repo $GITHUB_REPO < ~/.ssh/id_ed25519_deploy.pub"
fi

# ── Step 2: Run bootstrap on new VPS ─────────────────────────────────────────
log "Running bootstrap on $NEW_IP..."
ssh-keyscan -H "$NEW_IP" >> ~/.ssh/known_hosts 2>/dev/null || true

# Copy bootstrap script to new VPS
scp -i "$IMBA_SSH_KEY" "$(dirname "$0")/bootstrap.sh" root@"$NEW_IP":/root/bootstrap.sh

# Run it
ssh -i "$IMBA_SSH_KEY" root@"$NEW_IP" \
  "REMNA_SECRET_KEY='${REMNA_SECRET_KEY:-}' bash /root/bootstrap.sh '$RESERVE_DOMAIN' '$DEPLOY_EMAIL' '${GH_DEPLOY_PUBKEY:-}'"

# ── Step 3: Update GitHub Actions secret DEPLOY_HOST ─────────────────────────
log "Updating GitHub DEPLOY_HOST secret..."
if command -v gh &>/dev/null; then
  gh secret set DEPLOY_HOST --body "$NEW_IP" --repo "$GITHUB_REPO"
  log "DEPLOY_HOST updated to $NEW_IP"
else
  warn "gh CLI not installed — update DEPLOY_HOST secret manually in GitHub"
  warn "  Repo: https://github.com/$GITHUB_REPO/settings/secrets/actions"
  warn "  Set DEPLOY_HOST = $NEW_IP"
fi

# ── Step 4: Copy .env.production.local to new VPS ────────────────────────────
log "Copying .env.production.local to new VPS..."
# Try to get it from the main VPS first (may not be reachable)
MAIN_VPS_IP=$(gh secret get DEPLOY_HOST --repo "$GITHUB_REPO" 2>/dev/null || echo "")
if [[ -n "$MAIN_VPS_IP" ]] && ssh -i "$IMBA_SSH_KEY" -o ConnectTimeout=5 root@"$MAIN_VPS_IP" echo ok &>/dev/null; then
  ssh -i "$IMBA_SSH_KEY" root@"$MAIN_VPS_IP" \
    "cat /var/www/imba-run-next/.env.production.local" | \
    ssh -i "$IMBA_SSH_KEY" root@"$NEW_IP" \
    "cat > /var/www/imba-run-next/.env.production.local"
  log ".env copied from main VPS"
else
  warn "Main VPS unreachable — edit .env manually on new VPS:"
  warn "  ssh root@$NEW_IP 'nano /var/www/imba-run-next/.env.production.local'"
fi

# Update APP_URL in .env for new domain
ssh -i "$IMBA_SSH_KEY" root@"$NEW_IP" \
  "sed -i 's|APP_URL=.*|APP_URL=https://$RESERVE_DOMAIN|g' /var/www/imba-run-next/.env.production.local && \
   sed -i 's|OAUTH_REDIRECT_BASE=.*|OAUTH_REDIRECT_BASE=https://$RESERVE_DOMAIN|g' /var/www/imba-run-next/.env.production.local"

# ── Step 5: Trigger GitHub Actions deploy ────────────────────────────────────
log "Triggering GitHub Actions deploy..."
if command -v gh &>/dev/null; then
  gh workflow run deploy.yml --repo "$GITHUB_REPO"
  log "Deploy triggered — watch: https://github.com/$GITHUB_REPO/actions"
else
  warn "Trigger manually: push a commit or run workflow from GitHub Actions UI"
fi

# ── Step 6: DNS update reminder ───────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              FAILOVER IN PROGRESS                           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  New VPS:      $NEW_IP"
echo "║  Domain:       $RESERVE_DOMAIN"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  REMAINING MANUAL STEPS:                                    ║"
echo "║"
echo "║  1. DNS (1cloud panel):                                     ║"
echo "║     A record: $RESERVE_DOMAIN → $NEW_IP"
echo "║     TTL: 60 sec (propagates in ~1 min if TTL was low)       ║"
echo "║"
echo "║  2. Wait for GitHub Actions to finish (~90 sec)             ║"
echo "║     https://github.com/$GITHUB_REPO/actions"
echo "║"
echo "║  3. Telegram announcement (if needed):                      ║"
echo "║     Post to $TG_CHANNEL:"
echo "║     'IMBA доступен по новому адресу: https://$RESERVE_DOMAIN'"
echo "║"
echo "║  4. remnawave panel — add new node IP:                      ║"
echo "║     https://remnawave.imba.live → Nodes → edit/add          ║"
echo "║     Node address: $NEW_IP:2222"
echo "╚══════════════════════════════════════════════════════════════╝"
