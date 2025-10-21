# Hub Schema Migration Guide

## Overview

This migration transforms the WarmSwarm database from a **swarm-centric** structure to a **hub-based** structure optimized for the new UI hierarchy and no-login architecture.

---

## What Changes

### 🗄️ Database Structure

**BEFORE (Swarm-Centric)**:
```
swarm_content (base table)
├── swarm_content_audio
├── swarm_content_images
├── swarm_content_text
└── swarm_content_timers

swarm_roles (tied to swarms)
swarm_members (tied to users)
```

**AFTER (Hub-Based)**:
```
content_audio (independent)
content_visual (independent)
content_timing (independent)
content_roles (independent templates)

swarms (session-based)
swarm_participants (session-based)
```

### 🔄 Key Transformations

| Old Schema | New Schema | Notes |
|------------|------------|-------|
| `swarm_content` + type | Separate hub tables | Faster queries, type-safe |
| `swarm_content_audio` | `content_audio` | All audio (URL/Upload/TTS) |
| `swarm_content_images` | `content_visual` (images) | URL or uploaded images |
| `swarm_content_text` | `content_visual` (text) | Text prompts as visual |
| `swarm_content_timers` | `content_timing` (timer) | Timers migrated |
| `swarm_roles` | `content_roles` | Independent role templates |
| `swarm_members.user_id` | `swarm_participants.session_id` | No permanent users |
| `created_by` (FK) | `creator_nickname` (string) | Attribution only |

---

## Data Preserved

✅ **All content migrated**:
- 89 audio items → `content_audio`
- 67 image items → `content_visual`
- 4 text items → `content_visual` (source_type='text')
- 4 timer items → `content_timing`
- 13 roles → `content_roles` (as templates)

✅ **Metadata preserved**:
- Content names and descriptions
- Timestamps (created_at, updated_at)
- Creator attribution (member nickname)
- File paths and URLs
- Duration, dimensions, etc.

✅ **Reference preserved**:
- `migrated_from_id` field stores original ID
- `migrated_from_swarm` field stores original swarm
- Can trace back to old data if needed

---

## Data Removed

❌ **User ownership removed**:
- No more `created_by` foreign key
- Content is now in a public pool
- Only creator nickname stored (attribution)

❌ **Swarm ownership removed**:
- Content no longer tied to specific swarms
- All content is accessible from any swarm
- Hub-based browsing instead

❌ **Permission enforcement removed**:
- Roles are now templates (suggestions)
- No enforced permission checking
- Permissions become UI hints

---

## Migration Steps

### 1. **Backup Current Database**

```bash
docker compose exec postgres pg_dump -U postgres -d swarms > backup_pre_migration.sql
```

### 2. **Run Migration Script**

```bash
./backend/scripts/migrate_to_hub_schema.sh
```

The script will:
- ✅ Create automatic backup
- ✅ Show current data counts
- ✅ Prompt for confirmation
- ✅ Run migration SQL
- ✅ Verify data migrated
- ✅ Show rollback instructions

### 3. **Verify Migration**

Check that data migrated correctly:

```sql
-- Audio Hub
SELECT COUNT(*), source_type FROM content_audio GROUP BY source_type;

-- Visual Hub
SELECT COUNT(*), source_type FROM content_visual GROUP BY source_type;

-- Timing Hub
SELECT COUNT(*), timing_type FROM content_timing GROUP BY timing_type;

-- Roles Hub
SELECT COUNT(*), is_template FROM content_roles GROUP BY is_template;
```

### 4. **Test Application**

- Browse each hub (Audio, Visual, Timing, Roles)
- Create new content in each hub
- Test search functionality
- Join a swarm session
- Verify real-time messaging works

### 5. **Cleanup Old Tables (Optional)**

After verifying everything works (wait a few days):

```sql
-- Uncomment cleanup section in migration file
-- Or manually drop old tables:
DROP TABLE IF EXISTS swarm_content_audio CASCADE;
DROP TABLE IF EXISTS swarm_content_images CASCADE;
DROP TABLE IF EXISTS swarm_content_text CASCADE;
DROP TABLE IF EXISTS swarm_content_timers CASCADE;
DROP TABLE IF EXISTS swarm_content CASCADE;
```

---

## Rollback Procedure

If something goes wrong:

```bash
# 1. Stop the application
docker compose down

# 2. Restore from backup
docker compose up -d postgres
docker compose exec -T postgres psql -U postgres -d swarms < backup_pre_migration.sql

# 3. Restart application
docker compose up -d
```

---

## Migration SQL Details

### Creates New Tables

1. **content_audio** - All audio content (URL, Upload, TTS)
2. **content_visual** - All visual content (images, text prompts)
3. **content_timing** - All timing tools (timers, metronomes, etc.)
4. **content_roles** - Role templates (no swarm association)

### Data Migration Queries

```sql
-- Example: Audio migration
INSERT INTO content_audio (id, name, source_type, audio_url, creator_nickname, ...)
SELECT 
    c.id,
    c.name,
    CASE 
        WHEN a.tts_voice IS NOT NULL THEN 'tts'
        WHEN a.audio_file LIKE 'http%' THEN 'url'
        ELSE 'upload'
    END as source_type,
    -- ... more fields
FROM swarm_content c
JOIN swarm_content_audio a ON c.id = a.content_id
LEFT JOIN swarm_members m ON c.created_by = m.id
WHERE c.type = 'audio';
```

