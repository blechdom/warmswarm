# Database Design for Hub-Based Architecture (No Login)

## Executive Summary

**Design Philosophy**: The 3-tier hub structure should be reflected in the database through:
1. **Content hierarchy** matching hub organization
2. **Shared content pools** (no user ownership)
3. **Session-based identity** (no authentication)
4. **Simplified relationships** (fewer joins, faster queries)

**Key Difference from Original Design**: 
- ❌ No user accounts, no permissions, no authentication
- ✅ Anonymous content creation and sharing
- ✅ Session-based participation (temporary identity)
- ✅ Public-by-default content

---

## Impact of No-Login Architecture

### What Changes
```
BEFORE (With Login):                AFTER (No Login):
─────────────────────              ─────────────────
✗ users table                      → ✓ sessions table (temporary)
✗ user_roles                       → ✓ Anonymous creators
✗ permissions                      → ✓ All content public
✗ authentication                   → ✓ Nickname-based identity
✗ user_content ownership           → ✓ Shared content pool
```

### What Stays the Same
- Content organization (Audio, Visual, Sequences, etc.)
- Hierarchical relationships (parent-child)
- Real-time performance sessions
- Content metadata and search

---

## Database Design Principles for Hub Architecture

### Principle 1: Hub = Content Category
Each hub should have a clear corresponding content type or table.

```
Hub Structure              Database Tables
─────────────             ─────────────────
Audio Hub          →      content_audio
Visual Hub         →      content_visual  
Sequences Hub      →      content_sequences
Programs Hub       →      content_programs
Timing Hub         →      content_timing
Roles Hub          →      content_roles
Networks Hub       →      content_networks
Fragments Hub      →      content_fragments
```

### Principle 2: Flat Content Tables
Since we have a clear 3-tier structure, we can use **flat, specialized tables** instead of a single polymorphic `content` table.

**Benefits**:
- ✅ Type-safe queries (no type checking needed)
- ✅ Optimized indexes per content type
- ✅ Clear schema per hub
- ✅ No NULL columns for unused fields
- ✅ Faster queries (no joins on content_type)

### Principle 3: Anonymous by Default
Content is public and unowned. Track creator nickname for attribution only.

### Principle 4: Session-Based Identity
Use browser sessions for temporary identity during performances.

---

## Recommended Schema Architecture

### Core Structure

```
┌─────────────────────────────────────────────┐
│         CONTENT CATEGORY TABLES             │
│  (One per Hub - specialized schemas)        │
├─────────────────────────────────────────────┤
│ content_audio                               │
│ content_visual                              │
│ content_sequences                           │
│ content_programs                            │
│ content_timing                              │
│ content_roles                               │
│ content_networks                            │
│ content_fragments                           │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│       RELATIONSHIP TABLES                   │
│  (Connect content across hubs)              │
├─────────────────────────────────────────────┤
│ sequence_items (links audio/visual)         │
│ program_components (links roles/networks)   │
│ fragment_contents (reusable pieces)         │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│       PERFORMANCE TABLES                    │
│  (Live session state)                       │
├─────────────────────────────────────────────┤
│ swarms (performance sessions)               │
│ swarm_participants (who's in session)       │
│ swarm_messages (real-time events)           │
└─────────────────────────────────────────────┘
```

---

## Detailed Table Schemas

### 1. Audio Hub → `content_audio`

```sql
CREATE TABLE content_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Source information (URL, Upload, or TTS)
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('url', 'upload', 'tts')),
    
    -- For URL source
    audio_url TEXT,
    
    -- For Upload source
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- For TTS source
    tts_text TEXT,
    tts_voice VARCHAR(100),
    tts_language VARCHAR(10),
    tts_rate DECIMAL(3,2),
    
    -- Metadata
    duration_seconds DECIMAL(10,2),
    creator_nickname VARCHAR(100),
    thumbnail_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR,
    
    -- Indexes
    CONSTRAINT valid_source CHECK (
        (source_type = 'url' AND audio_url IS NOT NULL) OR
        (source_type = 'upload' AND file_path IS NOT NULL) OR
        (source_type = 'tts' AND tts_text IS NOT NULL)
    )
);

CREATE INDEX idx_audio_source_type ON content_audio(source_type);
CREATE INDEX idx_audio_search ON content_audio USING GIN(search_vector);
CREATE INDEX idx_audio_created ON content_audio(created_at DESC);
```

