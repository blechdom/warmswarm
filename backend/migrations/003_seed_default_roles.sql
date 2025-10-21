-- Seed: Default Role Templates
-- These can be copied when creating new swarms

-- Note: These are templates. Actual roles will be created per-swarm
-- This file shows the structure for common role types

-- ============================================
-- EXAMPLE: Conductor Role (Full Control)
-- ============================================
-- INSERT INTO swarm_roles (swarm_id, name, description,
--     can_send_audio, can_receive_audio,
--     can_send_text, can_receive_text,
--     can_send_images, can_receive_images,
--     can_view_members, can_view_activity_log,
--     can_schedule_content, can_manage_roles,
--     color, icon)
-- VALUES (
--     '<swarm_id>', 
--     'Conductor',
--     'Full control over performance - can send and manage all content',
--     true, true, true, true, true, true, true, true, true, true,
--     '#FF6B6B', 'conductor'
-- );

-- ============================================
-- EXAMPLE: Performer Role (Receive Only)
-- ============================================
-- INSERT INTO swarm_roles (swarm_id, name, description,
--     can_send_audio, can_receive_audio,
--     can_send_text, can_receive_text,
--     can_send_images, can_receive_images,
--     can_view_members,
--     color, icon)
-- VALUES (
--     '<swarm_id>',
--     'Performer',
--     'Receives instructions and audio cues - no send permissions',
--     false, true, false, true, false, true, true,
--     '#667EEA', 'user'
-- );

-- ============================================
-- EXAMPLE: Lead Role (Can Send & Receive)
-- ============================================
-- INSERT INTO swarm_roles (swarm_id, name, description,
--     can_send_audio, can_receive_audio,
--     can_send_text, can_receive_text,
--     can_send_images, can_receive_images,
--     can_view_members, can_view_activity_log,
--     color, icon)
-- VALUES (
--     '<swarm_id>',
--     'Lead',
--     'Lead performer - can communicate and coordinate',
--     true, true, true, true, false, true, true, true,
--     '#2ECC71', 'star'
-- );

-- ============================================
-- EXAMPLE: Audience Role (Minimal Permissions)
-- ============================================
-- INSERT INTO swarm_roles (swarm_id, name, description,
--     can_send_audio, can_receive_audio,
--     can_send_text, can_receive_text,
--     can_send_images, can_receive_images,
--     can_view_members,
--     color, icon)
-- VALUES (
--     '<swarm_id>',
--     'Audience',
--     'Passive observer - receives visual/audio only',
--     false, true, false, false, false, true, false,
--     '#95A5A6', 'eye'
-- );

-- ============================================
-- FUNCTION: Create Default Roles for New Swarm
-- ============================================

CREATE OR REPLACE FUNCTION create_default_swarm_roles(p_swarm_id UUID)
RETURNS void AS $$
BEGIN
    -- Conductor role
    INSERT INTO swarm_roles (swarm_id, name, description,
        can_send_audio, can_receive_audio,
        can_send_text, can_receive_text,
        can_send_images, can_receive_images,
        can_view_members, can_view_activity_log,
        can_schedule_content, can_manage_roles,
        color, icon)
    VALUES (
        p_swarm_id, 'Conductor',
        'Full control over performance',
        true, true, true, true, true, true, true, true, true, true,
        '#FF6B6B', 'conductor'
    );
    
    -- Performer role
    INSERT INTO swarm_roles (swarm_id, name, description,
        can_send_audio, can_receive_audio,
        can_send_text, can_receive_text,
        can_send_images, can_receive_images,
        can_view_members,
        color, icon)
    VALUES (
        p_swarm_id, 'Performer',
        'Receives instructions and audio cues',
        false, true, false, true, false, true, true,
        '#667EEA', 'user'
    );
    
    -- Lead role
    INSERT INTO swarm_roles (swarm_id, name, description,
        can_send_audio, can_receive_audio,
        can_send_text, can_receive_text,
        can_view_members, can_view_activity_log,
        color, icon)
    VALUES (
        p_swarm_id, 'Lead',
        'Lead performer with communication ability',
        true, true, true, true, true, true,
        '#2ECC71', 'star'
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Assign Member to Role
-- ============================================

CREATE OR REPLACE FUNCTION assign_member_to_role(
    p_member_id UUID,
    p_role_id UUID,
    p_assigned_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_assignment_id UUID;
BEGIN
    INSERT INTO swarm_member_roles (member_id, role_id, assigned_by)
    VALUES (p_member_id, p_role_id, p_assigned_by)
    ON CONFLICT (member_id, role_id) DO NOTHING
    RETURNING id INTO v_assignment_id;
    
    -- Log the assignment
    INSERT INTO swarm_activity_log (swarm_id, member_id, action, target_member_id, role_id)
    SELECT 
        sm.swarm_id,
        p_assigned_by,
        'role_assigned'::activity_action,
        p_member_id,
        p_role_id
    FROM swarm_members sm
    WHERE sm.id = p_member_id;
    
    RETURN v_assignment_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Check Member Permission
-- ============================================

CREATE OR REPLACE FUNCTION member_can_send_audio(p_member_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM swarm_member_permissions
        WHERE member_id = p_member_id
        AND can_send_audio = true
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION member_can_send_text(p_member_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM swarm_member_permissions
        WHERE member_id = p_member_id
        AND can_send_text = true
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get Member's Roles
-- ============================================

CREATE OR REPLACE FUNCTION get_member_roles(p_member_id UUID)
RETURNS TABLE (
    role_id UUID,
    role_name VARCHAR,
    assigned_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.id,
        sr.name,
        smr.assigned_at
    FROM swarm_member_roles smr
    JOIN swarm_roles sr ON smr.role_id = sr.id
    WHERE smr.member_id = p_member_id
    ORDER BY smr.assigned_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get Members by Role
-- ============================================

CREATE OR REPLACE FUNCTION get_members_by_role(p_role_id UUID)
RETURNS TABLE (
    member_id UUID,
    nickname VARCHAR,
    joined_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.id,
        sm.nickname,
        sm.joined_at
    FROM swarm_member_roles smr
    JOIN swarm_members sm ON smr.member_id = sm.id
    WHERE smr.role_id = p_role_id
    ORDER BY sm.joined_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-create default roles on swarm creation
-- ============================================

CREATE OR REPLACE FUNCTION trigger_create_default_roles()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically create default roles for new swarm
    PERFORM create_default_swarm_roles(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_swarm_insert_create_roles
    AFTER INSERT ON swarms
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_default_roles();

-- ============================================
-- TRIGGER: Log activity on role assignment
-- ============================================

CREATE OR REPLACE FUNCTION trigger_log_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO swarm_activity_log (swarm_id, member_id, action, target_member_id, role_id)
        SELECT 
            sm.swarm_id,
            NEW.assigned_by,
            'role_assigned'::activity_action,
            NEW.member_id,
            NEW.role_id
        FROM swarm_members sm
        WHERE sm.id = NEW.member_id;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO swarm_activity_log (swarm_id, member_id, action, target_member_id, role_id)
        SELECT 
            sm.swarm_id,
            NULL,
            'role_removed'::activity_action,
            OLD.member_id,
            OLD.role_id
        FROM swarm_members sm
        WHERE sm.id = OLD.member_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_member_role_change
    AFTER INSERT OR DELETE ON swarm_member_roles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_log_role_assignment();

