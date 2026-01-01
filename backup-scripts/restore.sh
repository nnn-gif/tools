#!/bin/bash
# WordPress Restore Script
# Restores from a full backup archive

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file.tar.gz>"
  echo ""
  echo "Available backups:"
  ls -lh backups/full/*.tar.gz 2>/dev/null || echo "No backups found"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

echo "WARNING: This will overwrite your current WordPress installation!"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled"
  exit 0
fi

# Extract backup
TEMP_DIR=$(mktemp -d)
echo "Extracting backup..."
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"
BACKUP_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)

# Restore database
if [ -f "$BACKUP_DIR/database.sql.gz" ]; then
  echo "Restoring database..."
  gunzip -c "$BACKUP_DIR/database.sql.gz" | \
    docker exec -i wordpress_db mysql \
      -u ${MYSQL_USER:-wordpress} \
      -p${MYSQL_PASSWORD:-wordpress_password} \
      ${MYSQL_DATABASE:-wordpress}
  echo "✓ Database restored"
fi

# Restore files
if [ -f "$BACKUP_DIR/wp-content.tar.gz" ]; then
  echo "Restoring WordPress files..."
  
  # Stop WordPress temporarily
  docker-compose stop wordpress
  
  # Restore wp-content
  docker run --rm \
    -v wordpress_data:/data \
    -v "$BACKUP_DIR":/backup \
    alpine sh -c "cd /data && rm -rf * && tar -xzf /backup/wp-content.tar.gz --strip-components=3"
  
  # Fix permissions
  docker-compose start wordpress
  sleep 2
  docker exec wordpress_app chown -R www-data:www-data /var/www/html/wp-content
  docker exec wordpress_app chmod -R 755 /var/www/html/wp-content
  
  echo "✓ Files restored"
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "✓ Restore completed successfully!"
echo "Please verify your site at https://formatho.com/insights/"
