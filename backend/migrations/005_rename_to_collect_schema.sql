-- Migration: Rename and Reorganize for 4 C's Structure
-- Description: Updates schema to match Create | Collect | Coordinate | Connect
-- Date: 2025-10-21

-- ============================================================================
-- STEP 1: RENAME EXISTING TABLES
-- ============================================================================

-- 1.1 Rename content_visual to content_image (clearer naming)
ALTER TABLE IF EXISTS content_visual RENAME TO content_image;

-- Update indexes
ALTER INDEX IF EXISTS idx_visual_source_type RENAME TO idx_image_source_type;
ALTER INDEX IF EXISTS idx_visual_created RENAME TO idx_image_created;
ALTER INDEX IF EXISTS idx_visual_search RENAME TO idx_image_search;

-- Update search vector function and trigger
DROP TRIGGER IF EXISTS visual_search_vector_update ON content_image;
DROP FUNCTION IF EXISTS update_visual_search_vector();

CREATE OR REPLACE FUNCTION update_image_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.text_content, '') || ' ' ||
        COALESCE(NEW.creator_nickname, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER image_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, text_content, creator_nickname
    ON content_image
    FOR EACH ROW
    EXECUTE FUNCTION update_image_search_vector();

-- ============================================================================
-- STEP 2: CREATE NEW CONTENT TABLES FOR COLLECT HUB
-- ============================================================================

-- 2.1 Video Content Table
CREATE TABLE IF NOT EXISTS content_video (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Source information (URL, Upload, or Generated)
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('url', 'upload', 'generated')),
    
    -- For URL source
    video_url TEXT,
    
    -- For Upload source
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- For Generated source
    generation_prompt TEXT,
    generation_params JSONB,
    
    -- Metadata
    duration_seconds DECIMAL(10,2),
    width INTEGER,
    height INTEGER,
    frame_rate DECIMAL(5,2),
    thumbnail_url TEXT,
    creator_nickname VARCHAR(100),
    
    -- Original data (for reference)
    migrated_from_id UUID,
    migrated_from_swarm UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

CREATE INDEX idx_video_source_type ON content_video(source_type);
CREATE INDEX idx_video_created ON content_video(created_at DESC);
CREATE INDEX idx_video_search ON content_video USING GIN(search_vector);

-- Video search vector trigger
CREATE OR REPLACE FUNCTION update_video_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.generation_prompt, '') || ' ' ||
        COALESCE(NEW.creator_nickname, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, generation_prompt, creator_nickname
    ON content_video
    FOR EACH ROW
    EXECUTE FUNCTION update_video_search_vector();

-- ============================================================================
-- STEP 3: CREATE COORDINATE HUB TABLES
-- ============================================================================

-- 3.1 Sequences Table (Timeline-based performance planning)
CREATE TABLE IF NOT EXISTS content_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Sequence configuration
    duration_seconds DECIMAL(10,2),
    loop_enabled BOOLEAN DEFAULT false,
    
    -- Timeline items (stored as JSONB array)
    timeline_items JSONB DEFAULT '[]'::jsonb,
    -- Example structure:
    -- [
    --   {
    --     "id": "uuid",
    --     "start_time": 0.0,
    --     "duration": 5.0,
    --     "content_type": "audio|image|video",
    --     "content_id": "uuid",
    --     "layer_id": "uuid",
    --     "properties": {...}
    --   }
    -- ]
    
    -- Metadata
    creator_nickname VARCHAR(100),
    is_template BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

CREATE INDEX idx_sequences_created ON content_sequences(created_at DESC);
CREATE INDEX idx_sequences_template ON content_sequences(is_template);
CREATE INDEX idx_sequences_search ON content_sequences USING GIN(search_vector);

-- Sequences search vector trigger
CREATE OR REPLACE FUNCTION update_sequences_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.creator_nickname, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sequences_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, creator_nickname
    ON content_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_sequences_search_vector();

-- 3.2 Layers Table (Layer management for organizing content)
CREATE TABLE IF NOT EXISTS content_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Layer properties
    z_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    opacity DECIMAL(3,2) DEFAULT 1.0,
    
    -- Layer configuration
    blend_mode VARCHAR(50) DEFAULT 'normal',
    transform JSONB DEFAULT '{}'::jsonb,
    -- Example transform:
    -- {
    --   "x": 0, "y": 0,
    --   "scale": 1.0,
    --   "rotation": 0,
    --   "skew_x": 0, "skew_y": 0
    -- }
    
    -- Content assignment
    content_type VARCHAR(20) CHECK (content_type IN ('audio', 'image', 'video', 'text')),
    content_id UUID,
    
    -- Metadata
    creator_nickname VARCHAR(100),
    is_template BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

CREATE INDEX idx_layers_z_index ON content_layers(z_index);
CREATE INDEX idx_layers_content ON content_layers(content_type, content_id);
CREATE INDEX idx_layers_created ON content_layers(created_at DESC);
CREATE INDEX idx_layers_template ON content_layers(is_template);
CREATE INDEX idx_layers_search ON content_layers USING GIN(search_vector);

-- Layers search vector trigger
CREATE OR REPLACE FUNCTION update_layers_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.creator_nickname, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER layers_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, creator_nickname
    ON content_layers
    FOR EACH ROW
    EXECUTE FUNCTION update_layers_search_vector();

-- 3.3 Swarm Configurations Table (For coordinated performances)
-- Note: The existing 'swarms' table handles live sessions
-- This new table stores reusable swarm configurations/templates
CREATE TABLE IF NOT EXISTS content_swarm_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Swarm configuration
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    
    -- Network topology
    topology_type VARCHAR(30) CHECK (topology_type IN (
        'mesh',     -- everyone connected to everyone
        'star',     -- hub and spoke
        'ring',     -- circular
        'tree',     -- hierarchical
        'bus',      -- linear
        'line'      -- sequential
    )),
    
    -- Role assignments (JSONB array)
    role_assignments JSONB DEFAULT '[]'::jsonb,
    -- Example:
    -- [
    --   {"role_id": "uuid", "count": 1, "required": true},
    --   {"role_id": "uuid", "count": 3, "required": false}
    -- ]
    
    -- Sequence assignment
    sequence_id UUID REFERENCES content_sequences(id),
    
    -- Metadata
    creator_nickname VARCHAR(100),
    is_template BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

CREATE INDEX idx_swarm_configs_topology ON content_swarm_configs(topology_type);
CREATE INDEX idx_swarm_configs_sequence ON content_swarm_configs(sequence_id);
CREATE INDEX idx_swarm_configs_created ON content_swarm_configs(created_at DESC);
CREATE INDEX idx_swarm_configs_template ON content_swarm_configs(is_template);
CREATE INDEX idx_swarm_configs_search ON content_swarm_configs USING GIN(search_vector);

-- Swarm configs search vector trigger
CREATE OR REPLACE FUNCTION update_swarm_configs_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.creator_nickname, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER swarm_configs_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, creator_nickname
    ON content_swarm_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_swarm_configs_search_vector();

-- ============================================================================
-- STEP 4: CREATE CONNECT HUB TABLES
-- ============================================================================

-- 4.1 Invitations Table
CREATE TABLE IF NOT EXISTS swarm_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID REFERENCES swarms(id) ON DELETE CASCADE,
    
    -- QR Code / Share Link
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    qr_code_url TEXT,
    share_url TEXT,
    
    -- Invitation details
    message TEXT,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    
    -- Metadata
    created_by_nickname VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Status
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_invitations_code ON swarm_invitations(invite_code);
CREATE INDEX idx_invitations_swarm ON swarm_invitations(swarm_id);
CREATE INDEX idx_invitations_expires ON swarm_invitations(expires_at);

-- 4.2 Scheduled Swarms Table
CREATE TABLE IF NOT EXISTS swarm_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Swarm configuration
    swarm_config_id UUID REFERENCES content_swarm_configs(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Schedule details
    scheduled_start_time TIMESTAMP NOT NULL,
    estimated_duration_minutes INTEGER,
    
    -- Reminders
    reminder_times JSONB DEFAULT '[]'::jsonb,
    -- Example: ["15m", "1h", "1d"] - minutes, hours, days before
    
    -- Metadata
    created_by_nickname VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled',
        'started',
        'completed',
        'cancelled'
    ))
);

