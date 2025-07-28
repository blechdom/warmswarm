-- Create database tables for WarmSwarm

-- Table for storing swarm information
CREATE TABLE IF NOT EXISTS swarms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    privacy VARCHAR(50) NOT NULL CHECK (privacy IN ('public', 'private', 'hidden')),
    category VARCHAR(100) NOT NULL,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing swarm members
CREATE TABLE IF NOT EXISTS swarm_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swarm_id UUID NOT NULL REFERENCES swarms(id) ON DELETE CASCADE,
    nickname VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_creator BOOLEAN DEFAULT FALSE,
    UNIQUE(swarm_id, nickname)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_swarms_privacy ON swarms(privacy);
CREATE INDEX IF NOT EXISTS idx_swarms_category ON swarms(category);
CREATE INDEX IF NOT EXISTS idx_swarms_invite_code ON swarms(invite_code);
CREATE INDEX IF NOT EXISTS idx_swarm_members_swarm_id ON swarm_members(swarm_id);

-- Insert some sample data for testing
INSERT INTO swarms (name, description, privacy, category, invite_code) VALUES
('Morning Joggers', 'Daily morning jog group for fitness enthusiasts', 'public', 'social', 'JOGGING123'),
('Dev Team Alpha', 'Sprint planning and coordination for our development team', 'private', 'work', 'DEVTEAM456'),
('Book Club Readers', 'Monthly book discussions and recommendations', 'public', 'social', 'BOOKS789')
ON CONFLICT (invite_code) DO NOTHING;

-- Insert sample members
INSERT INTO swarm_members (swarm_id, nickname, is_creator) 
SELECT id, 'RunnerLeader', true FROM swarms WHERE invite_code = 'JOGGING123'
ON CONFLICT (swarm_id, nickname) DO NOTHING;

INSERT INTO swarm_members (swarm_id, nickname, is_creator) 
SELECT id, 'DevLead', true FROM swarms WHERE invite_code = 'DEVTEAM456'
ON CONFLICT (swarm_id, nickname) DO NOTHING;