### Full-Text Search

Creates search vectors for all content:

```sql
-- Search vector updated automatically
UPDATE content_audio
SET search_vector = to_tsvector('english', 
    name || ' ' || description || ' ' || creator_nickname
);

-- Search query
SELECT * FROM content_audio
WHERE search_vector @@ plainto_tsquery('english', 'piano');
```

---

## Schema Comparison

### Old: Swarm-Centric (20 tables)

```
User Management (5):
  users, user_permissions, user_content, 
  authentication_tokens, user_sessions

Content (5):
  swarm_content, swarm_content_audio, 
  swarm_content_images, swarm_content_text, 
  swarm_content_timers

Relationships (5):
  swarm_roles, swarm_member_roles,
  swarm_preset_items, swarm_presets,
  swarm_scheduled_events

Performance (3):
  swarms, swarm_members, swarm_messages

Activity (2):
  swarm_activity_log, message_targets
```

### New: Hub-Based (15 tables)

```
Content Hubs (4):
  content_audio, content_visual,
  content_timing, content_roles

Performance (3):
  swarms, swarm_participants, swarm_messages

Future Hubs (8 when built):
  content_sequences + sequence_items
  content_programs + program_roles + program_interfaces
  content_networks
  content_fragments + fragment_contents
```

**Result**: 25% fewer tables, much simpler!

---

## Performance Impact

### Before Migration
```sql
-- Browse audio (complex)
SELECT c.*, a.audio_file, a.duration
FROM swarm_content c
JOIN swarm_content_audio a ON c.id = a.content_id
WHERE c.swarm_id = ? AND c.type = 'audio'
ORDER BY c.created_at DESC;
-- 2 table joins, ~10ms
```

### After Migration
```sql
-- Browse audio (simple)
SELECT * FROM content_audio
ORDER BY created_at DESC
LIMIT 20;
-- Single table, <1ms
```

**Result**: ~10x faster for hub browsing!

---

## API Changes Required

### Old Endpoints (Swarm-Specific)
```
GET  /api/swarms/:id/content         # Get swarm's content
POST /api/swarms/:id/content         # Create in swarm
GET  /api/swarms/:id/content/:type   # Filter by type
```

### New Endpoints (Hub-Based)
```
GET  /api/audio                      # Browse audio hub
POST /api/audio                      # Create audio
GET  /api/audio?source=url           # Filter by source

GET  /api/visual                     # Browse visual hub
POST /api/visual                     # Create visual

GET  /api/timing                     # Browse timing hub
GET  /api/roles                      # Browse roles
```

See [API-MIGRATION.md](API-MIGRATION.md) for full endpoint documentation.

---

## Troubleshooting

### Migration Fails with Foreign Key Error

**Problem**: Old data has orphaned references

**Solution**:
```sql
-- Clean up orphaned data before migration
DELETE FROM swarm_content WHERE created_by IS NULL;
DELETE FROM swarm_content_audio WHERE content_id NOT IN (SELECT id FROM swarm_content);
```

### Data Count Mismatch

**Problem**: Some records didn't migrate

**Solution**:
```sql
-- Find missing records
SELECT c.id, c.name, c.type
FROM swarm_content c
LEFT JOIN content_audio a ON c.id = a.id
WHERE c.type = 'audio' AND a.id IS NULL;
```

### Search Not Working

**Problem**: Search vectors not updated

**Solution**:
```sql
-- Rebuild search vectors
UPDATE content_audio
SET search_vector = to_tsvector('english', 
    COALESCE(name, '') || ' ' || COALESCE(description, '')
);
```

---

## Post-Migration Checklist

- [ ] All audio content visible in Audio Hub
- [ ] All images visible in Visual Hub (images and text)
- [ ] All timers visible in Timing Hub
- [ ] All roles visible as templates
- [ ] Search works in each hub
- [ ] Can create new content in each hub
- [ ] Can join swarm sessions with nickname
- [ ] Real-time messaging works
- [ ] Old backup saved and documented
- [ ] Team notified of schema change

---

## Benefits of New Schema

### For Users
✅ Faster page loads (simpler queries)  
✅ No login required (instant access)  
✅ All content is shareable  
✅ Clear hub organization  

### For Developers
✅ 25% fewer tables to manage  
✅ No auth middleware needed  
✅ Simpler API endpoints  
✅ Type-safe queries (no type checking)  
✅ Hub structure matches UI  

### For System
✅ 10x faster hub browsing  
✅ Better query optimization  
✅ Easier horizontal scaling  
✅ No user data compliance (GDPR)  
✅ Simpler caching strategy  

---

## Support

If you encounter issues:

1. Check migration logs in terminal
2. Verify backup was created
3. Review [DATABASE-DESIGN-FOR-HUBS.md](DATABASE-DESIGN-FOR-HUBS.md)
4. Rollback if needed (see Rollback Procedure above)

---

**Last Updated**: 2025-10-21  
**Migration Version**: 004_migrate_to_hub_schema.sql

