#!/bin/bash
set -euo pipefail

# ============================================================
# TAM TRÍ LỰC — Database Backup Script
# ============================================================
# Chạy tự động qua Docker cron service
# Backup hàng ngày, giữ 7 ngày gần nhất
# ============================================================

BACKUP_DIR="/backups"
RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="ttl_backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
  -h postgres \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  -F c \
  -Z 9 \
  -f "${BACKUP_DIR}/${FILENAME}"

echo "[$(date)] Backup created: ${FILENAME}"
echo "Size: $(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1)"

find "$BACKUP_DIR" -name "ttl_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Cleaned up backups older than $RETENTION_DAYS days"