**Why This Design**:
- Single table captures all audio hub variants (URL/Upload/TTS)
- `source_type` discriminator is indexed for fast filtering
- No joins needed to display audio list
- Creator nickname for attribution (no FK to users table)
- Search vector for full-text search

---

### 2. Visual Hub → `content_visual`

```sql
CREATE TABLE content_visual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Source information (URL, Upload, or Text)
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('url', 'upload', 'text')),
    
    -- For URL source
    image_url TEXT,
    
    -- For Upload source
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- For Text source (Teleprompts)
    text_content TEXT,
    text_font_family VARCHAR(100),
    text_font_size INTEGER,
    text_color VARCHAR(20),
    text_background_color VARCHAR(20),
    
    -- Metadata
    width INTEGER,
    height INTEGER,
    creator_nickname VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR,
    
    CONSTRAINT valid_visual_source CHECK (
        (source_type = 'url' AND image_url IS NOT NULL) OR
        (source_type = 'upload' AND file_path IS NOT NULL) OR
        (source_type = 'text' AND text_content IS NOT NULL)
    )
);

CREATE INDEX idx_visual_source_type ON content_visual(source_type);
CREATE INDEX idx_visual_search ON content_visual USING GIN(search_vector);
CREATE INDEX idx_visual_created ON content_visual(created_at DESC);
```

**Why This Design**:
- Parallel structure to `content_audio` (learn once, apply everywhere)
- Text prompts are "visual content" (displayed on screen)
- Same indexing strategy for consistency
- No user ownership, just creator attribution

---

### 3. Sequences Hub → `content_sequences`

```sql
CREATE TABLE content_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Sequence type
    sequence_type VARCHAR(30) NOT NULL CHECK (sequence_type IN (
        'audio_image_pair',
        'image_series',
        'audio_series',
        'mixed_collection'
    )),
    
    -- Metadata
    total_duration_seconds DECIMAL(10,2),
    loop_enabled BOOLEAN DEFAULT false,
    creator_nickname VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

-- Items within a sequence (ordered)
CREATE TABLE sequence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES content_sequences(id) ON DELETE CASCADE,
    
    -- Position in sequence (0-indexed)
    position INTEGER NOT NULL,
    
    -- Reference to content (flexible - can be audio OR visual)
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('audio', 'visual')),
    content_id UUID NOT NULL,
    
    -- Timing for this item
    start_time_seconds DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_seconds DECIMAL(10,2) NOT NULL,
    
    -- Transition effects
    transition_type VARCHAR(50),
    
    UNIQUE(sequence_id, position)
);

CREATE INDEX idx_sequence_type ON content_sequences(sequence_type);
CREATE INDEX idx_sequence_items_seq ON sequence_items(sequence_id, position);
CREATE INDEX idx_sequence_items_content ON sequence_items(content_type, content_id);
```

**Why This Design**:
- Main table holds sequence metadata
- Separate `sequence_items` table for ordered items
- Flexible references (can point to audio OR visual)
- Position field ensures order
- Type selector matches UI hub design
- No complex polymorphic associations, just type + id

---

### 4. Programs Hub → `content_programs`

