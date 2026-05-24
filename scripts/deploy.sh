#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Tam Trí Lực — Deploy Script
# Build local → Push DockerHub → VPS pull & run
# =============================================================================
# Usage:
#   bash scripts/deploy.sh                     # build + push + VPS deploy
#   bash scripts/deploy.sh production          # build + push + VPS deploy with .env.production
#   bash scripts/deploy.sh --no-push           # build only, skip push + VPS
#   bash scripts/deploy.sh --vps-only          # skip local build, only pull & up on VPS
#   bash scripts/deploy.sh --no-deploy         # build + push, skip VPS deploy
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE=".env"
SKIP_PUSH=false
SKIP_VPS=false
VPS_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --no-push) SKIP_PUSH=true ;;
    --no-deploy) SKIP_VPS=true ;;
    --vps-only) VPS_ONLY=true ;;
    *) ENV_FILE="$arg" ;;
  esac
done

# Nếu --vps-only thì không build/push local
if [ "$VPS_ONLY" = true ]; then
  SKIP_PUSH=true
fi

cd "$PROJECT_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌  File $ENV_FILE not found!"
  exit 1
fi

# ─── Load Docker config from env ──────────────────────────────────────────
DOCKER_USER=$(grep -E '^DOCKER_USER=' "$ENV_FILE" | cut -d= -f2-)
IMAGE_TAG=$(grep -E '^IMAGE_TAG=' "$ENV_FILE" | cut -d= -f2-)
DOMAIN=$(grep -E '^DOMAIN=' "$ENV_FILE" | cut -d= -f2-)

DOCKER_USER="${DOCKER_USER:-tboi0602}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "═══════════════════════════════════════════════════════════════"
echo "  Tam Trí Lực — Deploy"
echo "  Docker Hub:  $DOCKER_USER"
echo "  Tag:         $IMAGE_TAG"
echo "  Env file:    $ENV_FILE"
echo "═══════════════════════════════════════════════════════════════"

# ─── Build ────────────────────────────────────────────────────────────────
if [ "$VPS_ONLY" = false ]; then
  echo ""
  echo "▸ Building images..."
  docker compose --env-file "$ENV_FILE" build

  # ─── Tag ──────────────────────────────────────────────────────────────────
  echo ""
  echo "▸ Tagging images..."
  docker tag $DOCKER_USER/ttl-server:latest $DOCKER_USER/ttl-server:$IMAGE_TAG
  docker tag $DOCKER_USER/ttl-website:latest $DOCKER_USER/ttl-website:$IMAGE_TAG

  # ─── Push ─────────────────────────────────────────────────────────────────
  if [ "$SKIP_PUSH" = false ]; then
    echo ""
    echo "▸ Pushing to DockerHub..."
    echo "   (make sure you're logged in: docker login)"
    echo ""
    docker push $DOCKER_USER/ttl-server:$IMAGE_TAG
    docker push $DOCKER_USER/ttl-website:$IMAGE_TAG
  fi
fi

# ─── Deploy to VPS via SSH ────────────────────────────────────────────────
SSH_HOST=$(grep -E '^SSH_HOST=' "$ENV_FILE" | cut -d= -f2-)
SSH_USER=$(grep -E '^SSH_USER=' "$ENV_FILE" | cut -d= -f2-)
SSH_KEY_PATH=$(grep -E '^SSH_KEY_PATH=' "$ENV_FILE" | cut -d= -f2-)
VPS_PROJECT_DIR=$(grep -E '^VPS_PROJECT_DIR=' "$ENV_FILE" | cut -d= -f2-)

if [ "$SKIP_VPS" = false ] && [ -n "$SSH_HOST" ]; then
  echo ""
  echo "▸ Deploying to VPS ($SSH_USER@$SSH_HOST)..."
  SSH_CMD="ssh -o StrictHostKeyChecking=no"
  if [ -n "$SSH_KEY_PATH" ]; then
    SSH_CMD="$SSH_CMD -i $SSH_KEY_PATH"
  fi
  $SSH_CMD "$SSH_USER@$SSH_HOST" \
    "cd ${VPS_PROJECT_DIR:-/root/tamtriluc} && \
     docker compose pull && \
     docker compose up -d"
  echo "  ✅  VPS updated"
elif [ "$SKIP_VPS" = false ] && [ -z "$SSH_HOST" ]; then
  echo ""
  echo "  ⚠️   SSH_HOST chưa được cấu hình trong $ENV_FILE"
  echo "      Để tự động deploy lên VPS, thêm:"
  echo "        SSH_HOST=your-vps-ip"
  echo "        SSH_USER=root"
  echo "        SSH_KEY_PATH=~/.ssh/id_rsa"
  echo "        VPS_PROJECT_DIR=/root/tamtriluc"
fi

# ─── Summary ──────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅  Done!"
echo ""
echo "  Images pushed:"
echo "    $DOCKER_USER/ttl-server:$IMAGE_TAG"
echo "    $DOCKER_USER/ttl-website:$IMAGE_TAG"
echo "═══════════════════════════════════════════════════════════════"
