#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Tam Trí Lực — First-time VPS Setup Script
# Run this once on a fresh VPS to pull and run everything.
# =============================================================================
# Usage:
#   bash scripts/setup-vps.sh
# =============================================================================

# ─── Config ───────────────────────────────────────────────────────────────
DOCKER_USER="tboi0602"
IMAGE_TAG="latest"
DOMAIN="${DOMAIN:-vnsales.org}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
RESEND_API_KEY="${RESEND_API_KEY:-}"
GEMINI_API_KEY="${GEMINI_API_KEY:-}"
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-}"
JWT_SECRET="${JWT_SECRET:-}"

if [ -z "$POSTGRES_PASSWORD" ]; then
  read -sp "🔐  Enter PostgreSQL password: " POSTGRES_PASSWORD
  echo ""
fi

if [ -z "$JWT_SECRET" ]; then
  read -sp "🔐  Enter JWT_SECRET (64+ chars random): " JWT_SECRET
  echo ""
fi

if [ -z "$RESEND_API_KEY" ]; then
  read -p "📧  Enter RESEND_API_KEY (leave blank to skip): " RESEND_API_KEY
fi

if [ -z "$GEMINI_API_KEY" ]; then
  read -p "🤖  Enter GEMINI_API_KEY (leave blank to skip): " GEMINI_API_KEY
fi

if [ -z "$GOOGLE_CLIENT_ID" ]; then
  read -p "🔑  Enter GOOGLE_CLIENT_ID (leave blank to skip): " GOOGLE_CLIENT_ID
fi

# ─── Create .env ──────────────────────────────────────────────────────────
cat > .env << EOF
# =============================================================================
# TAM TRÍ LỰC — Production Configuration (auto-generated)
# =============================================================================

DOMAIN=$DOMAIN
API_DOMAIN=api.$DOMAIN

DOCKER_USER=$DOCKER_USER
IMAGE_TAG=$IMAGE_TAG

POSTGRES_USER=postgres
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=ttl
DATABASE_URL=postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/ttl

JWT_SECRET=$JWT_SECRET

PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN

RESEND_API_KEY=$RESEND_API_KEY
EMAIL_FROM="SOS <onboarding@$DOMAIN>"

GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

GEMINI_API_KEY=$GEMINI_API_KEY

NEXT_PUBLIC_API_URL=https://api.$DOMAIN
NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
EOF

echo ""
echo "✅  .env created"

# ─── Login DockerHub ──────────────────────────────────────────────────────
echo ""
echo "▸ Logging in to DockerHub..."
docker login --username "$DOCKER_USER"

# ─── Pull images ──────────────────────────────────────────────────────────
echo ""
echo "▸ Pulling images from DockerHub..."
docker compose pull

# ─── Start services ───────────────────────────────────────────────────────
echo ""
echo "▸ Starting services..."
docker compose up -d

# ─── Done ─────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅  VPS setup complete!"
echo ""
echo "  Frontend:  http://$(curl -s ifconfig.me):3000"
echo "  API:       http://$(curl -s ifconfig.me):4000"
echo ""
echo "  Next steps:"
echo "    - Point your domain A records to this server's IP"
echo "    - Run: bash scripts/setup-ssl.sh"
echo "═══════════════════════════════════════════════════════════════"