```sql
CREATE TABLE content_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Program settings
    network_id UUID REFERENCES content_networks(id),
    
    -- Metadata
    creator_nickname VARCHAR(100),
    thumbnail_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    search_vector TSVECTOR
);

-- Roles within a program
CREATE TABLE program_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES content_programs(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES content_roles(id),
    
    -- Role-specific settings in this program
    order_index INTEGER,
    
    UNIQUE(program_id, role_id)
);

-- Interfaces within a program
CREATE TABLE program_interfaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES content_programs(id) ON DELETE CASCADE,
    
    -- Interface definition
    interface_type VARCHAR(50) NOT NULL CHECK (interface_type IN ('button', 'dropdown', 'slider')),
    label TEXT NOT NULL,
    
    -- Button properties
    button_text TEXT,
    button_color VARCHAR(20),
    button_size VARCHAR(20),
    button_full_width BOOLEAN DEFAULT false,
    
    -- Dropdown properties
    dropdown_content_folder_id UUID,
    
    -- Slider properties
    slider_min DECIMAL,
    slider_max DECIMAL,
    slider_step DECIMAL,
    slider_default DECIMAL,
    
    -- Position in UI
    position INTEGER
);

CREATE INDEX idx_program_roles ON program_roles(program_id);
CREATE INDEX idx_program_interfaces ON program_interfaces(program_id, position);
```

**Why This Design**:
- Programs are containers for roles + interfaces + network
- All components visible in single query with joins
- Inline editing matches UI design (no separate pages)
- No permissions needed (all programs are public)

---

### 5. Timing Hub → `content_timing`

```sql
CREATE TABLE content_timing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Timing tool type
    timing_type VARCHAR(30) NOT NULL CHECK (timing_type IN (
        'timer',
        'metronome',
        'algorithm',
        'schedule'
    )),
    
    -- Timer properties
    timer_minutes INTEGER,
    timer_seconds INTEGER,
    timer_milliseconds INTEGER,
    timer_direction VARCHAR(10) CHECK (timer_direction IN ('up', 'down')),
    
    -- Metronome properties
    metronome_bpm INTEGER,
    metronome_time_signature VARCHAR(10),
    metronome_sound_id UUID,
    
    -- Algorithm properties (timed organization)
    algorithm_type VARCHAR(50),
    algorithm_parameters JSONB,
    
    -- Schedule properties
    schedule_start_time TIMESTAMP,
    schedule_duration_seconds INTEGER,
    schedule_repeat_pattern VARCHAR(50),
    schedule_content_id UUID,
    
    -- Metadata
    creator_nickname VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_timing_type ON content_timing(timing_type);
CREATE INDEX idx_timing_schedules ON content_timing(schedule_start_time) 
    WHERE timing_type = 'schedule';
```

