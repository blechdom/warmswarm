# Database Backup & Restore Guide

## Overview

WarmSwarm includes an automated database backup system that:
- ✅ Creates backups before every git commit (pre-commit hook)
- ✅ Stores the latest backup in the repository
- ✅ Keeps timestamped local backups (last 10)
- ✅ Provides easy restore functionality

---

## Quick Commands

### Create Manual Backup
```bash
bash backend/scripts/backup_database.sh
```

### Restore Latest Backup
```bash
bash backend/scripts/restore_database.sh
```

### Restore Specific Backup
```bash
bash backend/scripts/restore_database.sh backend/backups/warmswarm_20241020_120000.sql
```

---

## How It Works

### Pre-Commit Hook

Every time you run `git commit`, the pre-commit hook automatically:

1. Checks if PostgreSQL is running
2. Creates a database backup
3. Updates `warmswarm_latest.sql`
4. Stages the latest backup for commit

**Example:**
```bash
git add src/app/page.tsx
git commit -m "Update home page"

# Output:
# 🔄 Running pre-commit database backup...
# ✅ Backup created successfully!
# ✅ Database backup added to commit
```

### Backup Types

Three backup files are created each time:

| File | Purpose | Size | Committed? |
|------|---------|------|------------|
| `warmswarm_TIMESTAMP.sql` | Full backup (schema + data) | ~136KB | ❌ Local only |
| `warmswarm_data_TIMESTAMP.sql` | Data only (faster imports) | ~100KB | ❌ Local only |
| `warmswarm_schema_TIMESTAMP.sql` | Schema only (documentation) | ~36KB | ❌ Local only |
| `warmswarm_latest.sql` | Latest full backup | ~136KB | ✅ **Committed** |

---

## Backup Contents

### Current Database (as of last backup):

```
Swarms: 6
Members: 7  
Roles: 13
Content: 164
  - Audio: 89
  - Images: 67
  - Text: 4
  - Timers: 4
Messages: 0
```

### Includes:

- ✅ All tables and data
- ✅ Views and functions
- ✅ Triggers
- ✅ Sequences
- ✅ ENUMs and custom types
- ✅ Indexes and constraints

---

## Restore Process

### 1. Full Restore (Recommended)

Drops and recreates everything:

```bash
bash backend/scripts/restore_database.sh

# Prompts for confirmation:
# ⚠️  WARNING: This will drop and recreate the database!
#    All current data will be lost.
# Are you sure you want to continue? (yes/no):
```

### 2. Manual Restore

For more control:

```bash
# Restore from latest
docker compose exec -T postgres psql -U postgres < backend/backups/warmswarm_latest.sql

# Or restore from specific backup
docker compose exec -T postgres psql -U postgres < backend/backups/warmswarm_20241020_120000.sql
```

### 3. Data-Only Restore

If schema already exists:

```bash
docker compose exec -T postgres psql -U postgres -d swarms < backend/backups/warmswarm_data_20241020_120000.sql
```

---

## Backup Retention

### Local Backups

- Timestamped backups are kept locally
- Automatically cleans up (keeps last 10)
- Not committed to git

### Repository Backup

- `warmswarm_latest.sql` is always committed
- Updated with every commit
- Provides team-wide rollback point

---

## Disaster Recovery

### Scenario 1: Lost Local Database

```bash
# Quick restore from repo
bash backend/scripts/restore_database.sh backend/backups/warmswarm_latest.sql
```

### Scenario 2: Need Older Version

```bash
# List available backups
ls -lh backend/backups/

# Restore specific version
bash backend/scripts/restore_database.sh backend/backups/warmswarm_20241020_120000.sql
```

### Scenario 3: Fresh Clone

```bash
# Clone repo
git clone <repo-url>
cd warmswarm

# Start database
docker compose up -d postgres

# Restore included backup
bash backend/scripts/restore_database.sh
```

---

## Backup Format

The backup files are standard PostgreSQL SQL dumps with:

```sql
-- Drop and recreate database
DROP DATABASE IF EXISTS swarms;
CREATE DATABASE swarms;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create types
CREATE TYPE content_type AS ENUM ('audio', 'image', 'text', 'preset', 'timer', 'instruction');

-- Create tables
CREATE TABLE swarms ( ... );
CREATE TABLE swarm_roles ( ... );
-- ... all tables

-- Insert data
COPY swarms FROM stdin;
...
```

---

## Configuration

### Change Backup Location

Edit `backend/scripts/backup_database.sh`:

```bash
BACKUP_DIR="backend/backups"  # Change this
```

### Change Retention Policy

Edit `backend/scripts/backup_database.sh`:

```bash
# Keep last 10 backups
BACKUP_COUNT=10  # Change this number
```

### Disable Pre-Commit Hook

```bash
# Remove or rename the hook
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
```

---

## Troubleshooting

### "PostgreSQL container is not running"

```bash
docker compose up -d postgres
```

### "Backup file not found"

```bash
# Create a new backup first
bash backend/scripts/backup_database.sh
```

### "Permission denied"

```bash
# Make scripts executable
chmod +x backend/scripts/*.sh
chmod +x .git/hooks/pre-commit
```

### Large Backup Files

If backups become very large (>10MB), consider:

1. **Git LFS** for large files
2. **External storage** (S3, cloud storage)
3. **Data-only backups** for routine saves

---

## Best Practices

### ✅ DO:

- Commit after significant data changes
- Keep local backups for development
- Test restores periodically
- Document custom data migrations

### ❌ DON'T:

- Commit sensitive production data
- Disable pre-commit hook without backup plan
- Delete timestamped backups manually (auto-cleanup handles it)

---

## Advanced Usage

### Backup to Remote Storage

```bash
# After backup, upload to S3
bash backend/scripts/backup_database.sh
aws s3 cp backend/backups/warmswarm_latest.sql s3://my-bucket/backups/
```

### Scheduled Backups (Cron)

```bash
# Add to crontab
0 */6 * * * cd /path/to/warmswarm && bash backend/scripts/backup_database.sh
```

### Backup Before Migrations

```bash
# Always backup before schema changes
bash backend/scripts/backup_database.sh
docker compose exec postgres psql -U postgres -d swarms -f backend/migrations/004_new_migration.sql
```

---

## Database Statistics

Current size breakdown:

```
Total Backup Size: 136KB

Tables:
- swarms: 6 rows
- swarm_members: 7 rows  
- swarm_roles: 13 rows
- swarm_content: 164 rows
  - swarm_content_audio: 89 rows
  - swarm_content_images: 67 rows
  - swarm_content_text: 4 rows
  - swarm_content_timers: 4 rows
```

---

## See Also

- `backend/backups/README.md` - Backup directory info
- `DATABASE-SCHEMA.md` - Schema documentation
- `IMPLEMENTATION-GUIDE.md` - Migration guide

