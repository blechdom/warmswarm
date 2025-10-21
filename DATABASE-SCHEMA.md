# WarmSwarm - Improved PostgreSQL Schema

## Design Principles

Converting from MongoDB's document-based approach to proper relational tables:

❌ **MongoDB Approach:** Everything in one `content` collection with `parent_id` hierarchy  
✅ **PostgreSQL Approach:** Normalized tables with proper foreign keys and relationships

---

## Core Tables (Already Exist)

### 1. `swarms`
```sql
CREATE TABLE swarms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    privacy VARCHAR(50) NOT NULL CHECK (privacy IN ('public', 'private', 'hidden')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('event', 'project', 'social', 'work', 'other')),
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. `swarm_members`
```sql
CREATE TABLE swarm_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    nickname VARCHAR(100) NOT NULL,
    joined_at TIMESTAMP DEFAULT NOW(),
    is_creator BOOLEAN DEFAULT false,
    UNIQUE(swarm_id, nickname)
);
```

---

## New Tables - Roles & Permissions

### 3. `swarm_roles`
**Instead of:** JSONB with role permissions  
**Use:** Proper role table with boolean columns

```sql
CREATE TABLE swarm_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Audio permissions
    can_send_audio BOOLEAN DEFAULT false,
    can_receive_audio BOOLEAN DEFAULT true,
    
    -- Text/message permissions
    can_send_text BOOLEAN DEFAULT false,
    can_receive_text BOOLEAN DEFAULT true,
    
    -- Image permissions
    can_send_images BOOLEAN DEFAULT false,
    can_receive_images BOOLEAN DEFAULT true,
    
    -- Control permissions
    can_view_members BOOLEAN DEFAULT true,
    can_view_activity_log BOOLEAN DEFAULT false,
    can_schedule_content BOOLEAN DEFAULT false,
    can_manage_roles BOOLEAN DEFAULT false,
    
    -- UI settings
    show_menu BOOLEAN DEFAULT true,
    show_title BOOLEAN DEFAULT true,
    
    color VARCHAR(7),  -- Hex color for UI (#FF0000)
    icon VARCHAR(50),  -- Icon identifier
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(swarm_id, name)
);

-- Index for lookups
CREATE INDEX idx_swarm_roles_swarm_id ON swarm_roles(swarm_id);
```

**Example Roles:**
```sql
-- Conductor (full control)
INSERT INTO swarm_roles (swarm_id, name, description,
    can_send_audio, can_receive_audio, can_send_text, can_receive_text,
    can_send_images, can_receive_images, can_view_members, 
    can_view_activity_log, can_schedule_content, can_manage_roles)
VALUES (
    '...', 'Conductor', 'Full control over performance',
    true, true, true, true, true, true, true, true, true, true
);

-- Performer (receive only)
INSERT INTO swarm_roles (swarm_id, name, description,
    can_send_audio, can_receive_audio, can_send_text, can_receive_text,
    can_send_images, can_receive_images)
VALUES (
    '...', 'Performer', 'Receives instructions and audio',
    false, true, false, true, false, true
);

-- Lead (can send and receive)
INSERT INTO swarm_roles (swarm_id, name, description,
    can_send_audio, can_receive_audio, can_send_text, can_receive_text,
    can_view_members)
VALUES (
    '...', 'Lead', 'Lead performer with communication ability',
    true, true, true, true, true
);
```

### 4. `swarm_member_roles`
**Many-to-many relationship:** Members can have multiple roles

```sql
CREATE TABLE swarm_member_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES swarm_members(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES swarm_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES swarm_members(id),
    
    UNIQUE(member_id, role_id)
);

CREATE INDEX idx_member_roles_member ON swarm_member_roles(member_id);
CREATE INDEX idx_member_roles_role ON swarm_member_roles(role_id);
```

---

## Content Library Tables

### 5. `swarm_content`
**Instead of:** MongoDB `content` collection with mixed types  
**Use:** Base content table with type discrimination

```sql
CREATE TYPE content_type AS ENUM (
    'audio',
    'image',
    'text',
    'preset',
    'timer',
    'instruction'
);

CREATE TABLE swarm_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    type content_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    created_by UUID REFERENCES swarm_members(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Optional: soft delete
    deleted_at TIMESTAMP
);

