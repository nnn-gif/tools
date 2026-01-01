#!/bin/bash
# Full WordPress Backup Script
# Backs up both database and files

set -e  # Exit on error

# Configuration
BACKUP_DIR="./backups/full"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="wordpress-full-$DATE"
RETENTION_DAYS=30

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

echo "Starting WordPress full backup at $(date)"

# Backup Database
echo "Backing up database..."
docker exec wordpress_db mysqldump \
  -u ${MYSQL_USER:-wordpress} \
  -p${MYSQL_PASSWORD:-wordpress_password} \
  ${MYSQL_DATABASE:-wordpress} \
  > "$BACKUP_DIR/$BACKUP_NAME/database.sql" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✓ Database backup completed"
  # Compress database backup
  gzip "$BACKUP_DIR/$BACKUP_NAME/database.sql"
else
  echo "✗ Database backup failed"
  exit 1
fi

# Backup WordPress Content
echo "Backing up WordPress files..."
docker exec wordpress_app tar -czf - /var/www/html/wp-content \
  > "$BACKUP_DIR/$BACKUP_NAME/wp-content.tar.gz" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✓ Files backup completed"
else
  echo "✗ Files backup failed"
  exit 1
fi

# Backup wp-config.php (if accessible)
echo "Backing up wp-config.php..."
docker exec wordpress_app cat /var/www/html/wp-config.php \
  > "$BACKUP_DIR/$BACKUP_NAME/wp-config.php" 2>/dev/null || true

# Create archive
echo "Creating backup archive..."
cd "$BACKUP_DIR"
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

# Calculate backup size
BACKUP_SIZE=$(du -h "$BACKUP_NAME.tar.gz" | cut -f1)

echo "✓ Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz ($BACKUP_SIZE)"

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "wordpress-full-*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully at $(date)"