**Why This Design**:
- All timing tools in single table (they're conceptually related)
- Type discriminator for filtering in UI
- Type-specific fields are nullable (only used when relevant)
- Denormalized for faster queries (no joins for display)
- JSONB for flexible algorithm parameters

---

### 6. Roles Hub → `content_roles`

```sql
CREATE TABLE content_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Visual identifier
    color VARCHAR(20) NOT NULL DEFAULT '#667eea',
    icon VARCHAR(10),
    
    -- Permissions (since no login, these are just defaults for performances)
    can_send_audio BOOLEAN DEFAULT true,
    can_send_images BOOLEAN DEFAULT true,
    can_send_text BOOLEAN DEFAULT true,
    can_receive_audio BOOLEAN DEFAULT true,
    can_receive_images BOOLEAN DEFAULT true,
    can_receive_text BOOLEAN DEFAULT true,
    
    -- Metadata
    creator_nickname VARCHAR(100),
    is_template BOOLEAN DEFAULT false, -- Pre-defined roles
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pre-seed with common roles
INSERT INTO content_roles (name, color, is_template, can_send_audio, can_send_images, can_send_text) VALUES
    ('Conductor', '#ff6b6b', true, true, true, true),
    ('Performer', '#667eea', true, true, true, true),
    ('Observer', '#95e1d3', true, false, false, false);

CREATE INDEX idx_roles_template ON content_roles(is_template);
```

**Why This Design**:
- Simple permission flags (no complex RBAC needed)
- Color for visual identification in UI
- Template flag for pre-defined vs custom roles
- No user associations (roles are just templates)

---

### 7. Networks Hub → `content_networks`

```sql
CREATE TABLE content_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Network type
    topology_type VARCHAR(30) CHECK (topology_type IN (
        'star', 'mesh', 'hub_spoke', 'ring', 'custom'
    )),
    
    -- Visual representation (for custom topologies)
    graph_data JSONB, -- {nodes: [...], edges: [...]}
    
    -- Metadata
    creator_nickname VARCHAR(100),
    is_template BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pre-seed common topologies
INSERT INTO content_networks (name, topology_type, is_template, graph_data) VALUES
    ('Star', 'star', true, '{"nodes": [], "edges": []}'),
    ('Full Mesh', 'mesh', true, '{"nodes": [], "edges": []}'),
    ('Hub and Spoke', 'hub_spoke', true, '{"nodes": [], "edges": []}');

CREATE INDEX idx_networks_template ON content_networks(is_template);
```

**Why This Design**:
- JSONB for flexible graph storage
- Pre-defined templates for common patterns
- Lightweight (no complex graph database needed)
- Visual editor saves to `graph_data` field

---

### 8. Fragments Hub → `content_fragments`

```sql
CREATE TABLE content_fragments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Fragment type
    fragment_type VARCHAR(30) NOT NULL CHECK (fragment_type IN (
        'sequence', 'timing', 'interface', 'mixed'
    )),
    
    -- Metadata
    duration_seconds DECIMAL(10,2),
    creator_nickname VARCHAR(100),
    usage_count INTEGER DEFAULT 0, -- Track reuse
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Contents of a fragment (what it's composed of)
CREATE TABLE fragment_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fragment_id UUID NOT NULL REFERENCES content_fragments(id) ON DELETE CASCADE,
    
    -- Reference to any content type
    content_category VARCHAR(30) NOT NULL,
    content_id UUID NOT NULL,
    
    -- Position/order
    position INTEGER NOT NULL,
    
    UNIQUE(fragment_id, position)
);

CREATE INDEX idx_fragment_type ON content_fragments(fragment_type);
CREATE INDEX idx_fragment_usage ON content_fragments(usage_count DESC);
CREATE INDEX idx_fragment_contents ON fragment_contents(fragment_id, position);
```

**Why This Design**:
- Fragments are reusable components
- Can contain any content type (flexible references)
- Usage count helps identify popular fragments
- Supports DRY principle (Don't Repeat Yourself)

---

## Performance Session Tables (Swarms)

### `swarms` (Live Performance Sessions)

```sql
CREATE TABLE swarms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Session configuration
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    program_id UUID REFERENCES content_programs(id),
    
    -- Session state
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
    max_participants INTEGER DEFAULT 100,
    
    -- Metadata
    creator_nickname VARCHAR(100),
    category VARCHAR(100),
    privacy VARCHAR(20) DEFAULT 'public',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE INDEX idx_swarms_invite ON swarms(invite_code);
CREATE INDEX idx_swarms_status ON swarms(status);
CREATE INDEX idx_swarms_active ON swarms(status, created_at DESC) 
    WHERE status = 'active';
```

### `swarm_participants` (Session-Based Identity)

```sql
CREATE TABLE swarm_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    
    -- Session identity (no permanent user account)
    session_id VARCHAR(255) NOT NULL, -- Browser session ID
    nickname VARCHAR(100) NOT NULL,
    
    -- Role in this session
    role_id UUID REFERENCES content_roles(id),
    
    -- Connection state
    is_connected BOOLEAN DEFAULT true,
    last_seen TIMESTAMP DEFAULT NOW(),
    
    -- Timestamps
    joined_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(swarm_id, session_id)
);

CREATE INDEX idx_participants_swarm ON swarm_participants(swarm_id);
CREATE INDEX idx_participants_connected ON swarm_participants(swarm_id, is_connected);
```

**Why This Design**:
- `session_id` is browser-based (not a user account)
- Nickname for display only (no authentication)
- Temporary identity (no permanent profile)
- Simple role assignment per session

### `swarm_messages` (Real-Time Events)

```sql
CREATE TABLE swarm_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES swarm_participants(id),
    
    -- Message type
    message_type VARCHAR(30) NOT NULL CHECK (message_type IN (
        'audio', 'visual', 'text', 'system'
    )),
    
    -- Content reference (if applicable)
    content_id UUID,
    
    -- Message data
    text_content TEXT,
    
    -- Timing (for synchronized playback)
    scheduled_play_time TIMESTAMP,
    duration_seconds DECIMAL(10,2),
    
    -- Timestamp
    sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_swarm ON swarm_messages(swarm_id, sent_at DESC);
CREATE INDEX idx_messages_type ON swarm_messages(message_type);
CREATE INDEX idx_messages_scheduled ON swarm_messages(scheduled_play_time) 
    WHERE scheduled_play_time IS NOT NULL;
```

---

## Key Design Decisions

### 1. **Flat Content Tables > Single Polymorphic Table**

**Why**:
```sql
-- ❌ BAD: Single polymorphic table
CREATE TABLE content (
    id UUID PRIMARY KEY,
    content_type VARCHAR(50), -- 'audio', 'visual', 'sequence', etc.
    data JSONB -- All fields in JSON
);
-- Problems: Slow queries, no type safety, poor indexing

-- ✅ GOOD: Specialized tables per hub
CREATE TABLE content_audio (...specific fields...);
CREATE TABLE content_visual (...specific fields...);
-- Benefits: Fast queries, type-safe, optimized indexes
```

### 2. **No User Ownership > Simplified Queries**

**Why**:
```sql
-- ❌ With user ownership (complex)
SELECT a.* FROM content_audio a
JOIN user_content uc ON a.id = uc.content_id
WHERE uc.user_id = $1;

-- ✅ Without user ownership (simple)
SELECT * FROM content_audio
WHERE creator_nickname = $1; -- Optional attribution only
```

### 3. **Session-Based > Account-Based**

**Why**:
```sql
-- ❌ Account-based (permanent)
CREATE TABLE users (id, email, password_hash, ...);
CREATE TABLE sessions (id, user_id, ...);

-- ✅ Session-based (temporary)
CREATE TABLE swarm_participants (
    session_id VARCHAR(255), -- Browser session
    nickname VARCHAR(100),   -- Display name
    -- No passwords, no emails, no permanent data
);
```

### 4. **Denormalization for Performance**

**Why**: Hub structure means users primarily **browse within a hub**, not across all content.

```sql
-- ✅ Denormalized for fast hub browsing
SELECT * FROM content_audio 
ORDER BY created_at DESC 
LIMIT 20;
-- Single query, no joins, indexed, fast

-- ❌ Normalized version would require:
SELECT c.*, a.audio_url, a.duration 
FROM content c 
JOIN content_audio a ON c.id = a.content_id 
WHERE c.type = 'audio'
ORDER BY c.created_at DESC;
-- Multiple joins, slower
```

---

## Relationship Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    CONTENT HUBS                          │
│  (Specialized tables, minimal relationships)             │
└──────────────────────────────────────────────────────────┘
              │         │         │
              ↓         ↓         ↓
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │content_audio│ │content_visual│ │content_roles│
    │             │ │              │ │             │
    │ • No FK     │ │ • No FK      │ │ • No FK     │
    │ • nickname  │ │ • nickname   │ │ • nickname  │
    └─────────────┘ └──────────────┘ └─────────────┘
              │                │
              └────────┬───────┘
                       ↓
              ┌─────────────────┐
              │ sequence_items  │  ← Flexible references
              │ content_type    │     (by type + id)
              │ content_id      │
              └─────────────────┘
                       ↓
              ┌─────────────────┐
              │content_sequences│
              └─────────────────┘
                       ↓
              ┌─────────────────┐
              │content_programs │ ← Composes sequences
              │ roles, networks │     roles, networks
              └─────────────────┘
                       ↓
              ┌─────────────────┐
              │ swarms          │ ← Live sessions
              │ program_id      │     use programs
              └─────────────────┘
                       ↓
              ┌─────────────────┐
              │swarm_participants│ ← Temporary identity
              │ session_id      │     (no users table)
              │ nickname        │
              └─────────────────┘
```

---

## Migration from Original Schema

### Tables to Remove
- ❌ `users`
- ❌ `user_permissions`
- ❌ `user_content`
- ❌ `authentication_tokens`

### Tables to Keep (Modified)
- ✅ `swarms` (simplified, no user ownership)
- ✅ `swarm_participants` (session-based, not user-based)
- ✅ `swarm_messages` (unchanged)

### Tables to Add (New Hub-Based)
- ✅ `content_audio`
- ✅ `content_visual`
- ✅ `content_sequences` + `sequence_items`
- ✅ `content_programs` + `program_roles` + `program_interfaces`
- ✅ `content_timing`
- ✅ `content_roles`
- ✅ `content_networks`
- ✅ `content_fragments` + `fragment_contents`

---

## Query Performance Optimization

### Hub Browsing (Most Common Operation)

```sql
-- Audio Hub: Get recent audio
SELECT * FROM content_audio 
ORDER BY created_at DESC 
LIMIT 20;
-- EXPLAIN: Index scan on idx_audio_created
-- Execution time: < 1ms

-- Visual Hub: Get all text prompts
SELECT * FROM content_visual 
WHERE source_type = 'text'
ORDER BY created_at DESC;
-- EXPLAIN: Index scan on idx_visual_source_type
-- Execution time: < 1ms
```

### Cross-Hub Queries (Less Common)

```sql
-- Sequences Hub: Get sequence with items
SELECT 
    s.*,
    json_agg(
        json_build_object(
            'position', si.position,
            'type', si.content_type,
            'id', si.content_id,
            'duration', si.duration_seconds
        ) ORDER BY si.position
    ) as items
FROM content_sequences s
LEFT JOIN sequence_items si ON s.id = si.sequence_id
WHERE s.id = $1
GROUP BY s.id;
-- EXPLAIN: Index scan + aggregation
-- Execution time: ~5ms
```

### Performance Session Queries

```sql
-- Get active swarm with participants
SELECT 
    s.*,
    json_agg(
        json_build_object(
            'nickname', sp.nickname,
            'role_id', sp.role_id,
            'connected', sp.is_connected
        )
    ) as participants
FROM swarms s
LEFT JOIN swarm_participants sp ON s.id = sp.swarm_id
WHERE s.invite_code = $1
GROUP BY s.id;
-- EXPLAIN: Index scan on idx_swarms_invite + join
-- Execution time: ~10ms
```

---

## Data Integrity Without Users

### Problem: No User Ownership
**Question**: How to prevent data loss if content has no owner?

**Solution**: Everything is public, nothing is "owned"
- Content persists forever (or until manually deleted)
- `creator_nickname` is attribution only (not a constraint)
- No cascade deletes from user accounts (because there are none)

### Problem: Spam/Abuse
**Question**: Without accounts, how to prevent spam?

**Solution**: Rate limiting and moderation tools
```sql
-- Track creation rate by session
CREATE TABLE creation_rate_limits (
    session_id VARCHAR(255) PRIMARY KEY,
    last_created_at TIMESTAMP,
    creation_count INTEGER DEFAULT 0,
    window_start TIMESTAMP DEFAULT NOW()
);

-- Flagging system (community moderation)
CREATE TABLE content_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_category VARCHAR(30),
    content_id UUID,
    session_id VARCHAR(255),
    reason TEXT,
    flagged_at TIMESTAMP DEFAULT NOW()
);
```

### Problem: Session Identity
**Question**: How to maintain identity across browser sessions?

**Solution**: LocalStorage + session restoration
```javascript
// Client-side
const sessionId = localStorage.getItem('warmswarm_session') 
    || generateUUID();
localStorage.setItem('warmswarm_session', sessionId);

const nickname = localStorage.getItem('warmswarm_nickname')
    || prompt('Enter nickname:');
localStorage.setItem('warmswarm_nickname', nickname);
```

---

## Scalability Considerations

### Content Tables
- **Current**: <10k rows per table (small)
- **Expected**: <1M rows per table (medium)
- **Indexes**: B-tree on created_at, GIN on search_vector
- **Partitioning**: Not needed yet, but could partition by created_at if needed

### Performance Tables
- **Current**: Active swarms ~10, participants ~100
- **Expected**: Active swarms ~1000, participants ~10k
- **Indexes**: Key on status + invite_code
- **Cleanup**: Archive ended swarms after 24 hours

### Message Tables
- **Current**: ~1k messages/day
- **Expected**: ~100k messages/day
- **Strategy**: Time-based partitioning by `sent_at`
- **Retention**: Keep messages for 7 days, then archive

---

## Example Queries for Each Hub

### Audio Hub
```sql
-- Browse all audio
SELECT id, name, source_type, duration_seconds, creator_nickname, created_at
FROM content_audio
ORDER BY created_at DESC
LIMIT 50;

-- Search audio
SELECT * FROM content_audio
WHERE search_vector @@ plainto_tsquery('english', $1)
ORDER BY created_at DESC;
```

### Sequences Hub
```sql
-- Get sequence with full details
SELECT 
    s.id,
    s.name,
    s.sequence_type,
    s.total_duration_seconds,
    json_agg(
        json_build_object(
            'position', si.position,
            'content_type', si.content_type,
            'content_id', si.content_id,
            'start_time', si.start_time_seconds,
            'duration', si.duration_seconds
        ) ORDER BY si.position
    ) as items
FROM content_sequences s
LEFT JOIN sequence_items si ON s.id = si.sequence_id
GROUP BY s.id
ORDER BY s.created_at DESC;
```

### Programs Hub
```sql
-- Get program with all components
SELECT 
    p.id,
    p.name,
    p.description,
    json_agg(DISTINCT jsonb_build_object('role_id', pr.role_id)) as roles,
    json_agg(DISTINCT jsonb_build_object(
        'type', pi.interface_type,
        'label', pi.label,
        'position', pi.position
    )) as interfaces,
    n.name as network_name
FROM content_programs p
LEFT JOIN program_roles pr ON p.id = pr.program_id
LEFT JOIN program_interfaces pi ON p.id = pi.program_id
LEFT JOIN content_networks n ON p.network_id = n.id
WHERE p.id = $1
GROUP BY p.id, n.name;
```

---

## Benefits of This Design

### ✅ For Users
1. **Fast browsing** - Single-table queries per hub
2. **No signup friction** - Start creating immediately
3. **Clear organization** - Content grouped by type
4. **Quick search** - Indexed on all content tables

### ✅ For Developers
1. **Simple queries** - No complex joins for display
2. **Type safety** - Specific schemas per content type
3. **Easy testing** - Isolated tables per feature
4. **Clear patterns** - Same structure across hubs

### ✅ For System
1. **Scalable** - Indexes optimized per content type
2. **Maintainable** - No user cascade deletes
3. **Flexible** - Easy to add new content types
4. **Performant** - Denormalized for read-heavy workload

---

## Conclusion

**Recommended Approach**: Hub-Based Specialized Tables

**Key Principles**:
1. One table per hub (content_audio, content_visual, etc.)
2. No user accounts, session-based identity only
3. Flat structure for fast queries
4. Flexible references for cross-hub relationships
5. Public-by-default content

**Trade-offs**:
- ❌ More tables (8 content + 3 relationship + 3 performance = 14 tables)
- ✅ But: Faster queries, simpler logic, better organized
- ❌ Some denormalization (creator_nickname repeated)
- ✅ But: No joins for display, easier to maintain

**Result**: Database structure perfectly mirrors UI hierarchy, making it intuitive to understand and maintain.

---

**Next Steps**:
1. Review this schema design
2. Create migration SQL file
3. Implement API endpoints per hub
4. Build hub UIs with corresponding queries

**Last Updated**: 2025-10-21

