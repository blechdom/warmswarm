-- Migration: From Swarm-Based Schema to Hub-Based Schema (No Login)
-- Description: Migrates existing Telebrain data to new hub-based content tables
-- Date: 2025-10-21

-- ============================================================================
-- STEP 1: CREATE NEW HUB-BASED TABLES
-- ============================================================================

-- 1.1 Audio Hub Table
CREATE TABLE IF NOT EXISTS content_audio (
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
    
    -- Original data (for reference)
    migrated_from_id UUID,
    migrated_from_swarm UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

CREATE INDEX idx_audio_source_type ON content_audio(source_type);
CREATE INDEX idx_audio_created ON content_audio(created_at DESC);
CREATE INDEX idx_audio_search ON content_audio USING GIN(search_vector);

-- 1.2 Visual Hub Table
CREATE TABLE IF NOT EXISTS content_visual (
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
    
    -- Original data (for reference)
    migrated_from_id UUID,
    migrated_from_swarm UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Search
    search_vector TSVECTOR
);

CREATE INDEX idx_visual_source_type ON content_visual(source_type);
CREATE INDEX idx_visual_created ON content_visual(created_at DESC);
CREATE INDEX idx_visual_search ON content_visual USING GIN(search_vector);

-- 1.3 Timing Hub Table
CREATE TABLE IF NOT EXISTS content_timing (
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
    
    -- Algorithm properties
    algorithm_type VARCHAR(50),
    algorithm_parameters JSONB,
    
    -- Schedule properties
    schedule_start_time TIMESTAMP,
    schedule_duration_seconds INTEGER,
    schedule_repeat_pattern VARCHAR(50),
    
    -- Metadata
    creator_nickname VARCHAR(100),
    
    -- Original data (for reference)
    migrated_from_id UUID,
    migrated_from_swarm UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_timing_type ON content_timing(timing_type);
CREATE INDEX idx_timing_schedules ON content_timing(schedule_start_time) 
    WHERE timing_type = 'schedule';

-- 1.4 Roles Hub Table (Independent of swarms)
CREATE TABLE IF NOT EXISTS content_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Visual identifier
    color VARCHAR(20) NOT NULL DEFAULT '#667eea',
    icon VARCHAR(10),
    
    -- Permissions (template defaults)
    can_send_audio BOOLEAN DEFAULT true,
    can_send_images BOOLEAN DEFAULT true,
    can_send_text BOOLEAN DEFAULT true,
    can_receive_audio BOOLEAN DEFAULT true,
    can_receive_images BOOLEAN DEFAULT true,
    can_receive_text BOOLEAN DEFAULT true,
    
    -- Metadata
    creator_nickname VARCHAR(100),
    is_template BOOLEAN DEFAULT false,
    
    -- Original data (for reference)
    migrated_from_id UUID,
    migrated_from_swarm UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_roles_template ON content_roles(is_template);

-- 1.5 Update swarms table to remove user dependencies
-- Keep swarms but make them session-based
ALTER TABLE swarms DROP COLUMN IF EXISTS creator_id;
ALTER TABLE swarms ADD COLUMN IF NOT EXISTS creator_nickname VARCHAR(100);

-- 1.6 Update swarm_members to be session-based
ALTER TABLE swarm_members DROP COLUMN IF EXISTS user_id;
ALTER TABLE swarm_members ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);

-- ============================================================================
-- STEP 2: MIGRATE DATA FROM OLD SCHEMA TO NEW HUB TABLES
-- ============================================================================

-- 2.1 Migrate Audio Content
INSERT INTO content_audio (
    id,
    name,
    description,
    source_type,
    audio_url,
    file_path,
    duration_seconds,
    creator_nickname,
    migrated_from_id,
    migrated_from_swarm,
    created_at,
    updated_at
)
SELECT 
    c.id,
    c.name,
    c.description,
    -- Determine source type from audio data
    CASE 
        WHEN a.tts_voice IS NOT NULL THEN 'tts'
        WHEN a.audio_file LIKE 'http%' THEN 'url'
        ELSE 'upload'
    END as source_type,
    -- Audio URL (if URL source)
    CASE 
        WHEN a.audio_file LIKE 'http%' THEN a.audio_file
        ELSE NULL
    END as audio_url,
    -- File path (if upload or TTS)
    CASE 
        WHEN a.audio_file NOT LIKE 'http%' THEN a.audio_file
        ELSE NULL
    END as file_path,
    a.duration,
    COALESCE(m.nickname, 'Unknown') as creator_nickname,
    c.id as migrated_from_id,
    c.swarm_id as migrated_from_swarm,
    c.created_at,
    c.updated_at
FROM swarm_content c
INNER JOIN swarm_content_audio a ON c.id = a.content_id
LEFT JOIN swarm_members m ON c.created_by = m.id
WHERE c.type = 'audio';

-- Update TTS-specific fields
UPDATE content_audio
SET 
    tts_voice = a.tts_voice,
    tts_text = a.tts_text
FROM swarm_content_audio a
WHERE content_audio.migrated_from_id = a.content_id
    AND content_audio.source_type = 'tts'
    AND a.tts_voice IS NOT NULL;

-- 2.2 Migrate Image Content
INSERT INTO content_visual (
    id,
    name,
    description,
    source_type,
    image_url,
    file_path,
    width,
    height,
    creator_nickname,
    migrated_from_id,
    migrated_from_swarm,
    created_at,
    updated_at
)
SELECT 
    c.id,
    c.name,
    c.description,
    -- Determine source type
    CASE 
        WHEN i.image_file LIKE 'http%' THEN 'url'
        ELSE 'upload'
    END as source_type,
    -- Image URL (if URL source)
    CASE 
        WHEN i.image_file LIKE 'http%' THEN i.image_file
        ELSE NULL
    END as image_url,
    -- File path (if upload)
    CASE 
        WHEN i.image_file NOT LIKE 'http%' THEN i.image_file
        ELSE NULL
    END as file_path,
    i.width,
    i.height,
    COALESCE(m.nickname, 'Unknown') as creator_nickname,
    c.id as migrated_from_id,
    c.swarm_id as migrated_from_swarm,
    c.created_at,
    c.updated_at
FROM swarm_content c
INNER JOIN swarm_content_images i ON c.id = i.content_id
LEFT JOIN swarm_members m ON c.created_by = m.id
WHERE c.type = 'image';

-- 2.3 Migrate Text Content (as visual content with source_type = 'text')
INSERT INTO content_visual (
    id,
    name,
    description,
    source_type,
    text_content,
    creator_nickname,
    migrated_from_id,
    migrated_from_swarm,
    created_at,
    updated_at
)
SELECT 
    c.id,
    c.name,
    c.description,
    'text' as source_type,
    t.text_content,
    COALESCE(m.nickname, 'Unknown') as creator_nickname,
    c.id as migrated_from_id,
    c.swarm_id as migrated_from_swarm,
    c.created_at,
    c.updated_at
FROM swarm_content c
INNER JOIN swarm_content_text t ON c.id = t.content_id
LEFT JOIN swarm_members m ON c.created_by = m.id
WHERE c.type = 'text';

-- 2.4 Migrate Timer Content
INSERT INTO content_timing (
    id,
    name,
    description,
    timing_type,
    timer_minutes,
    timer_seconds,
    timer_milliseconds,
    creator_nickname,
    migrated_from_id,
    migrated_from_swarm,
    created_at,
    updated_at
)
SELECT 
    c.id,
    c.name,
    c.description,
    'timer' as timing_type,
    COALESCE(t.minutes, 0) as timer_minutes,
    COALESCE(t.seconds, 0) as timer_seconds,
    COALESCE(t.milliseconds, 0) as timer_milliseconds,
    COALESCE(m.nickname, 'Unknown') as creator_nickname,
    c.id as migrated_from_id,
    c.swarm_id as migrated_from_swarm,
    c.created_at,
    c.updated_at
FROM swarm_content c
INNER JOIN swarm_content_timers t ON c.id = t.content_id
LEFT JOIN swarm_members m ON c.created_by = m.id
WHERE c.type = 'timer';

-- 2.5 Migrate Roles (make them independent, not swarm-specific)
INSERT INTO content_roles (
    id,
    name,
    description,
    color,
    can_send_audio,
    can_send_images,
    can_send_text,
    can_receive_audio,
    can_receive_images,
    can_receive_text,
    creator_nickname,
    is_template,
    migrated_from_id,
    migrated_from_swarm,
    created_at,
    updated_at
)
SELECT DISTINCT ON (r.name)
    gen_random_uuid() as id,  -- New ID since we're consolidating
    r.name,
    r.description,
    '#667eea' as color,  -- Default color
    r.can_send_audio,
    r.can_send_images,
    r.can_send_text,
    r.can_receive_audio,
    r.can_receive_images,
    r.can_receive_text,
    'System' as creator_nickname,
    true as is_template,  -- Mark migrated roles as templates
    r.id as migrated_from_id,
    r.swarm_id as migrated_from_swarm,
    r.created_at,
    r.updated_at
FROM swarm_roles r
ORDER BY r.name, r.created_at;

-- ============================================================================
-- STEP 3: UPDATE SEARCH VECTORS
-- ============================================================================

-- 3.1 Update audio search vectors
UPDATE content_audio
SET search_vector = to_tsvector('english', 
    COALESCE(name, '') || ' ' || 
    COALESCE(description, '') || ' ' ||
    COALESCE(creator_nickname, '')
);

-- 3.2 Update visual search vectors
UPDATE content_visual
SET search_vector = to_tsvector('english', 
    COALESCE(name, '') || ' ' || 
    COALESCE(description, '') || ' ' ||
    COALESCE(text_content, '') || ' ' ||
    COALESCE(creator_nickname, '')
);

-- ============================================================================
-- STEP 4: CREATE TRIGGERS FOR FUTURE SEARCH VECTOR UPDATES
-- ============================================================================

-- 4.1 Audio search vector trigger
CREATE OR REPLACE FUNCTION update_audio_search_vector() 
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

CREATE TRIGGER audio_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, creator_nickname
    ON content_audio
    FOR EACH ROW
    EXECUTE FUNCTION update_audio_search_vector();

-- 4.2 Visual search vector trigger
CREATE OR REPLACE FUNCTION update_visual_search_vector() 
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

CREATE TRIGGER visual_search_vector_update
    BEFORE INSERT OR UPDATE OF name, description, text_content, creator_nickname
    ON content_visual
    FOR EACH ROW
    EXECUTE FUNCTION update_visual_search_vector();

-- ============================================================================
-- STEP 5: VERIFICATION QUERIES
-- ============================================================================

-- Show migration summary
DO $$
DECLARE
    old_audio_count INTEGER;
    new_audio_count INTEGER;
    old_image_count INTEGER;
    new_image_count INTEGER;
    old_text_count INTEGER;
    new_text_count INTEGER;
    old_timer_count INTEGER;
    new_timer_count INTEGER;
    old_role_count INTEGER;
    new_role_count INTEGER;
BEGIN
    -- Count old records
    SELECT COUNT(*) INTO old_audio_count FROM swarm_content WHERE type = 'audio';
    SELECT COUNT(*) INTO old_image_count FROM swarm_content WHERE type = 'image';
    SELECT COUNT(*) INTO old_text_count FROM swarm_content WHERE type = 'text';
    SELECT COUNT(*) INTO old_timer_count FROM swarm_content WHERE type = 'timer';
    SELECT COUNT(*) INTO old_role_count FROM swarm_roles;
    
    -- Count new records
    SELECT COUNT(*) INTO new_audio_count FROM content_audio;
    SELECT COUNT(*) INTO new_image_count FROM content_visual WHERE source_type IN ('url', 'upload');
    SELECT COUNT(*) INTO new_text_count FROM content_visual WHERE source_type = 'text';
    SELECT COUNT(*) INTO new_timer_count FROM content_timing WHERE timing_type = 'timer';
    SELECT COUNT(*) INTO new_role_count FROM content_roles;
    
    -- Print summary
    RAISE NOTICE '';
    RAISE NOTICE '╔═══════════════════════════════════════════════════╗';
    RAISE NOTICE '║       MIGRATION SUMMARY                           ║';
    RAISE NOTICE '╚═══════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Audio Content:  % → % (content_audio)', old_audio_count, new_audio_count;
    RAISE NOTICE 'Image Content:  % → % (content_visual)', old_image_count, new_image_count;
    RAISE NOTICE 'Text Content:   % → % (content_visual with source_type=text)', old_text_count, new_text_count;
    RAISE NOTICE 'Timer Content:  % → % (content_timing)', old_timer_count, new_timer_count;
    RAISE NOTICE 'Roles:          % → % (content_roles)', old_role_count, new_role_count;
    RAISE NOTICE '';
    
    IF new_audio_count = old_audio_count AND 
       new_image_count = old_image_count AND 
       new_text_count = old_text_count AND 
       new_timer_count = old_timer_count THEN
        RAISE NOTICE '✅ All content migrated successfully!';
    ELSE
        RAISE WARNING '⚠️  Some content may not have migrated. Please verify.';
    END IF;
    RAISE NOTICE '';
END $$;

-- ============================================================================
-- STEP 6: OPTIONAL - CLEANUP OLD TABLES (COMMENTED OUT FOR SAFETY)
-- ============================================================================

-- ⚠️  WARNING: Only run these after verifying migration was successful!
-- ⚠️  Keep old tables for at least a few days as backup

-- DROP TABLE IF EXISTS swarm_scheduled_event_targets_roles CASCADE;
-- DROP TABLE IF EXISTS swarm_scheduled_event_targets_members CASCADE;
-- DROP TABLE IF EXISTS swarm_scheduled_events CASCADE;
-- DROP TABLE IF EXISTS swarm_message_targets_roles CASCADE;
-- DROP TABLE IF EXISTS swarm_message_targets_members CASCADE;
-- DROP TABLE IF EXISTS swarm_preset_items CASCADE;
-- DROP TABLE IF EXISTS swarm_presets CASCADE;
-- DROP TABLE IF EXISTS swarm_activity_log CASCADE;
-- DROP TABLE IF EXISTS swarm_content_timers CASCADE;
-- DROP TABLE IF EXISTS swarm_content_text CASCADE;
-- DROP TABLE IF EXISTS swarm_content_images CASCADE;
-- DROP TABLE IF EXISTS swarm_content_audio CASCADE;
-- DROP TABLE IF EXISTS swarm_member_roles CASCADE;
-- DROP TABLE IF EXISTS swarm_content CASCADE;
-- DROP TYPE IF EXISTS content_type CASCADE;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Migration preserves:
-- ✓ All content data
-- ✓ Creator attribution (via nickname)
-- ✓ Timestamps
-- ✓ Content relationships (via migrated_from_* fields)
--
-- Migration removes:
-- ✗ Swarm ownership (content is now public)
-- ✗ User/member ownership (now session-based)
-- ✗ Permission enforcement (roles are now templates)
--
-- New features:
-- ✓ Content is hub-organized
-- ✓ Faster queries (no joins for browsing)
-- ✓ Full-text search enabled
-- ✓ Session-based identity
-- ✓ Public content pool

