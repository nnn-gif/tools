# WordPress Docker Setup Review

## Current Status: ✅ FIXED

### Data Persistence Analysis

#### ✅ **Database (MariaDB) - PERSISTENT**

- **Volume**: `db_data:/var/lib/mysql`
- **Status**: ✅ Data will persist across container restarts
- **Contains**: All WordPress database content (posts, pages, settings, users, etc.)

#### ✅ **WordPress Content - NOW PERSISTENT**

- **Volume**: `wordpress_data:/var/www/html/wp-content`
- **Status**: ✅ Fixed - Data will now persist across container restarts
- **Contains**:
  - Themes (including Formatho theme)
  - Plugins
  - Uploads/media files
  - Custom configurations

#### ✅ **Nginx Proxy - PERSISTENT**

- **Volumes**:
  - `./nginx-proxy.conf` (config)
  - `./certbot/conf` (SSL certificates)
  - `./certbot/www` (certbot webroot)
- **Status**: ✅ Data will persist

#### ✅ **Certbot - PERSISTENT**

- **Volumes**: SSL certificates stored in `./certbot/conf`
- **Status**: ✅ SSL certificates will persist

---

## What Was Fixed

### Before (❌ Data Loss Risk)

```yaml
wordpress:
  # NO volumes - all data lost on container restart
```

### After (✅ Data Persists)

```yaml
wordpress:
  volumes:
    - wordpress_data:/var/www/html/wp-content
```

---

## What Persists Now

### ✅ Will Persist (Survives Container Restart)

1. **Database**: All posts, pages, comments, users, settings
2. **Themes**: Formatho theme and any other themes
3. **Plugins**: All installed plugins
4. **Uploads**: All media files (images, documents, etc.)
5. **Customizations**: Theme customizations, widget settings
6. **SSL Certificates**: Let's Encrypt certificates

### ⚠️ Will NOT Persist (Recreated on Container Start)

1. **WordPress Core Files**: Recreated from image (this is fine)
2. **wp-config.php**: Recreated from environment variables (this is fine)

---

## How to Apply the Fix

### Option 1: Update Existing Setup

```bash
# Stop containers
docker-compose down

# Update docker-compose.yml with the new volumes

# Start containers (will create new volume)
docker-compose up -d
```

### Option 2: Migrate Existing Data (If WordPress Already Has Content)

If you already have WordPress content and want to preserve it:

```bash
# 1. Backup existing WordPress content
docker exec wordpress_app tar -czf /tmp/wp-content-backup.tar.gz /var/www/html/wp-content

# 2. Copy backup to host
docker cp wordpress_app:/tmp/wp-content-backup.tar.gz ./wp-content-backup.tar.gz

# 3. Stop containers
docker-compose down

# 4. Update docker-compose.yml with volumes

# 5. Start containers
docker-compose up -d

# 6. Restore content
docker cp ./wp-content-backup.tar.gz wordpress_app:/tmp/
docker exec wordpress_app tar -xzf /tmp/wp-content-backup.tar.gz -C /var/www/html/
docker exec wordpress_app chown -R www-data:www-data /var/www/html/wp-content
```

---

## Volume Locations

### Docker Volumes (Managed by Docker)

- `db_data`: `/var/lib/docker/volumes/<project>_db_data/_data`
- `wordpress_data`: `/var/lib/docker/volumes/<project>_wordpress_data/_data`

### Host Directories (Bind Mounts)

- `./nginx-proxy.conf`: Nginx configuration
- `./certbot/conf`: SSL certificates
- `./certbot/www`: Certbot webroot

---

## Backup Recommendations

### Database Backup

```bash
# Backup database
docker exec wordpress_db mysqldump -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > backup-$(date +%Y%m%d).sql

# Restore database
docker exec -i wordpress_db mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < backup-20231229.sql
```

### WordPress Content Backup

```bash
# Backup wp-content
docker exec wordpress_app tar -czf - /var/www/html/wp-content > wp-content-backup-$(date +%Y%m%d).tar.gz

# Restore wp-content
docker exec -i wordpress_app tar -xzf - -C /var/www/html/ < wp-content-backup-20231229.tar.gz
docker exec wordpress_app chown -R www-data:www-data /var/www/html/wp-content
```

---

## Testing Data Persistence

### Test 1: Container Restart

```bash
# Restart WordPress container
docker-compose restart wordpress

# Verify data still exists
docker exec wordpress_app ls -la /var/www/html/wp-content/themes/
```

### Test 2: Full Recreate

```bash
# Stop and remove containers (volumes remain)
docker-compose down

# Start fresh containers
docker-compose up -d

# Verify data still exists
docker exec wordpress_app ls -la /var/www/html/wp-content/themes/
```

### Test 3: Volume Inspection

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect <project>_wordpress_data
```

---

## Security Notes

1. **File Permissions**: WordPress runs as `www-data` user
2. **Volume Access**: Only accessible by containers in the same network
3. **Backup Security**: Store backups securely, especially database backups containing user data

---

## Troubleshooting

### Issue: Permission Errors After Restore

```bash
# Fix permissions
docker exec wordpress_app chown -R www-data:www-data /var/www/html/wp-content
docker exec wordpress_app chmod -R 755 /var/www/html/wp-content
```

### Issue: Volume Not Created

```bash
# Create volume manually
docker volume create <project>_wordpress_data

# Then start containers
docker-compose up -d
```

### Issue: Data Not Persisting

```bash
# Check volume mount
docker inspect wordpress_app | grep -A 10 Mounts

# Verify volume exists
docker volume ls | grep wordpress_data
```

---

## Summary

✅ **Database**: Persists (was already configured correctly)
✅ **WordPress Content**: Now persists (fixed with volume mount)
✅ **SSL Certificates**: Persist (already configured)
✅ **Nginx Config**: Persists (already configured)

**All critical data will now survive container restarts!**
