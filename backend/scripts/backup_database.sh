#!/bin/bash
# Database Backup Script for WarmSwarm
# Creates a timestamped backup of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="backend/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/warmswarm_${TIMESTAMP}.sql"
LATEST_BACKUP="${BACKUP_DIR}/warmswarm_latest.sql"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     WarmSwarm Database Backup Tool        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Check if PostgreSQL container is running
if ! docker compose ps postgres | grep -q "Up"; then
    echo -e "${RED}❌ PostgreSQL container is not running!${NC}"
    echo "Start it with: docker compose up -d postgres"
    exit 1
fi

echo -e "${BLUE}📦 Creating database backup...${NC}"

# Create full backup with schema and data
docker compose exec -T postgres pg_dump -U postgres -d swarms \
    --clean \
    --if-exists \
    --create \
    --no-owner \
    --no-privileges \
    > "${BACKUP_FILE}"

# Also create a "latest" backup for convenience
cp "${BACKUP_FILE}" "${LATEST_BACKUP}"

# Get backup size
BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)

echo -e "${GREEN}✅ Backup created successfully!${NC}"
echo ""
echo -e "  📄 File: ${BACKUP_FILE}"
echo -e "  💾 Size: ${BACKUP_SIZE}"
echo ""

# Create a data-only backup (for quick imports)
DATA_BACKUP="${BACKUP_DIR}/warmswarm_data_${TIMESTAMP}.sql"
docker compose exec -T postgres pg_dump -U postgres -d swarms \
    --data-only \
    --no-owner \
    --no-privileges \
    > "${DATA_BACKUP}"

DATA_SIZE=$(du -h "${DATA_BACKUP}" | cut -f1)

echo -e "${GREEN}✅ Data-only backup created!${NC}"
echo ""
echo -e "  📄 File: ${DATA_BACKUP}"
echo -e "  💾 Size: ${DATA_SIZE}"
echo ""

# Create a schema-only backup (for documentation)
SCHEMA_BACKUP="${BACKUP_DIR}/warmswarm_schema_${TIMESTAMP}.sql"
docker compose exec -T postgres pg_dump -U postgres -d swarms \
    --schema-only \
    --no-owner \
    --no-privileges \
    > "${SCHEMA_BACKUP}"

SCHEMA_SIZE=$(du -h "${SCHEMA_BACKUP}" | cut -f1)

echo -e "${GREEN}✅ Schema-only backup created!${NC}"
echo ""
echo -e "  📄 File: ${SCHEMA_BACKUP}"
echo -e "  💾 Size: ${SCHEMA_SIZE}"
echo ""

# Count records
echo -e "${BLUE}📊 Database Statistics:${NC}"
docker compose exec postgres psql -U postgres -d swarms -t -c "
SELECT 
    (SELECT COUNT(*) FROM swarms) as swarms,
    (SELECT COUNT(*) FROM swarm_members) as members,
    (SELECT COUNT(*) FROM swarm_roles) as roles,
    (SELECT COUNT(*) FROM swarm_content) as content,
    (SELECT COUNT(*) FROM swarm_messages) as messages;
"

# Clean up old backups (keep last 10)
BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}"/warmswarm_*.sql 2>/dev/null | wc -l)
if [ "${BACKUP_COUNT}" -gt 30 ]; then
    echo -e "${BLUE}🧹 Cleaning up old backups (keeping last 10)...${NC}"
    ls -1t "${BACKUP_DIR}"/warmswarm_*.sql | tail -n +31 | xargs rm -f
    echo -e "${GREEN}✅ Cleanup complete${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Backup complete!${NC}"
echo ""
echo "To restore this backup:"
echo "  docker compose exec -T postgres psql -U postgres < ${BACKUP_FILE}"

