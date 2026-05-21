#!/bin/bash
set -euo pipefail

# ============================================================
# TAM TRÍ LỰC — Production Setup Script
# ============================================================
# Chạy 1 lần sau khi mua domain + VPS
# Usage: bash scripts/setup-prod.sh
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ─── Check .env ───────────────────────────────────────────
if [ ! -f .env ]; then
  error "File .env không tồn tại! Hãy copy .env vào thư mục gốc."
  exit 1
fi

source .env

if [ "$DOMAIN" = "localhost" ]; then
  error "Bạn chưa cập nhật DOMAIN trong .env! Hãy sửa DOMAIN=example.com"
  exit 1
fi

if [[ ! "$DOCKER_USER" =~ ^[a-z0-9]+ ]]; then
  error "Bạn chưa cập nhật DOCKER_USER trong .env!"
  exit 1
fi

info "Domain: $DOMAIN"
info "API Domain: $API_DOMAIN"
info "Docker User: $DOCKER_USER"

# ─── Pull images ──────────────────────────────────────────
info "Pulling images..."
docker compose pull

# ─── Step 1: Temporary HTTP-only nginx config ────────────
info "Creating temporary HTTP nginx config for SSL challenge..."
cat > nginx/nginx.conf << NGINX_HTTP
events { worker_connections 1024; }
http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  client_max_body_size 50M;
  server {
    listen 80;
    server_name $DOMAIN $API_DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://\$host\$request_uri; }
  }
}
NGINX_HTTP

# ─── Start nginx + core services ──────────────────────────
info "Starting core services..."
docker compose up -d postgres server website
info "Starting nginx for SSL challenge..."
docker compose --profile prod up -d nginx

# ─── Wait for nginx ──────────────────────────────────────
sleep 3
if ! docker compose ps nginx | grep -q "Up"; then
  error "nginx failed to start. Check port 80 is open on VPS firewall."
  docker compose logs nginx
  exit 1
fi

# ─── Get SSL Certificate ──────────────────────────────────
info "Requesting SSL certificate from Let's Encrypt..."
docker compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "$API_DOMAIN" \
  --email "admin@$DOMAIN" \
  --agree-tos \
  --no-eff-email

info "SSL certificate obtained ✅"

# ─── Step 2: Full SSL nginx config ────────────────────────
info "Generating full SSL nginx config..."
sed \
  -e "s/__DOMAIN__/$DOMAIN/g" \
  -e "s/__API_DOMAIN__/$API_DOMAIN/g" \
  nginx/nginx.conf.template > nginx/nginx.conf

# ─── Restart nginx ────────────────────────────────────────
info "Restarting nginx with SSL..."
docker compose restart nginx
sleep 2

# ─── Start full system ────────────────────────────────────
info "Starting all services..."
docker compose --profile prod up -d

info ""
info "========================================"
info "  ✅ SYSTEM IS LIVE!"
info "========================================"
info "  Website:  https://$DOMAIN"
info "  API:      https://$API_DOMAIN"
info "  Health:   https://$API_DOMAIN/api/health"
info "========================================"
info "  SSL tự động gia hạn mỗi 12h"
info "========================================"