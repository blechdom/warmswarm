# Database Backups

This directory contains PostgreSQL database backups for WarmSwarm.

## Files

- `warmswarm_latest.sql` - Most recent backup (committed to git)
- `warmswarm_YYYYMMDD_HHMMSS.sql` - Timestamped backups (not committed)
- `warmswarm_data_*.sql` - Data-only backups
- `warmswarm_schema_*.sql` - Schema-only backups

## Usage

### Create Backup
\`\`\`bash
bash backend/scripts/backup_database.sh
\`\`\`

### Restore from Latest Backup
\`\`\`bash
bash backend/scripts/restore_database.sh
\`\`\`

### Restore from Specific Backup
\`\`\`bash
bash backend/scripts/restore_database.sh backend/backups/warmswarm_20241020_120000.sql
\`\`\`

## Automatic Backups

Backups are automatically created before each git commit via pre-commit hook.

The `warmswarm_latest.sql` file is always committed to the repository,
while timestamped backups are kept locally for history (last 10 retained).
