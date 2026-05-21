#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Tam Trí Lực — Deploy Script
# Build local → Push DockerHub → VPS pull & run
# =============================================================================
# Usage:
#   bash scripts/deploy.sh              # build + push with .env values
#   bash scripts/deploy.sh production   # build + push with .env.production
#   bash scripts/deploy.sh --no-push    # build only, skip push
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE=".env"
SKIP_PUSH=false

for arg in "$@"; do
  case "$arg" in
    --no-push) SKIP_PUSH=true ;;
    *) ENV_FILE="$arg" ;;
  esac
done

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

# ─── Summary ──────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅  Done!"
echo ""
echo "  Images pushed:"
echo "    $DOCKER_USER/ttl-server:$IMAGE_TAG"
echo "    $DOCKER_USER/ttl-website:$IMAGE_TAG"
echo ""
echo "  On VPS, run:"
echo "    docker compose pull"
echo "    docker compose up -d"
echo "═══════════════════════════════════════════════════════════════"
