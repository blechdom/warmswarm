-- Migration: Add Roles, Content Library, and Messaging System
-- Replaces JSONB with proper relational tables

-- ============================================
-- ROLES & PERMISSIONS
-- ============================================

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
    
    color VARCHAR(7),  -- Hex color for UI
    icon VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(swarm_id, name)
);

CREATE INDEX idx_swarm_roles_swarm_id ON swarm_roles(swarm_id);

-- Many-to-many: members can have multiple roles
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

-- ============================================
-- CONTENT LIBRARY
-- ============================================

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
    deleted_at TIMESTAMP
);

CREATE INDEX idx_content_swarm ON swarm_content(swarm_id);
CREATE INDEX idx_content_type ON swarm_content(swarm_id, type);
CREATE INDEX idx_content_creator ON swarm_content(created_by);

-- Audio content metadata
CREATE TABLE swarm_content_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    source_type VARCHAR(20) CHECK (source_type IN ('url', 'upload', 'tts', 'generated')),
    url TEXT,
    file_path TEXT,
    
    duration_ms INTEGER,
    format VARCHAR(10),
    bitrate INTEGER,
    file_size_bytes BIGINT,
    
    -- TTS specific
    tts_text TEXT,
    tts_language VARCHAR(10),
    tts_voice VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);

CREATE INDEX idx_audio_content ON swarm_content_audio(content_id);

-- Image content metadata
CREATE TABLE swarm_content_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    source_type VARCHAR(20) CHECK (source_type IN ('url', 'upload')),
    url TEXT,
    file_path TEXT,
    
    width INTEGER,
    height INTEGER,
    format VARCHAR(10),
    file_size_bytes BIGINT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);

-- Text content (teleprompts, instructions)
CREATE TABLE swarm_content_text (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    text_content TEXT NOT NULL,
    
    -- Display settings
    font_family VARCHAR(100),
    font_size INTEGER,
    font_color VARCHAR(7),
    background_color VARCHAR(7),
    text_align VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);

-- Timer content
CREATE TABLE swarm_content_timers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    duration_ms INTEGER NOT NULL,
    label VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_id)
);

-- ============================================
-- PRESETS (Multi-Content Collections)
-- ============================================

CREATE TABLE swarm_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    created_by UUID REFERENCES swarm_members(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE swarm_preset_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preset_id UUID NOT NULL REFERENCES swarm_presets(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES swarm_content(id) ON DELETE CASCADE,
    
    sequence_order INTEGER NOT NULL,
    delay_ms INTEGER DEFAULT 0,
    
    UNIQUE(preset_id, sequence_order)
);

CREATE INDEX idx_preset_items ON swarm_preset_items(preset_id, sequence_order);

-- ============================================
-- MESSAGING SYSTEM
-- ============================================

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
    
    target_all BOOLEAN DEFAULT false,
    
    sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_swarm ON swarm_messages(swarm_id, sent_at DESC);
CREATE INDEX idx_messages_sender ON swarm_messages(sender_id);

-- Message targeting: roles
CREATE TABLE swarm_message_targets_roles (
    message_id UUID NOT NULL REFERENCES swarm_messages(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES swarm_roles(id) ON DELETE CASCADE,
    
    PRIMARY KEY (message_id, role_id)
);

CREATE INDEX idx_msg_targets_roles ON swarm_message_targets_roles(message_id);

-- Message targeting: specific members
CREATE TABLE swarm_message_targets_members (
    message_id UUID NOT NULL REFERENCES swarm_messages(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES swarm_members(id) ON DELETE CASCADE,
    
    PRIMARY KEY (message_id, member_id)
);

CREATE INDEX idx_msg_targets_members ON swarm_message_targets_members(message_id);

-- ============================================
-- SCHEDULED EVENTS
-- ============================================

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

-- Event targeting: roles
CREATE TABLE swarm_scheduled_event_targets_roles (
    event_id UUID NOT NULL REFERENCES swarm_scheduled_events(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES swarm_roles(id) ON DELETE CASCADE,
    
    PRIMARY KEY (event_id, role_id)
);

-- Event targeting: members
CREATE TABLE swarm_scheduled_event_targets_members (
    event_id UUID NOT NULL REFERENCES swarm_scheduled_events(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES swarm_members(id) ON DELETE CASCADE,
    
    PRIMARY KEY (event_id, member_id)
);

-- ============================================
-- ACTIVITY LOGGING
-- ============================================

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
    
    -- Additional context (minimal JSONB for flexibility)
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_swarm ON swarm_activity_log(swarm_id, created_at DESC);
CREATE INDEX idx_activity_member ON swarm_activity_log(member_id);
CREATE INDEX idx_activity_action ON swarm_activity_log(swarm_id, action);

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- Aggregate member permissions from all their roles
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

-- Content with metadata consolidated
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