CREATE INDEX idx_content_swarm ON swarm_content(swarm_id);
CREATE INDEX idx_content_type ON swarm_content(swarm_id, type);
CREATE INDEX idx_content_creator ON swarm_content(created_by);
```

### 6. `swarm_content_audio`
**Instead of:** JSONB with audio metadata  
**Use:** Dedicated audio table

```sql
CREATE TABLE swarm_content_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    -- Storage
    source_type VARCHAR(20) CHECK (source_type IN ('url', 'upload', 'tts', 'generated')),
    url TEXT,
    file_path TEXT,
    
    -- Metadata
    duration_ms INTEGER,
    format VARCHAR(10),  -- 'mp3', 'wav', 'ogg', 'webm'
    bitrate INTEGER,
    file_size_bytes BIGINT,
    
    -- TTS specific
    tts_text TEXT,
    tts_language VARCHAR(10),  -- 'en', 'es', 'fr', etc.
    tts_voice VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);

CREATE INDEX idx_audio_content ON swarm_content_audio(content_id);
```

**Example:**
```sql
-- Insert audio content
INSERT INTO swarm_content (swarm_id, type, name, description, created_by)
VALUES ('...', 'audio', 'Countdown Beep', 'Short countdown sound', '...')
RETURNING id;

-- Add audio metadata
INSERT INTO swarm_content_audio (content_id, source_type, url, duration_ms, format)
VALUES ('...', 'upload', '/snd/uploads/beep.mp3', 1500, 'mp3');
```

### 7. `swarm_content_images`
```sql
CREATE TABLE swarm_content_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    -- Storage
    source_type VARCHAR(20) CHECK (source_type IN ('url', 'upload')),
    url TEXT,
    file_path TEXT,
    
    -- Metadata
    width INTEGER,
    height INTEGER,
    format VARCHAR(10),  -- 'jpg', 'png', 'gif', 'svg'
    file_size_bytes BIGINT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);
```

### 8. `swarm_content_text`
**For teleprompts and text instructions**

```sql
CREATE TABLE swarm_content_text (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    text_content TEXT NOT NULL,
    
    -- Display settings (instead of JSONB)
    font_family VARCHAR(100),
    font_size INTEGER,
    font_color VARCHAR(7),  -- Hex color
    background_color VARCHAR(7),
    text_align VARCHAR(20),  -- 'left', 'center', 'right'
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);
```

### 9. `swarm_content_timers`
```sql
CREATE TABLE swarm_content_timers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    duration_ms INTEGER NOT NULL,
    label VARCHAR(100),  -- "5 Second Timer", "1 Minute Break"
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);
```

---

## Content Delivery & Scheduling

### 10. `swarm_messages`
**Instead of:** Socket.IO events only  
**Use:** Persistent message log

```sql
CREATE TYPE message_type AS ENUM (
    'text',
    'audio',
    'image',
    'preset',
    'system'
);

CREATE TABLE swarm_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES swarm_members(id) ON DELETE SET NULL,
    
    type message_type NOT NULL,
    content_id UUID REFERENCES swarm_content(id) ON DELETE SET NULL,
    text_content TEXT,
    
    -- Targeting (instead of JSONB arrays)
    target_all BOOLEAN DEFAULT false,
    
    sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_swarm ON swarm_messages(swarm_id, sent_at DESC);
