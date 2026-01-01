#!/bin/bash
# Database-Only Backup Script
# Quick database backup for frequent use

set -e

# Configuration
BACKUP_DIR="./backups/database"
DATE=$(date +%Y%m%d-%H%M%S)
RETENTION_DAYS=7

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Starting database backup at $(date)"

# Backup Database
docker exec wordpress_db mysqldump \
  -u ${MYSQL_USER:-wordpress} \
  -p${MYSQL_PASSWORD:-wordpress_password} \
  ${MYSQL_DATABASE:-wordpress} \
  | gzip > "$BACKUP_DIR/db-$DATE.sql.gz"

if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_DIR/db-$DATE.sql.gz" | cut -f1)
  echo "✓ Database backup completed: $BACKUP_DIR/db-$DATE.sql.gz ($BACKUP_SIZE)"
else
  echo "✗ Database backup failed"
  exit 1
fi

# Cleanup old backups
find "$BACKUP_DIR" -name "db-*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully"
