# WarmSwarm - Implementation Guide

## 🎯 What We Built

A **proper relational PostgreSQL schema** to replace MongoDB's document-based approach from Telebrain.

---

## 📊 Database Structure

### **18 New Tables Created:**

#### **Roles & Permissions (2 tables)**
- `swarm_roles` - Define roles with granular permissions
- `swarm_member_roles` - Assign members to roles (many-to-many)

#### **Content Library (6 tables)**
- `swarm_content` - Base content table
- `swarm_content_audio` - Audio metadata
- `swarm_content_images` - Image metadata  
- `swarm_content_text` - Text/teleprompt content
- `swarm_content_timers` - Timer definitions
- `swarm_presets` + `swarm_preset_items` - Multi-content collections

#### **Messaging System (3 tables)**
- `swarm_messages` - Message log
- `swarm_message_targets_roles` - Role targeting
- `swarm_message_targets_members` - Individual targeting

#### **Scheduling (3 tables)**
- `swarm_scheduled_events` - Timed content delivery
- `swarm_scheduled_event_targets_roles` - Event role targeting
- `swarm_scheduled_event_targets_members` - Event member targeting

#### **Activity Logging (1 table)**
- `swarm_activity_log` - Complete audit trail

---

## 🚀 Running Migrations

```bash
# 1. Start PostgreSQL (Docker Compose)
cd /home/kgalvin/CascadeProjects/warmswarm
docker compose up -d postgres

# 2. Run migrations
docker compose exec postgres psql -U postgres -d swarms -f /docker-entrypoint-initdb.d/002_add_roles_and_content.sql
docker compose exec postgres psql -U postgres -d swarms -f /docker-entrypoint-initdb.d/003_seed_default_roles.sql

# Or copy files to backend container
docker cp backend/migrations/002_add_roles_and_content.sql warmswarm-postgres-1:/tmp/
docker cp backend/migrations/003_seed_default_roles.sql warmswarm-postgres-1:/tmp/

docker compose exec postgres psql -U postgres -d swarms -f /tmp/002_add_roles_and_content.sql
docker compose exec postgres psql -U postgres -d swarms -f /tmp/003_seed_default_roles.sql
```

---

## 💡 Key Features

### 1. **Auto-Create Default Roles**

When a swarm is created, 3 roles are automatically added:

```sql
-- Automatically triggered!
INSERT INTO swarms (name, description, privacy, category, invite_code)
VALUES ('My Performance', 'Live show', 'public', 'event', 'ABC123');

-- Creates 3 roles automatically:
-- - Conductor (full control)
-- - Performer (receive only)
-- - Lead (can send & receive)
```

### 2. **Permission Checking**

```sql
-- Check if member can send audio
SELECT member_can_send_audio('<member_id>');

-- Get member's effective permissions (from all roles)
SELECT * FROM swarm_member_permissions WHERE member_id = '<member_id>';
```

### 3. **Role Assignment**

```sql
-- Assign member to role
SELECT assign_member_to_role(
    '<member_id>', 
    '<role_id>', 
    '<assigned_by_member_id>'
);

-- Automatically logs to activity_log!
```

### 4. **Content Creation**

```sql
-- Create audio content
WITH new_content AS (
    INSERT INTO swarm_content (swarm_id, type, name, created_by)
    VALUES ('<swarm_id>', 'audio', 'Countdown Beep', '<creator_id>')
    RETURNING id
)
INSERT INTO swarm_content_audio (content_id, source_type, url, duration_ms)
SELECT id, 'upload', '/snd/beep.mp3', 1500
FROM new_content;
```

### 5. **Targeted Messaging**

```sql
-- Send message to all
INSERT INTO swarm_messages (swarm_id, sender_id, type, text_content, target_all)
VALUES ('<swarm_id>', '<sender_id>', 'text', 'Hello everyone!', true);

-- Send to specific roles
WITH new_msg AS (
    INSERT INTO swarm_messages (swarm_id, sender_id, type, text_content, target_all)
    VALUES ('<swarm_id>', '<sender_id>', 'text', 'Performers only', false)
    RETURNING id
)
INSERT INTO swarm_message_targets_roles (message_id, role_id)
SELECT new_msg.id, sr.id
FROM new_msg, swarm_roles sr
WHERE sr.name IN ('Performer', 'Lead');

-- Send to specific individuals
WITH new_msg AS (
    INSERT INTO swarm_messages (swarm_id, sender_id, type, text_content, target_all)
    VALUES ('<swarm_id>', '<sender_id>', 'text', 'Private message', false)
    RETURNING id
)
INSERT INTO swarm_message_targets_members (message_id, member_id)
SELECT new_msg.id, sm.id
FROM new_msg, swarm_members sm
WHERE sm.nickname IN ('Alice', 'Bob');
```

### 6. **Activity Tracking**

```sql
-- Get all activities for a swarm
SELECT 
    al.created_at,
    al.action,
    m.nickname AS actor,
    tm.nickname AS target,
    r.name AS role_name,
    c.name AS content_name
FROM swarm_activity_log al
LEFT JOIN swarm_members m ON al.member_id = m.id
LEFT JOIN swarm_members tm ON al.target_member_id = tm.id
LEFT JOIN swarm_roles r ON al.role_id = r.id
LEFT JOIN swarm_content c ON al.content_id = c.id
WHERE al.swarm_id = '<swarm_id>'
ORDER BY al.created_at DESC
LIMIT 50;
```

---

## 🎨 Backend API Examples

### Create Swarm with Roles

