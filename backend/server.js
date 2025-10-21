const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3333",
    methods: ["GET", "POST"]
  }
});

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

// Get all public swarms (or filtered swarms)
app.get('/api/swarms', async (req, res) => {
  try {
    const { filter, swarmIds } = req.query;
    
    // Handle "my" swarms filter - requires swarmIds from client
    if (filter === 'my') {
      if (!swarmIds) {
        return res.json([]);
      }
      
      // Parse comma-separated swarm IDs
      const ids = swarmIds.split(',').filter(id => id.trim());
      if (ids.length === 0) {
        return res.json([]);
      }
      
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      const result = await pool.query(
        `SELECT s.id, s.name, s.description, s.category, s.privacy, s.invite_code, s.created_at,
         (SELECT COUNT(*) FROM swarm_members WHERE swarm_id = s.id) as member_count
         FROM swarms s 
         WHERE s.id IN (${placeholders})
         ORDER BY s.created_at DESC`,
        ids
      );
      return res.json(result.rows);
    }
    
    // Default: return all public swarms
    const result = await pool.query(
      `SELECT s.id, s.name, s.description, s.category, s.privacy, s.invite_code, s.created_at,
       (SELECT COUNT(*) FROM swarm_members WHERE swarm_id = s.id) as member_count
       FROM swarms s 
       WHERE s.privacy = $1 
       ORDER BY s.created_at DESC`,
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

// WebRTC Signaling
const swarmSessions = new Map(); // swarmId -> Set of socketIds
const socketToSwarm = new Map(); // socketId -> swarmId
const socketToUser = new Map(); // socketId -> { nickname, swarmId }

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join swarm session
  socket.on('join-swarm', ({ swarmId, nickname, role = 'all' }) => {
    console.log(`${nickname} joining swarm ${swarmId} with role ${role}`);
    
    // Join main swarm room
    socket.join(swarmId);
    
    // Join role-based room
    const roleRoom = `${swarmId}:${role}`;
    socket.join(roleRoom);
    
    // Also join "all" room if not already in it
    if (role !== 'all') {
      socket.join(`${swarmId}:all`);
    }
    
    socketToSwarm.set(socket.id, swarmId);
    socketToUser.set(socket.id, { nickname, swarmId, role });
    
    if (!swarmSessions.has(swarmId)) {
      swarmSessions.set(swarmId, new Set());
    }
    swarmSessions.get(swarmId).add(socket.id);
    
    // Notify others in the swarm
    socket.to(swarmId).emit('user-joined', { nickname, socketId: socket.id, role });
    
    // Send current participants to the new user
    const participants = Array.from(swarmSessions.get(swarmId))
      .filter(id => id !== socket.id)
      .map(id => {
        const user = socketToUser.get(id);
        return { socketId: id, nickname: user?.nickname, role: user?.role };
      });
    
    socket.emit('swarm-participants', participants);
  });

  // Change role
  socket.on('change-role', ({ swarmId, role }) => {
    const user = socketToUser.get(socket.id);
    if (user) {
      // Leave old role room
      const oldRoleRoom = `${swarmId}:${user.role}`;
      socket.leave(oldRoleRoom);
      
      // Join new role room
      const newRoleRoom = `${swarmId}:${role}`;
      socket.join(newRoleRoom);
      
      // Also join "all" room if not already in it
      if (role !== 'all') {
        socket.join(`${swarmId}:all`);
      }
      
      // Update user info
      user.role = role;
      socketToUser.set(socket.id, user);
      
      console.log(`${user.nickname} changed role to ${role} in swarm ${swarmId}`);
    }
  });

  // Broadcast live message (from sender) to specific receivers
  socket.on('broadcast-live-message', ({ swarmId, target, message, contentType = 'text' }) => {
    const user = socketToUser.get(socket.id);
    if (user && swarmId && user.role === 'sender') {
      let targetRooms = [];
      
      // Determine target rooms based on selection
      if (target === 'all') {
        targetRooms = ['receiver-1', 'receiver-2', 'receiver-3', 'receiver-4'];
      } else if (target === 'even') {
        targetRooms = ['receiver-2', 'receiver-4'];
      } else if (target === 'odd') {
        targetRooms = ['receiver-1', 'receiver-3'];
      } else if (['1', '2', '3', '4'].includes(target)) {
        targetRooms = [`receiver-${target}`];
      }
      
      // Broadcast to each target room
      targetRooms.forEach(receiverRole => {
        const targetRoom = `${swarmId}:${receiverRole}`;
        io.to(targetRoom).emit('live-message', {
          nickname: user.nickname,
          message: message,
          timestamp: new Date().toISOString(),
          socketId: socket.id,
          role: receiverRole,
          contentType: contentType
        });
      });
      
      console.log(`Sender ${user.nickname} broadcasting to ${target}: ${message}`);
    }
  });

  // WebRTC signaling events
  socket.on('webrtc-offer', ({ targetSocketId, offer }) => {
    const user = socketToUser.get(socket.id);
    socket.to(targetSocketId).emit('webrtc-offer', { 
      fromSocketId: socket.id, 
      fromNickname: user?.nickname,
      offer 
    });
  });

  socket.on('webrtc-answer', ({ targetSocketId, answer }) => {
    const user = socketToUser.get(socket.id);
    socket.to(targetSocketId).emit('webrtc-answer', { 
      fromSocketId: socket.id, 
      fromNickname: user?.nickname,
      answer 
    });
  });

  socket.on('webrtc-ice-candidate', ({ targetSocketId, candidate }) => {
    socket.to(targetSocketId).emit('webrtc-ice-candidate', { 
      fromSocketId: socket.id, 
      candidate 
    });
  });

  // Real-time messaging
  socket.on('swarm-message', ({ message }) => {
    const user = socketToUser.get(socket.id);
    if (user) {
      socket.to(user.swarmId).emit('swarm-message', {
        message,
        nickname: user.nickname,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Time synchronization for precise audio playback
  socket.on('time-sync-request', (clientTime) => {
    const serverTime = Date.now();
    socket.emit('time-sync-response', {
      clientTime,
      serverTime
    });
  });

  // Synchronized audio broadcasting
  socket.on('send-synced-audio', ({ swarmId, audioData, playAtTime, duration, messageId }) => {
    const user = socketToUser.get(socket.id);
    if (user && user.swarmId === swarmId) {
      console.log(`[SyncedAudio] Broadcasting audio ${messageId} to swarm ${swarmId}, play at ${playAtTime}`);
      
      // Broadcast to all other members in the swarm
      socket.to(swarmId).emit('synced-audio', {
        audioData,
        playAtTime,
        duration,
        messageId,
        senderNickname: user.nickname
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    const swarmId = socketToSwarm.get(socket.id);
    const user = socketToUser.get(socket.id);
    
    if (swarmId && swarmSessions.has(swarmId)) {
      swarmSessions.get(swarmId).delete(socket.id);
      if (swarmSessions.get(swarmId).size === 0) {
        swarmSessions.delete(swarmId);
      }
      
      // Notify others in the swarm
      socket.to(swarmId).emit('user-left', { 
        nickname: user?.nickname, 
        socketId: socket.id 
      });
    }
    
    socketToSwarm.delete(socket.id);
    socketToUser.delete(socket.id);
  });
  
  // Handle chat messages
  socket.on('chat-message', ({ swarmId, message }) => {
    const user = socketToUser.get(socket.id);
    if (user && swarmId) {
      // Broadcast message to all users in the swarm
      io.to(swarmId).emit('chat-message', {
        nickname: user.nickname,
        message: message,
        timestamp: new Date().toISOString(),
        socketId: socket.id
      });
    }
  });
});

// Start server
server.listen(port, () => {
  console.log(`WarmSwarm backend server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    process.exit(0);
  });
});