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

# ─── Generate Nginx config from template ──────────────────
info "Generating nginx config from template..."
sed \
  -e "s/__DOMAIN__/$DOMAIN/g" \
  -e "s/__API_DOMAIN__/$API_DOMAIN/g" \
  nginx/nginx.conf.template > nginx/nginx.conf
info "nginx config generated ✅"

# ─── Get SSL Certificate ──────────────────────────────────
info "Starting nginx for SSL challenge..."
docker compose --profile prod up -d nginx

info "Requesting SSL certificate from Let's Encrypt..."
docker compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "$API_DOMAIN" \
  --email "admin@$DOMAIN" \
  --agree-tos \
  --no-eff-email

if [ $? -ne 0 ]; then
  warn "Certbot chưa thành công. Kiểm tra DNS đã trỏ đúng chưa?"
  warn "Thử lại sau: docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d $DOMAIN -d $API_DOMAIN"
  warn "Hoặc chạy: docker compose down"
  exit 1
fi

info "SSL certificate obtained ✅"
info "Restarting nginx with SSL..."
docker compose restart nginx

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
