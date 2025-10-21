#!/bin/bash

# WarmSwarm Hub Schema Migration Script
# Migrates from swarm-based schema to hub-based schema (no login)

echo "╔══════════════════════════════════════════════════════╗"
echo "║  WarmSwarm Hub Schema Migration                     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker-compose is running
if ! docker compose ps | grep -q "postgres"; then
    echo -e "${RED}❌ Error: PostgreSQL container is not running${NC}"
    echo "Please start it with: docker compose up -d postgres"
    exit 1
fi

# Backup current database
echo "📦 Creating backup before migration..."
BACKUP_FILE="./backend/backups/pre_hub_migration_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p ./backend/backups
docker compose exec -T postgres pg_dump -U postgres -d swarms > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
    echo "   Size: $(du -h "$BACKUP_FILE" | awk '{print $1}')"
else
    echo -e "${RED}❌ Error creating backup${NC}"
    exit 1
fi

echo ""
echo "📊 Current Database Stats:"
docker compose exec -T postgres psql -U postgres -d swarms -c "
SELECT 
    'Audio (old)' as type, COUNT(*) as count FROM swarm_content WHERE type = 'audio'
UNION ALL
SELECT 'Images (old)', COUNT(*) FROM swarm_content WHERE type = 'image'
UNION ALL
SELECT 'Text (old)', COUNT(*) FROM swarm_content WHERE type = 'text'
UNION ALL
SELECT 'Timers (old)', COUNT(*) FROM swarm_content WHERE type = 'timer'
UNION ALL
SELECT 'Roles (old)', COUNT(*) FROM swarm_roles
UNION ALL
SELECT 'Swarms', COUNT(*) FROM swarms;
"

echo ""
read -p "⚠️  This will migrate to a new schema. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "🚀 Running migration..."
echo ""

# Run the migration
docker compose exec -T postgres psql -U postgres -d swarms < ./backend/migrations/004_migrate_to_hub_schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration completed!${NC}"
    echo ""
    
    # Show new table counts
    echo "📊 New Database Stats:"
    docker compose exec -T postgres psql -U postgres -d swarms -c "
    SELECT 
        'Audio (new)' as type, COUNT(*) as count FROM content_audio
    UNION ALL
    SELECT 'Visual (images)', COUNT(*) FROM content_visual WHERE source_type IN ('url', 'upload')
    UNION ALL
    SELECT 'Visual (text)', COUNT(*) FROM content_visual WHERE source_type = 'text'
    UNION ALL
    SELECT 'Timing (timers)', COUNT(*) FROM content_timing WHERE timing_type = 'timer'
    UNION ALL
    SELECT 'Roles (templates)', COUNT(*) FROM content_roles;
    "
    
    echo ""
    echo "✅ Next Steps:"
    echo "   1. Verify the data looks correct"
    echo "   2. Test the application with the new schema"
    echo "   3. If everything works, you can clean up old tables"
    echo "   4. Backup file saved to: $BACKUP_FILE"
    echo ""
    echo "To rollback, run:"
    echo "   docker compose exec -T postgres psql -U postgres -d swarms < $BACKUP_FILE"
    
else
    echo ""
    echo -e "${RED}❌ Migration failed!${NC}"
    echo ""
    echo "To restore from backup:"
    echo "   docker compose exec -T postgres psql -U postgres -d swarms < $BACKUP_FILE"
    exit 1
fi