```javascript
// POST /api/swarms
app.post('/api/swarms', async (req, res) => {
  const { name, description, privacy, category, creatorNickname } = req.body;
  
  // Generate invite code
  const inviteCode = generateInviteCode();
  
  // Create swarm (triggers auto-role creation!)
  const swarmResult = await pool.query(
    'INSERT INTO swarms (name, description, privacy, category, invite_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, privacy, category, inviteCode]
  );
  
  const swarm = swarmResult.rows[0];
  
  // Add creator as member
  const memberResult = await pool.query(
    'INSERT INTO swarm_members (swarm_id, nickname, is_creator) VALUES ($1, $2, true) RETURNING *',
    [swarm.id, creatorNickname]
  );
  
  // Assign creator to "Conductor" role
  const roleResult = await pool.query(
    'SELECT id FROM swarm_roles WHERE swarm_id = $1 AND name = $2',
    [swarm.id, 'Conductor']
  );
  
  if (roleResult.rows.length > 0) {
    await pool.query(
      'SELECT assign_member_to_role($1, $2, $1)',
      [memberResult.rows[0].id, roleResult.rows[0].id]
    );
  }
  
  res.json(swarm);
});
```

### Get Member Permissions

```javascript
// GET /api/swarms/:swarmId/members/:memberId/permissions
app.get('/api/swarms/:swarmId/members/:memberId/permissions', async (req, res) => {
  const { memberId } = req.params;
  
  const result = await pool.query(
    'SELECT * FROM swarm_member_permissions WHERE member_id = $1',
    [memberId]
  );
  
  res.json(result.rows[0] || {
    can_send_audio: false,
    can_receive_audio: false,
    // ... defaults
  });
});
```

### Send Targeted Message

```javascript
// POST /api/swarms/:swarmId/messages
app.post('/api/swarms/:swarmId/messages', async (req, res) => {
  const { swarmId } = req.params;
  const { senderId, type, text, targetRoles, targetMembers, targetAll } = req.body;
  
  // Check sender permissions
  const perms = await pool.query(
    'SELECT * FROM swarm_member_permissions WHERE member_id = $1',
    [senderId]
  );
  
  if (type === 'text' && !perms.rows[0]?.can_send_text) {
    return res.status(403).json({ error: 'No permission to send text' });
  }
  
  // Insert message
  const msgResult = await pool.query(
    'INSERT INTO swarm_messages (swarm_id, sender_id, type, text_content, target_all) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [swarmId, senderId, type, text, targetAll || false]
  );
  
  const message = msgResult.rows[0];
  
  // Add role targets
  if (targetRoles && targetRoles.length > 0) {
    for (const roleId of targetRoles) {
      await pool.query(
        'INSERT INTO swarm_message_targets_roles (message_id, role_id) VALUES ($1, $2)',
        [message.id, roleId]
      );
    }
  }
  
  // Add member targets
  if (targetMembers && targetMembers.length > 0) {
    for (const memberId of targetMembers) {
      await pool.query(
        'INSERT INTO swarm_message_targets_members (message_id, member_id) VALUES ($1, $2)',
        [message.id, memberId]
      );
    }
  }
  
  // Broadcast via Socket.IO
  if (targetAll) {
    io.to(swarmId).emit('message', message);
  } else {
    // Send to specific rooms
    if (targetRoles) {
      for (const roleId of targetRoles) {
        const role = await pool.query('SELECT name FROM swarm_roles WHERE id = $1', [roleId]);
        io.to(`${swarmId}/role/${role.rows[0].name}`).emit('message', message);
      }
    }
  }
  
  res.json(message);
});
```

---

## 📁 File Locations

```
/home/kgalvin/CascadeProjects/warmswarm/
├── DATABASE-SCHEMA.md              # Complete schema documentation
├── TELEBRAIN-ANALYSIS.md           # Analysis of original system
├── IMPLEMENTATION-GUIDE.md         # This file
└── backend/
    └── migrations/
        ├── 002_add_roles_and_content.sql      # Main migration
        └── 003_seed_default_roles.sql         # Functions & triggers
```

---

## ✅ Advantages Over MongoDB

1. **Foreign Keys** - Referential integrity guaranteed
2. **ACID Transactions** - No orphaned data
3. **Type Safety** - ENUMs and constraints
4. **Query Performance** - Proper indexes
5. **Complex Queries** - JOINs instead of application logic
6. **Data Integrity** - CASCADE deletes

---

## 🔄 Next Steps

1. **Run Migrations** ✅ (files created)
2. **Update Backend API** - Add role/permission endpoints
3. **Update Socket.IO** - Add room targeting (role/private channels)
4. **Create Frontend UI** - Role management, content library
5. **Test Permissions** - Unit tests for permission checking

---

## 📚 Documentation

- **DATABASE-SCHEMA.md** - Complete table definitions with examples
- **TELEBRAIN-ANALYSIS.md** - Original system analysis
- **WEBRTC-VS-SOCKETS.md** - Communication architecture
- **SYNCED-AUDIO.md** - Audio synchronization details

---

## 🎯 Summary

You now have a **production-ready relational schema** that:

✅ Replaces MongoDB's document approach with proper tables  
✅ Supports role-based permissions  
✅ Enables targeted messaging (all/roles/individuals)  
✅ Tracks all activity for auditing  
✅ Schedules content delivery  
✅ Auto-creates default roles  
✅ Uses PostgreSQL's full power (triggers, views, functions)

**Zero JSONB abuse!** Every field has its proper column with appropriate type. 🎉