CREATE INDEX idx_messages_sender ON swarm_messages(sender_id);
```

### 11. `swarm_message_targets_roles`
**Instead of:** JSONB array of role names  
**Use:** Junction table for many-to-many

```sql
CREATE TABLE swarm_message_targets_roles (
    message_id UUID NOT NULL REFERENCES swarm_messages(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES swarm_roles(id) ON DELETE CASCADE,
    
    PRIMARY KEY (message_id, role_id)
);

CREATE INDEX idx_msg_targets_roles ON swarm_message_targets_roles(message_id);
```

### 12. `swarm_message_targets_members`
**For direct messages to specific members**

```sql
CREATE TABLE swarm_message_targets_members (
    message_id UUID NOT NULL REFERENCES swarm_messages(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES swarm_members(id) ON DELETE CASCADE,
    
    PRIMARY KEY (message_id, member_id)
);

CREATE INDEX idx_msg_targets_members ON swarm_message_targets_members(message_id);
```

### 13. `swarm_scheduled_events`
**For timed content delivery**

```sql
CREATE TYPE event_status AS ENUM (
    'pending',
    'sent',
    'cancelled',
    'failed'
);

CREATE TABLE swarm_scheduled_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    scheduled_time TIMESTAMP NOT NULL,
    status event_status DEFAULT 'pending',
    
    target_all BOOLEAN DEFAULT false,
    
    created_by UUID REFERENCES swarm_members(id),
    created_at TIMESTAMP DEFAULT NOW(),
    sent_at TIMESTAMP
);

CREATE INDEX idx_scheduled_events_time ON swarm_scheduled_events(swarm_id, scheduled_time)
    WHERE status = 'pending';
```

### 14. `swarm_scheduled_event_targets_roles`
```sql
CREATE TABLE swarm_scheduled_event_targets_roles (
    event_id UUID NOT NULL REFERENCES swarm_scheduled_events(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES swarm_roles(id) ON DELETE CASCADE,
    
    PRIMARY KEY (event_id, role_id)
);
```

### 15. `swarm_scheduled_event_targets_members`
```sql
CREATE TABLE swarm_scheduled_event_targets_members (
    event_id UUID NOT NULL REFERENCES swarm_scheduled_events(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES swarm_members(id) ON DELETE CASCADE,
    
    PRIMARY KEY (event_id, member_id)
);
```

---

## Activity Logging

### 16. `swarm_activity_log`
**Instead of:** JSONB details field  
**Use:** Typed activity log with foreign keys

```sql
CREATE TYPE activity_action AS ENUM (
    'member_joined',
    'member_left',
    'role_assigned',
    'role_removed',
    'content_created',
    'content_sent',
    'content_received',
    'event_scheduled',
    'event_sent',
    'permission_changed'
);

CREATE TABLE swarm_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    member_id UUID REFERENCES swarm_members(id) ON DELETE SET NULL,
    
    action activity_action NOT NULL,
    
    -- Related entities
    target_member_id UUID REFERENCES swarm_members(id) ON DELETE SET NULL,
    role_id UUID REFERENCES swarm_roles(id) ON DELETE SET NULL,
    content_id UUID REFERENCES swarm_content(id) ON DELETE SET NULL,
    
    -- Additional context (minimal JSONB for truly flexible data)
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_swarm ON swarm_activity_log(swarm_id, created_at DESC);
CREATE INDEX idx_activity_member ON swarm_activity_log(member_id);
CREATE INDEX idx_activity_action ON swarm_activity_log(swarm_id, action);
```

**Example queries:**
```sql
-- Get all activities for a swarm
SELECT * FROM swarm_activity_log 
WHERE swarm_id = '...' 
ORDER BY created_at DESC 
LIMIT 100;

-- Get content delivery history
SELECT 
    al.created_at,
    m.nickname AS sender,
    c.name AS content_name,
    c.type AS content_type
FROM swarm_activity_log al
JOIN swarm_members m ON al.member_id = m.id
JOIN swarm_content c ON al.content_id = c.id
WHERE al.swarm_id = '...' 
  AND al.action = 'content_sent'
ORDER BY al.created_at DESC;
```

---

## Preset Collections (Multi-Content)

### 17. `swarm_presets`
**For combining multiple content items**

```sql
CREATE TABLE swarm_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    created_by UUID REFERENCES swarm_members(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 18. `swarm_preset_items`
```sql
CREATE TABLE swarm_preset_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preset_id UUID NOT NULL REFERENCES swarm_presets(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    sequence_order INTEGER NOT NULL,
    delay_ms INTEGER DEFAULT 0,  -- Delay before this item
    
    UNIQUE(preset_id, sequence_order)
);

CREATE INDEX idx_preset_items ON swarm_preset_items(preset_id, sequence_order);
```

**Example:**
```sql
-- Create a countdown preset
INSERT INTO swarm_presets (swarm_id, name, description)
VALUES ('...', 'Countdown 5-4-3-2-1', 'Visual countdown sequence')
RETURNING id;

-- Add images in sequence
INSERT INTO swarm_preset_items (preset_id, content_id, sequence_order, delay_ms)
VALUES 
    ('...', 'image_5_id', 1, 0),
    ('...', 'image_4_id', 2, 1000),
    ('...', 'image_3_id', 3, 1000),
    ('...', 'image_2_id', 4, 1000),
    ('...', 'image_1_id', 5, 1000);
```

---

## View Helpers

### Useful Views for Common Queries

```sql
-- Member permissions view (aggregate all roles)
CREATE VIEW swarm_member_permissions AS
SELECT 
    sm.id AS member_id,
    sm.swarm_id,
    sm.nickname,
    bool_or(sr.can_send_audio) AS can_send_audio,
    bool_or(sr.can_receive_audio) AS can_receive_audio,
    bool_or(sr.can_send_text) AS can_send_text,
    bool_or(sr.can_receive_text) AS can_receive_text,
    bool_or(sr.can_send_images) AS can_send_images,
    bool_or(sr.can_receive_images) AS can_receive_images,
    bool_or(sr.can_view_members) AS can_view_members,
    bool_or(sr.can_view_activity_log) AS can_view_activity_log,
    bool_or(sr.can_schedule_content) AS can_schedule_content,
    bool_or(sr.can_manage_roles) AS can_manage_roles
FROM swarm_members sm
LEFT JOIN swarm_member_roles smr ON sm.id = smr.member_id
LEFT JOIN swarm_roles sr ON smr.role_id = sr.id
GROUP BY sm.id, sm.swarm_id, sm.nickname;

-- Content with metadata view
CREATE VIEW swarm_content_full AS
SELECT 
    c.id,
    c.swarm_id,
    c.type,
    c.name,
    c.description,
    c.created_at,
    CASE 
        WHEN c.type = 'audio' THEN jsonb_build_object(
            'url', ca.url,
            'duration_ms', ca.duration_ms,
            'format', ca.format
        )
        WHEN c.type = 'image' THEN jsonb_build_object(
            'url', ci.url,
            'width', ci.width,
            'height', ci.height
        )
        WHEN c.type = 'text' THEN jsonb_build_object(
            'text', ct.text_content,
            'font_color', ct.font_color
        )
    END AS metadata
FROM swarm_content c
LEFT JOIN swarm_content_audio ca ON c.id = ca.content_id
LEFT JOIN swarm_content_images ci ON c.id = ci.content_id
LEFT JOIN swarm_content_text ct ON c.id = ct.content_id;
```

---

## Migration from Current Schema

```sql
-- Step 1: Add new tables (run all CREATE TABLE statements above)

-- Step 2: Migrate existing data (if any)
-- (Current WarmSwarm doesn't have content/roles yet, so this is future-proof)

-- Step 3: Update application code to use new tables
```

---

## Advantages Over MongoDB Approach

### ✅ **Data Integrity**
- Foreign keys ensure relationships are valid
- CHECK constraints validate enum values
- UNIQUE constraints prevent duplicates
- CASCADE deletes maintain referential integrity

### ✅ **Query Performance**
```sql
-- Get all messages sent to a specific role (WITH INDEXES!)
SELECT m.*, sm.nickname 
FROM swarm_messages m
JOIN swarm_message_targets_roles mtr ON m.id = mtr.message_id
JOIN swarm_members sm ON m.sender_id = sm.id
WHERE mtr.role_id = '...'
ORDER BY m.sent_at DESC;

-- Get member's effective permissions (aggregates multiple roles)
SELECT * FROM swarm_member_permissions WHERE member_id = '...';
```

### ✅ **Type Safety**
- ENUMs instead of free-form strings
- INTEGER for durations (not string "05:30")
- BOOLEAN instead of "checked"/"" strings
- UUID for all IDs

### ✅ **Scalability**
- Proper indexes on foreign keys
- Partitioning possible on timestamp columns
- Efficient joins vs document scanning

### ✅ **Flexibility Where Needed**
- Still use JSONB for truly variable metadata
- But 95% of data is in proper columns

---

## Complete Schema Size

**Total Tables: 18**
- Core: 2 (swarms, swarm_members)
- Roles: 2 (swarm_roles, swarm_member_roles)
- Content: 6 (content base + 5 type-specific)
- Messaging: 3 (messages + 2 targeting)
- Scheduling: 3 (events + 2 targeting)
- Activity: 1 (activity_log)
- Presets: 2 (presets + items)

**Lines of SQL:** ~500 (vs MongoDB's ~50 lines but with proper structure!)

This is a **proper relational database** 🎯