CREATE INDEX idx_schedules_start_time ON swarm_schedules(scheduled_start_time);
CREATE INDEX idx_schedules_status ON swarm_schedules(status);
CREATE INDEX idx_schedules_config ON swarm_schedules(swarm_config_id);

-- ============================================================================
-- STEP 5: SUMMARY
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '╔═══════════════════════════════════════════════════╗';
    RAISE NOTICE '║    SCHEMA UPDATED FOR 4 C''s STRUCTURE             ║';
    RAISE NOTICE '╚═══════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'CREATE HUB (Content Creation):';
    RAISE NOTICE '  ✓ content_audio         - Audio from URL/Upload/TTS';
    RAISE NOTICE '  ✓ content_image         - Images from URL/Upload/Text';
    RAISE NOTICE '  ✓ content_video         - Video from URL/Upload/Generate';
    RAISE NOTICE '';
    RAISE NOTICE 'COLLECT HUB (Browse & Manage):';
    RAISE NOTICE '  ✓ All content_ tables browseable';
    RAISE NOTICE '  ✓ Full-text search enabled';
    RAISE NOTICE '';
    RAISE NOTICE 'COORDINATE HUB (Planning & Organization):';
    RAISE NOTICE '  ✓ content_sequences     - Timeline-based planning';
    RAISE NOTICE '  ✓ content_layers        - Layer management';
    RAISE NOTICE '  ✓ content_swarm_configs - Swarm templates';
    RAISE NOTICE '';
    RAISE NOTICE 'CONNECT HUB (Share & Schedule):';
    RAISE NOTICE '  ✓ swarm_invitations     - QR codes & invites';
    RAISE NOTICE '  ✓ swarm_schedules       - Scheduled performances';
    RAISE NOTICE '';
    RAISE NOTICE 'Navigation: Create | Collect | Coordinate | Connect';
    RAISE NOTICE '';
END $$;

