const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4444;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/swarms',
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate random invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API Routes

// Get all public swarms
app.get('/api/swarms', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, category, invite_code, created_at FROM swarms WHERE privacy = $1 ORDER BY created_at DESC',
      ['public']
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching swarms:', err);
    res.status(500).json({ error: 'Failed to fetch swarms' });
  }
});

// Get swarm by invite code
app.get('/api/swarms/:inviteCode', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const result = await pool.query(
      'SELECT id, name, description, category, privacy, invite_code, created_at FROM swarms WHERE invite_code = $1',
      [inviteCode]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Swarm not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching swarm:', err);
    res.status(500).json({ error: 'Failed to fetch swarm' });
  }
});

// Create new swarm
app.post('/api/swarms', async (req, res) => {
  try {
    const { name, description, privacy, category, creatorNickname } = req.body;
    
    // Validate required fields
    if (!name || !description || !privacy || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Generate unique invite code
    let inviteCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      inviteCode = generateInviteCode();
      const existing = await pool.query('SELECT id FROM swarms WHERE invite_code = $1', [inviteCode]);
      isUnique = existing.rows.length === 0;
      attempts++;
    }
    
    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique invite code' });
    }
    
    // Create swarm
    const swarmResult = await pool.query(
      'INSERT INTO swarms (name, description, privacy, category, invite_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, privacy, category, inviteCode]
    );
    
    const swarm = swarmResult.rows[0];
    
    // Add creator as first member if nickname provided
    if (creatorNickname) {
      await pool.query(
        'INSERT INTO swarm_members (swarm_id, nickname, is_creator) VALUES ($1, $2, $3)',
        [swarm.id, creatorNickname, true]
      );
    }
    
    res.status(201).json({
      id: swarm.id,
      name: swarm.name,
      description: swarm.description,
      privacy: swarm.privacy,
      category: swarm.category,
      invite_code: swarm.invite_code,
      created_at: swarm.created_at
    });
  } catch (err) {
    console.error('Error creating swarm:', err);
    res.status(500).json({ error: 'Failed to create swarm' });
  }
});

// Join swarm
app.post('/api/swarms/:inviteCode/join', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { nickname } = req.body;
    
    if (!nickname) {
      return res.status(400).json({ error: 'Nickname is required' });
    }
    
    // Check if swarm exists
    const swarmResult = await pool.query(
      'SELECT id, name FROM swarms WHERE invite_code = $1',
      [inviteCode]
    );
    
    if (swarmResult.rows.length === 0) {
      return res.status(404).json({ error: 'Swarm not found' });
    }
    
    const swarm = swarmResult.rows[0];
    
    // Check if nickname is already taken in this swarm
    const existingMember = await pool.query(
      'SELECT id FROM swarm_members WHERE swarm_id = $1 AND nickname = $2',
      [swarm.id, nickname]
    );
    
    if (existingMember.rows.length > 0) {
      return res.status(400).json({ error: 'Nickname already taken in this swarm' });
    }
    
    // Add member to swarm
    const memberResult = await pool.query(
      'INSERT INTO swarm_members (swarm_id, nickname) VALUES ($1, $2) RETURNING *',
      [swarm.id, nickname]
    );
    
    const member = memberResult.rows[0];
    
    res.status(201).json({
      id: member.id,
      swarm_id: swarm.id,
      swarm_name: swarm.name,
      nickname: member.nickname,
      joined_at: member.joined_at
    });
  } catch (err) {
    console.error('Error joining swarm:', err);
    res.status(500).json({ error: 'Failed to join swarm' });
  }
});

// Get swarm members
app.get('/api/swarms/:inviteCode/members', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    
    const result = await pool.query(`
      SELECT sm.nickname, sm.joined_at, sm.is_creator
      FROM swarm_members sm
      JOIN swarms s ON sm.swarm_id = s.id
      WHERE s.invite_code = $1
      ORDER BY sm.is_creator DESC, sm.joined_at ASC
    `, [inviteCode]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching swarm members:', err);
    res.status(500).json({ error: 'Failed to fetch swarm members' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`WarmSwarm backend server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    process.exit(0);
  });
});