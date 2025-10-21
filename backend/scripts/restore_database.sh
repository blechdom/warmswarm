#!/bin/bash
# Database Restore Script for WarmSwarm
# Restores database from backup file

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    WarmSwarm Database Restore Tool        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if backup file argument is provided
BACKUP_FILE="${1:-backend/backups/warmswarm_latest.sql}"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}❌ Backup file not found: ${BACKUP_FILE}${NC}"
    echo ""
    echo "Usage:"
    echo "  $0 [backup_file]"
    echo ""
    echo "Available backups:"
    ls -lh backend/backups/*.sql 2>/dev/null || echo "  No backups found"
    exit 1
fi

# Check if PostgreSQL is running
if ! docker compose ps postgres | grep -q "Up"; then
    echo -e "${RED}❌ PostgreSQL container is not running!${NC}"
    echo "Start it with: docker compose up -d postgres"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will drop and recreate the database!${NC}"
echo -e "${YELLOW}   All current data will be lost.${NC}"
echo ""
echo -e "Restoring from: ${BACKUP_FILE}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

echo -e "${BLUE}📦 Restoring database...${NC}"

# Restore the backup
docker compose exec -T postgres psql -U postgres < "${BACKUP_FILE}"

echo ""
echo -e "${GREEN}✅ Database restored successfully!${NC}"
echo ""

# Show statistics
echo -e "${BLUE}📊 Database Statistics:${NC}"
docker compose exec postgres psql -U postgres -d swarms -t -c "
SELECT 
    'Swarms: ' || COUNT(*) FROM swarms
UNION ALL
SELECT 
    'Members: ' || COUNT(*) FROM swarm_members
UNION ALL
SELECT 
    'Roles: ' || COUNT(*) FROM swarm_roles
UNION ALL
SELECT 
    'Content: ' || COUNT(*) FROM swarm_content
UNION ALL
SELECT 
    'Messages: ' || COUNT(*) FROM swarm_messages;
"

echo ""
echo -e "${GREEN}🎉 Restore complete!${NC}"

