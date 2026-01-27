# WordPress Backup Strategies

Complete guide to backing up your WordPress site running in Docker.

## Table of Contents

1. [What to Backup](#what-to-backup)
2. [Backup Strategies](#backup-strategies)
3. [Automated Backup Solutions](#automated-backup-solutions)
4. [Manual Backup Methods](#manual-backup-methods)
5. [Backup Frequency Recommendations](#backup-frequency-recommendations)
6. [Storage Locations](#storage-locations)
7. [Restoration Procedures](#restoration-procedures)
8. [Best Practices](#best-practices)

---

## What to Backup

### Critical Components

1. **Database** (Most Critical)
   - All posts, pages, comments
   - User accounts and permissions
   - Settings and configurations
   - Plugin data
   - Theme customizations stored in database

2. **WordPress Files**
   - `/wp-content/themes/` - Your themes (including Formatho theme)
   - `/wp-content/plugins/` - All plugins
   - `/wp-content/uploads/` - Media files (images, documents, etc.)
   - `/wp-content/` - Other customizations

3. **Configuration Files** (Optional but Recommended)
   - `wp-config.php` - Database credentials and settings
   - `.htaccess` - URL rewrite rules (if using Apache)

---

## Backup Strategies

### Strategy 1: Full Site Backup (Recommended)

**What**: Complete backup of database + all files
**When**: Daily or before major changes
**Best For**: Production sites, critical data

```bash
#!/bin/bash
# Full WordPress Backup Script

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="wordpress-full-$DATE"

mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

# Backup Database
docker exec wordpress_db mysqldump \
  -u ${MYSQL_USER} \
  -p${MYSQL_PASSWORD} \
  ${MYSQL_DATABASE} \
  > "$BACKUP_DIR/$BACKUP_NAME/database.sql"

# Backup WordPress Content
docker exec wordpress_app tar -czf - /var/www/html/wp-content \
  > "$BACKUP_DIR/$BACKUP_NAME/wp-content.tar.gz"

# Backup wp-config.php (if customized)
docker exec wordpress_app cat /var/www/html/wp-config.php \
  > "$BACKUP_DIR/$BACKUP_NAME/wp-config.php" 2>/dev/null || true

# Create archive
cd "$BACKUP_DIR"
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

echo "Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
```

### Strategy 2: Database-Only Backup (Quick)

**What**: Database dump only
**When**: Multiple times per day, before content changes
**Best For**: Content-heavy sites, frequent updates

```bash
#!/bin/bash
# Database Backup Script

BACKUP_DIR="./backups/database"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"

docker exec wordpress_db mysqldump \
  -u ${MYSQL_USER} \
  -p${MYSQL_PASSWORD} \
  ${MYSQL_DATABASE} \
  | gzip > "$BACKUP_DIR/db-$DATE.sql.gz"

# Keep only last 30 days
find "$BACKUP_DIR" -name "db-*.sql.gz" -mtime +30 -delete

echo "Database backup: $BACKUP_DIR/db-$DATE.sql.gz"
```

### Strategy 3: Files-Only Backup

**What**: WordPress files without database
**When**: After theme/plugin installations, weekly
**Best For**: When database changes are minimal

```bash
#!/bin/bash
# Files Backup Script

BACKUP_DIR="./backups/files"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"

# Backup wp-content
docker exec wordpress_app tar -czf - /var/www/html/wp-content \
  > "$BACKUP_DIR/wp-content-$DATE.tar.gz"

# Keep only last 7 days
find "$BACKUP_DIR" -name "wp-content-*.tar.gz" -mtime +7 -delete

echo "Files backup: $BACKUP_DIR/wp-content-$DATE.tar.gz"
```

### Strategy 4: Incremental Backup

**What**: Only changed files since last backup
**When**: Multiple times per day
**Best For**: Large sites, bandwidth concerns

```bash
#!/bin/bash
# Incremental Backup Script

BACKUP_DIR="./backups/incremental"
DATE=$(date +%Y%m%d-%H%M%S)
LAST_BACKUP="$BACKUP_DIR/last-backup.txt"
mkdir -p "$BACKUP_DIR"

# Get list of changed files since last backup
if [ -f "$LAST_BACKUP" ]; then
  docker exec wordpress_app find /var/www/html/wp-content \
    -newer "$(cat $LAST_BACKUP)" \
    -type f > "$BACKUP_DIR/changed-files-$DATE.txt"

  # Backup only changed files
  docker exec wordpress_app tar -czf - \
    -T "$BACKUP_DIR/changed-files-$DATE.txt" \
    > "$BACKUP_DIR/incremental-$DATE.tar.gz"
else
  echo "No previous backup found. Creating full backup..."
  docker exec wordpress_app tar -czf - /var/www/html/wp-content \
    > "$BACKUP_DIR/incremental-$DATE.tar.gz"
fi

# Update last backup timestamp
echo "$(date)" > "$LAST_BACKUP"

echo "Incremental backup: $BACKUP_DIR/incremental-$DATE.tar.gz"
```

---

## Automated Backup Solutions

### Option 1: Cron Job (Linux/Mac)

Create a cron job to run backups automatically:

```bash
# Edit crontab
crontab -e

# Add these lines:

# Daily full backup at 2 AM
0 2 * * * /path/to/backup-scripts/full-backup.sh

# Database backup every 6 hours
0 */6 * * * /path/to/backup-scripts/db-backup.sh

# Weekly files backup on Sunday at 3 AM
0 3 * * 0 /path/to/backup-scripts/files-backup.sh
```

### Option 2: Docker Cron Container

Create a dedicated backup container:

```yaml
# Add to docker-compose.yml
backup:
  image: alpine:latest
  container_name: wordpress_backup
  restart: unless-stopped
  volumes:
    - ./backups:/backups
    - ./backup-scripts:/scripts
    - wordpress_data:/wp-content:ro
    - db_data:/var/lib/mysql:ro
  environment:
    MYSQL_USER: ${MYSQL_USER}
    MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    MYSQL_DATABASE: ${MYSQL_DATABASE}
  command: >
    sh -c "
      apk add --no-cache mysql-client bash &&
      crond -f -l 2
    "
  networks:
    - app-network
  depends_on:
    - db
    - wordpress
```

### Option 3: WordPress Backup Plugins

Popular plugins that work with Docker:

1. **UpdraftPlus**
   - Free and premium versions
   - Automated backups to cloud storage
   - Easy restoration

2. **BackWPup**
   - Free plugin
   - Multiple storage destinations
   - Scheduled backups

3. **Duplicator**
   - Migration and backup tool
   - Creates complete site packages

**Note**: Plugins store backups in `/wp-content/`, so ensure your volume includes this.

### Option 4: Cloud Storage Integration

#### AWS S3 Backup Script

```bash
#!/bin/bash
# Backup to AWS S3

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)
S3_BUCKET="your-wordpress-backups"

# Create backup
./full-backup.sh

# Upload to S3
aws s3 cp "$BACKUP_DIR/wordpress-full-$DATE.tar.gz" \
  "s3://$S3_BUCKET/wordpress-full-$DATE.tar.gz"

# Cleanup local backup (optional)
rm "$BACKUP_DIR/wordpress-full-$DATE.tar.gz"
```

#### Google Drive Backup Script

```bash
#!/bin/bash
# Backup to Google Drive using rclone

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup
./full-backup.sh

# Upload to Google Drive
rclone copy "$BACKUP_DIR/wordpress-full-$DATE.tar.gz" \
  gdrive:wordpress-backups/

# Cleanup local backup (optional)
rm "$BACKUP_DIR/wordpress-full-$DATE.tar.gz"
```

---

## Manual Backup Methods

### Method 1: Docker Exec Commands

```bash
# Database Backup
docker exec wordpress_db mysqldump \
  -u wordpress \
  -pwordpress_password \
  wordpress > backup-$(date +%Y%m%d).sql

# Files Backup
docker exec wordpress_app tar -czf - /var/www/html/wp-content \
  > wp-content-$(date +%Y%m%d).tar.gz
```

### Method 2: Docker Volume Backup

```bash
# Backup Docker volumes directly
docker run --rm \
  -v wordpress_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar -czf /backup/wordpress-data-$(date +%Y%m%d).tar.gz -C /data .

docker run --rm \
  -v db_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar -czf /backup/db-data-$(date +%Y%m%d).tar.gz -C /data .
```

### Method 3: WordPress Admin Export

1. Go to **WordPress Admin** > **Tools** > **Export**
2. Choose what to export (All content, Posts, Pages, etc.)
3. Download XML file
4. **Limitation**: Only exports content, not files or database settings

---

## Backup Frequency Recommendations

### Production Sites

- **Database**: Every 6 hours or before major changes
- **Files**: Daily
- **Full Backup**: Daily (off-peak hours)
- **Off-site Backup**: Weekly

### Development/Staging Sites

- **Database**: Before testing major changes
- **Files**: Weekly
- **Full Backup**: Weekly

### High-Traffic Sites

- **Database**: Every 2-4 hours
- **Files**: Every 12 hours
- **Full Backup**: Daily
- **Off-site Backup**: Daily

### Low-Traffic Sites

- **Database**: Daily
- **Files**: Weekly
- **Full Backup**: Weekly
- **Off-site Backup**: Monthly

---

## Storage Locations

### Local Storage

```bash
./backups/
├── database/
│   ├── db-20231229-020000.sql.gz
│   └── db-20231229-080000.sql.gz
├── files/
│   ├── wp-content-20231229.tar.gz
│   └── wp-content-20231230.tar.gz
└── full/
    ├── wordpress-full-20231229.tar.gz
    └── wordpress-full-20231230.tar.gz
```

### Cloud Storage Options

1. **AWS S3** - Reliable, scalable
2. **Google Cloud Storage** - Good integration
3. **Backblaze B2** - Cost-effective
4. **Dropbox** - Easy setup
5. **Google Drive** - Free tier available
6. **OneDrive** - Microsoft integration

### Backup Retention Policy

```bash
# Keep backups for different periods
# Daily backups: 30 days
# Weekly backups: 12 weeks (3 months)
# Monthly backups: 12 months (1 year)

find ./backups/daily -name "*.tar.gz" -mtime +30 -delete
find ./backups/weekly -name "*.tar.gz" -mtime +84 -delete
find ./backups/monthly -name "*.tar.gz" -mtime +365 -delete
```

---

## Restoration Procedures

### Restore Database

```bash
# Method 1: From SQL dump
docker exec -i wordpress_db mysql \
  -u ${MYSQL_USER} \
  -p${MYSQL_PASSWORD} \
  ${MYSQL_DATABASE} < backup-20231229.sql

# Method 2: From compressed dump
gunzip < backup-20231229.sql.gz | \
  docker exec -i wordpress_db mysql \
    -u ${MYSQL_USER} \
    -p${MYSQL_PASSWORD} \
    ${MYSQL_DATABASE}
```

### Restore WordPress Files

```bash
# Stop WordPress container
docker-compose stop wordpress

# Restore wp-content
docker run --rm \
  -v wordpress_data:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "cd /data && rm -rf * && tar -xzf /backup/wp-content-20231229.tar.gz --strip-components=3"

# Fix permissions
docker exec wordpress_app chown -R www-data:www-data /var/www/html/wp-content
docker exec wordpress_app chmod -R 755 /var/www/html/wp-content

# Start WordPress container
docker-compose start wordpress
```

### Full Site Restore

```bash
#!/bin/bash
# Full Restore Script

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file.tar.gz>"
  exit 1
fi

# Extract backup
TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Restore database
if [ -f "$TEMP_DIR/database.sql" ]; then
  docker exec -i wordpress_db mysql \
    -u ${MYSQL_USER} \
    -p${MYSQL_PASSWORD} \
    ${MYSQL_DATABASE} < "$TEMP_DIR/database.sql"
fi

# Restore files
if [ -f "$TEMP_DIR/wp-content.tar.gz" ]; then
  docker run --rm \
    -v wordpress_data:/data \
    -v "$TEMP_DIR":/backup \
    alpine sh -c "cd /data && rm -rf * && tar -xzf /backup/wp-content.tar.gz --strip-components=3"

  docker exec wordpress_app chown -R www-data:www-data /var/www/html/wp-content
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo "Restore complete!"
```

---

## Best Practices

### 1. 3-2-1 Backup Rule

- **3** copies of your data
- **2** different storage media
- **1** off-site backup

### 2. Test Your Backups

```bash
# Monthly restore test
# 1. Create test environment
# 2. Restore latest backup
# 3. Verify site functionality
# 4. Document any issues
```

### 3. Encrypt Sensitive Backups

```bash
# Encrypt backup before storing
tar -czf - backup/ | \
  openssl enc -aes-256-cbc -salt \
  -out backup-encrypted.tar.gz.enc \
  -pass pass:your-secure-password

# Decrypt when needed
openssl enc -aes-256-cbc -d \
  -in backup-encrypted.tar.gz.enc \
  -out backup-decrypted.tar.gz \
  -pass pass:your-secure-password
```

### 4. Monitor Backup Success

```bash
#!/bin/bash
# Backup with email notification

./full-backup.sh

if [ $? -eq 0 ]; then
  echo "Backup successful: $(date)" | \
    mail -s "WordPress Backup Success" admin@example.com
else
  echo "Backup failed: $(date)" | \
    mail -s "WordPress Backup FAILED" admin@example.com
fi
```

### 5. Version Control for Configuration

```bash
# Track wp-config.php changes
git init ./wordpress-config
cp wp-config.php ./wordpress-config/
git add wp-config.php
git commit -m "Initial wp-config.php"
```

### 6. Backup Before Updates

```bash
#!/bin/bash
# Pre-update backup

echo "Creating backup before update..."
./full-backup.sh

echo "Backup complete. Proceeding with update..."
# Run WordPress update commands here
```

### 7. Document Backup Procedures

- Keep a written procedure document
- Include restore steps
- Test procedures quarterly
- Update documentation when procedures change

---

## Quick Reference Commands

### Create Backup Scripts Directory

```bash
mkdir -p backup-scripts backups/{database,files,full}
chmod +x backup-scripts/*.sh
```

### Common Backup Commands

```bash
# Quick database backup
docker exec wordpress_db mysqldump -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > db-backup.sql

# Quick files backup
docker exec wordpress_app tar -czf - /var/www/html/wp-content > wp-content-backup.tar.gz

# List backups
ls -lh backups/

# Check backup size
du -sh backups/

# Verify backup integrity
tar -tzf backup.tar.gz > /dev/null && echo "Backup is valid" || echo "Backup is corrupted"
```

---

## Emergency Recovery

### Complete Site Recovery

```bash
# 1. Stop all containers
docker-compose down

# 2. Restore volumes from backup
# (See restoration procedures above)

# 3. Start containers
docker-compose up -d

# 4. Verify site
curl -I https://formatho.com/insights/
```

### Database-Only Recovery

```bash
# If only database is corrupted
docker exec -i wordpress_db mysql \
  -u ${MYSQL_USER} \
  -p${MYSQL_PASSWORD} \
  ${MYSQL_DATABASE} < latest-db-backup.sql
```

---

## Monitoring and Alerts

### Backup Health Check Script

```bash
#!/bin/bash
# Check if backups are being created

BACKUP_DIR="./backups"
DAYS_THRESHOLD=2

# Check for recent database backup
LATEST_DB=$(find "$BACKUP_DIR/database" -name "*.sql.gz" -type f -mtime -$DAYS_THRESHOLD | head -1)

if [ -z "$LATEST_DB" ]; then
  echo "WARNING: No recent database backup found!"
  exit 1
fi

# Check backup size (should be > 0)
SIZE=$(stat -f%z "$LATEST_DB" 2>/dev/null || stat -c%s "$LATEST_DB" 2>/dev/null)

if [ "$SIZE" -eq 0 ]; then
  echo "WARNING: Backup file is empty!"
  exit 1
fi

echo "Backup health check passed: $LATEST_DB ($SIZE bytes)"
```

---

## Summary

### Recommended Setup for Your Site

1. **Daily Full Backup** (2 AM)
2. **Database Backup Every 6 Hours**
3. **Weekly Off-site Backup** (Cloud storage)
4. **Monthly Restore Test**
5. **Automated Monitoring** (Email alerts on failure)

### Quick Start

```bash
# 1. Create backup scripts
mkdir -p backup-scripts backups

# 2. Copy backup scripts from this guide

# 3. Make scripts executable
chmod +x backup-scripts/*.sh

# 4. Test manual backup
./backup-scripts/full-backup.sh

# 5. Set up cron job
crontab -e
# Add: 0 2 * * * /path/to/backup-scripts/full-backup.sh
```

**Remember**: A backup is only as good as your ability to restore it. Test your restore procedures regularly!
