# Telebrain Master - Repository Analysis

## Overview

**Telebrain** is a real-time web application for organizing the distribution of multi-player performance instructions. It's designed for coordinating live performances across multiple performers with different roles, delivering synchronized audio, text, and images.

**Technology Stack (2013):**
- Node.js 0.8.4
- Express 3.x
- Socket.IO 0.9.10
- MongoDB 1.1.8
- Backbone.js (frontend)
- jsPlumb (visual programming/flow)

---

## Core Concepts & Architecture

### 1. **Performance Architecture**

```
Venues (Performance Spaces)
  ├── Roles (Prompter, Receiver, Lead, Chorus, Team)
  │   ├── Permissions (send/receive capabilities)
  │   └── Interface Layout
  ├── Performers (join as roles with nicknames)
  └── Content Distribution (text, audio, images)
```

### 2. **Content Hierarchy**

```
Content Types:
├── Images
│   ├── Web-Based Images (URL)
│   ├── Uploaded Images
│   └── Teleprompt Text (styled text overlays)
├── Audio
│   ├── Web-Based Audio (MP3 URLs)
│   ├── Uploaded Audio
│   └── Text-To-Speech (generated MP3s)
├── Collections
│   ├── Audio Layers (simultaneous playback)
│   ├── Audio-Image Pairs
│   ├── Image Phrases (sequences)
│   ├── Audio Sentences (concatenated audio)
│   └── Folders (organizational)
├── Algorithms
│   ├── Timers (synchronized delays)
│   ├── Metronomes (regular intervals)
│   └── Timed Organization (scheduled content delivery)
└── Fragments
    ├── Multi-Role Assignments (content → multiple roles)
    └── Fractional Assignments (split group into subgroups)
```

---

## Database Schema (MongoDB)

### Collections

**1. `content` Collection:**
```javascript
{
  _id: ObjectID,
  parent_id: String,        // Hierarchical relationship
  name: String,
  description: String,
  image: String,           // Image URL or path
  audio: String,           // Audio URL or path
  text: String,            // For teleprompts, TTS
  permissions: Number,     // 0=saved, 1=template
  
  // Type-specific fields:
  font: String,           // Teleprompt
  color: String,          // Text color
  bgcolor: String,        // Background color
  size: String,           // Font size
  language: String,       // TTS language
  
  // For roles:
  showMenu: String,       // "checked" or ""
  textSend: String,
  textReceive: String,
  audioSend: String,
  audioReceive: String,
  imageSend: String,
  imageReceive: String,
  TTSSend: String,
  TTSReceive: String,
  fragmentSend: String,
  fractionSend: String,
  performerList: String,
  activityLog: String,
  
  // For venues:
  network: String,        // Reference to network config
  rolelist: Array,        // Array of role IDs
  
  // For fragments:
  programId: String,
  fragmentList: Array,    // Array of {contentId, roleName, dataInfo}
  
  owner: String,          // User ID
  deleteFlag: Number
}
```

**2. `sessions` Collection:**
```javascript
{
  _id: String,           // Session ID
  session: String,       // Serialized session data
  expires: Date
}
```

**Parent ID Hierarchy:**
```
0 → Root
1 → Content
  5 → Images
    17 → Web-Based Images
    18 → Uploaded Images
    19 → Teleprompts
  6 → Audio
    21 → Web-Based Audio
    22 → Uploaded Audio
    23 → Text-To-Speech
  8 → Collections
    55 → Audio Layers
    56 → Audio-Image Pairs
    57 → Image Phrases
    58 → Audio Sentences
    59 → Folders
4 → Programs
  10 → Algorithms
    35 → Timers
    36 → Metronomes
    37 → Timed Organization
  11 → Setup
    12 → Roles
    13 → Interfaces
    15 → Venues
  16 → Fragments
    50 → Multi-Role Assignments
    51 → Fractional Assignments
```

---

## Socket.IO Event Structure

### Time Synchronization (NTP-style)

**Client → Server:**
```javascript
socket.emit('ntp_client_sync', { 
  t0: Date.now()  // Client send time
});
```

**Server → Client:**
```javascript
socket.emit('ntp_server_sync', { 
  t0: data.t0,      // Original client time
  t1: Date.now()    // Server time
});
```

**Client Calculates Offset:**
```javascript
var diff = (data.t1 - data.t0) + (data.t1 - Date.now()) / 2;
// Keeps rolling average of last 10 offsets
```

### Connection Management

**Initial Connection:**
```javascript
socket.on('connection', (socket) => {
  // Assign socket ID
  socket.emit('getClientId');
  
  // Check for existing client data
  socket.on('checkForClientData', () => {
    if (chatClients[socket.id]) {
      socket.emit('registeredPerformer', chatClients[socket.id]);
    } else {
      socket.emit('unregisteredPerformer');
    }
  });
});
```

**Joining a Performance:**
```javascript
// Client sends:
socket.emit('joinRoomSocket', {
  nickname: 'User Name',
  roleName: 'Prompter',
  roleId: '5103...',
  room: 'Performance Name',
  roomId: '5103...'
});

// Server stores:
chatClients[socket.id] = {
  nickname,
  clientId: generateId(),
  roleName,
  roleId,
  room,
  roomId
};

// Server joins socket to rooms:
socket.join(room);                        // Main room
socket.join(room + '/priv/' + nickname);  // Private channel
socket.join(room + '/role/' + roleName);  // Role-based channel
```

### Content Delivery

**Text Messages:**
```javascript
socket.on('textmessage', (data) => {
  // data.sendRoleList: ['All'] or ['Prompter', 'Receiver']
  // data.sendPerformerList: ['nickname1', 'nickname2']
  // data.message: "Text content"
  
  if (sendToAll) {
    io.sockets.in(room).emit('textmessage', { 
      client, message 
    });
  } else {
    // Send to specific roles
    io.sockets.in(room + '/role/' + roleName).emit('textmessage', {...});
    
    // Send to specific performers
    io.sockets.in(room + '/priv/' + nickname).emit('textmessage', {...});
  }
});
```

**Audio Messages:**
```javascript
socket.on('audiomessage', (data) => {
  // data.audioName: "snd/uploads/Beep.mp3"
  // data.sendRoleList: Array of roles
  // data.sendPerformerList: Array of nicknames
  
  io.sockets.in(room + '/role/' + roleName).emit('audiomessage', {
    client,
    message,
    audioName
  });
});
```

**Image Messages:**
```javascript
socket.on('imagemessage', (data) => {
  // data.imageName: URL or path
  io.sockets.in(room + '/role/' + roleName).emit('imagemessage', {
    client,
    message,
    imageName
  });
});
```

**Fragment Messages (Multi-Content):**
```javascript
socket.on('fragmentmessage', (data) => {
  // data.fragmentData: Array of content items
  // data.fragmentName: Name of fragment
  // data.contentName: Associated content
  
  io.sockets.in(room + '/role/' + roleName).emit('fragmentmessage', {
    client,
    fragmentData,
    fragmentName,
    contentName
  });
});
```

**Fraction Messages (Group Splitting):**
```javascript
socket.on('fractionmessage', (data) => {
  // data.groupArray: ['nickname1', 'nickname2']
  // data.fractionName: Name of fraction
  
  for (nickname of groupArray) {
    io.sockets.in(room + '/priv/' + nickname).emit('fractionmessage', {
      client,
      fractionName,
      contentName,
      contentId
    });
  }
});
```

**Text-To-Speech (Dynamic):**
```javascript
socket.on('ttsmessage', (data) => {
  // data.message: URL to TTS MP3
  // data.ttsContents: Original text
  
  // Downloads TTS audio from external service
  // Saves to /public/snd/ttsaudio/
  // Broadcasts saved file path
});
```

### Room Management

**Get Rooms List:**
```javascript
socket.on('getRoomsList', () => {
  socket.emit('liveRoomslist', { 
    rooms: Object.keys(io.sockets.manager.rooms) 
  });
});
```

**Get Clients in Room:**
```javascript
socket.on('getClientsInRoom', (roomName) => {
  var socketIds = io.sockets.manager.rooms['/' + roomName];
  var nicknames = socketIds.map(id => chatClients[id].nickname);
  socket.emit('clientsInRoom', nicknames);
});
```

### Chronometer (Synchronized Timer)

**Server broadcasts time every 200ms:**
```javascript
socket.on('stopWatch', (state) => {
  if (state == 1) {  // Start
    setInterval(() => {
      var time = calculateElapsedTime();
      socket.broadcast.emit('chronFromServer', time);
      socket.emit('chronFromServer', time);
    }, 200);
  }
  if (state == 0) {  // Stop
    clearInterval(xstopwatch);
  }
  if (state == 2) {  // Reset
    time = "00:00:00.0";
    socket.broadcast.emit('chronFromServer', time);
  }
});
```

---

## Client-Side Implementation

### NTP Time Sync

**Client maintains rolling average:**
```javascript
ntp.init(socket, { interval: 1000 });

// Stores last 10 offsets
var offsets = [];

socket.on('ntp_server_sync', (data) => {
  var diff = (data.t1 - data.t0) + (data.t1 - Date.now()) / 2;
  offsets.unshift(diff);
  if (offsets.length > 10) offsets.pop();
});

// Get current offset
ntp.offset() // Returns average of offsets
```

### Backbone.js Architecture

**Models:** Each content type has its own Backbone model
- `algorithms_model.js`
- `audioUploads_model.js`
- `roles_model.js`
- `performance_model.js`
- etc.

**Views:** Complex view hierarchy
- `PerformanceMasterView2` - Main performance controller
- `PerformanceView2` - Rendering performance interface
- Modular views for each content type

**Data Binding:**
Uses `backbone.iobind` for automatic Socket.IO ↔ Model synchronization

---

## Key Features & Innovations

### 1. **Role-Based Permissions**

Each role has granular permissions:
- Can send text/audio/images/fragments
- Can receive text/audio/images
- Can see performer list
- Can see activity log

**Example: "Prompter" Role**
```json
{
  "name": "Prompter",
  "textSend": "checked",
  "audioSend": "checked",
  "imageSend": "checked",
  "fragmentSend": "checked",
  "textReceive": "checked",
  "audioReceive": "checked",
  "imageReceive": "checked",
  "performerList": "checked",
  "activityLog": "checked"
}
```

**Example: "Receiver" Role**
```json
{
  "name": "Receiver",
  "textSend": "",          // Cannot send
  "textReceive": "checked",
  "audioReceive": "checked",
  "imageReceive": "checked",
  "performerList": "checked"
}
```

### 2. **Multi-Channel Communication**

Three socket room types:
1. **Main Room:** `room`
   - All performers in performance
   
2. **Private Channels:** `room/priv/nickname`
   - Direct message to specific performer
   
3. **Role Channels:** `room/role/roleName`
   - Broadcast to all performers with specific role

### 3. **Content Pre-Configuration**

Content is created and configured before performance:
- Timers with specific durations
- Audio sentences (concatenated)
- Multi-role assignments (content → roles mapping)
- Fractional assignments (dynamic group splitting)

### 4. **Synchronized Timing**

- **NTP-style clock sync** (rolling 10-sample average)
- **Timers** use server time + offset for coordination
- **Chronometer** broadcasts every 200ms for visual sync

### 5. **Dynamic TTS**

- Generates Text-To-Speech on-demand
- Downloads MP3 from external service
- Saves to server
- Broadcasts file path to performers

---

## What Could Be Incorporated into WarmSwarm

### ✅ **Already Have in WarmSwarm:**
1. Socket.IO for real-time communication ✅
2. Room-based architecture ✅
3. User presence tracking ✅
4. WebRTC signaling ✅

### 🔄 **Could Improve/Add:**

#### 1. **Role-Based Permission System**
```javascript
// Define roles with specific capabilities
const roles = {
  conductor: {
    canSendAudio: true,
    canSendCommands: true,
    canReceiveAudio: true,
    canViewAll: true
  },
  performer: {
    canSendAudio: false,
    canReceiveAudio: true,
    canViewAll: false
  }
};

// When joining swarm:
socket.on('join-swarm', ({ swarmId, nickname, role }) => {
  socket.join(swarmId);
  socket.join(`${swarmId}/role/${role}`);
  socket.join(`${swarmId}/priv/${nickname}`);
});
```

#### 2. **Multi-Target Messaging**
```javascript
// Send to specific roles
socket.emit('send-to-roles', {
  swarmId,
  roles: ['conductor', 'lead'],
  message: 'Start in 5...'
});

// Send to specific users
socket.emit('send-to-users', {
  swarmId,
  users: ['alice', 'bob'],
  message: 'Private instruction'
});
```

#### 3. **Pre-Configured Content Library**
```javascript
// Store audio/image presets
const contentLibrary = {
  countdowns: [...],
  instructions: [...],
  audioSignals: [...]
};

// Send pre-configured content by ID
socket.emit('send-preset', {
  swarmId,
  presetId: 'countdown-5',
  targets: ['all']
});
```

#### 4. **Scheduled Content Delivery**
```javascript
// Schedule content to be sent at specific time
socket.emit('schedule-content', {
  swarmId,
  content: { type: 'audio', url: '...' },
  playAtTime: serverTime + 5000,
  targets: ['all']
});
```

#### 5. **Fractional Group Assignment**
```javascript
// Automatically split swarm into subgroups
socket.emit('split-swarm', {
  swarmId,
  mode: 'consistent', // or 'dynamic'
  fractions: [
    { content: audioA, percentage: 0.5 },
    { content: audioB, percentage: 0.5 }
  ]
});
```

#### 6. **Improved Time Sync**
Already have NTP-style in our synced audio! But could add:
```javascript
// More frequent sync for accuracy
setInterval(syncTime, 5000);  // Every 5 seconds

// Display sync quality to users
<SyncQualityBadge offset={timeSync.offset} rtt={timeSync.rtt} />
```

---

## Database Schema Improvements for WarmSwarm

### Current WarmSwarm Schema:
```sql
swarms (
  id UUID,
  name VARCHAR,
  description TEXT,
  privacy VARCHAR,
  category VARCHAR,
  invite_code VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

swarm_members (
  id UUID,
  swarm_id UUID,
  nickname VARCHAR,
  joined_at TIMESTAMP,
  is_creator BOOLEAN
)
```

### Proposed Additions:

```sql
-- Role definitions
swarm_roles (
  id UUID PRIMARY KEY,
  swarm_id UUID REFERENCES swarms(id),
  name VARCHAR NOT NULL,
  can_send_audio BOOLEAN DEFAULT false,
  can_receive_audio BOOLEAN DEFAULT true,
  can_send_text BOOLEAN DEFAULT false,
  can_receive_text BOOLEAN DEFAULT true,
  can_send_images BOOLEAN DEFAULT false,
  can_receive_images BOOLEAN DEFAULT true,
  can_view_members BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assign members to roles
swarm_member_roles (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES swarm_members(id),
  role_id UUID REFERENCES swarm_roles(id),
  assigned_at TIMESTAMP DEFAULT NOW()
);

-- Content library
swarm_content (
  id UUID PRIMARY KEY,
  swarm_id UUID REFERENCES swarms(id),
  type VARCHAR NOT NULL,  -- 'audio', 'image', 'text', 'preset'
  name VARCHAR NOT NULL,
  data JSONB,  -- {url, duration, settings, etc}
  created_by UUID REFERENCES swarm_members(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled events
swarm_events (
  id UUID PRIMARY KEY,
  swarm_id UUID REFERENCES swarms(id),
  content_id UUID REFERENCES swarm_content(id),
  scheduled_time TIMESTAMP,
  target_roles TEXT[],  -- Array of role names
  target_members TEXT[],  -- Array of nicknames
  status VARCHAR,  -- 'pending', 'sent', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance logs
swarm_activity_log (
  id UUID PRIMARY KEY,
  swarm_id UUID REFERENCES swarms(id),
  member_id UUID REFERENCES swarm_members(id),
  action VARCHAR,  -- 'joined', 'left', 'sent_audio', 'received_audio'
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Recommendations

### Phase 1: Core Features (Week 1-2)
1. ✅ Role-based permissions in swarm creation
2. ✅ Multi-channel socket rooms (main/role/private)
3. ✅ Target selection UI (send to: All, Roles, Individuals)

### Phase 2: Content Library (Week 3-4)
1. Pre-save audio/image content
2. Quick-send presets during performance
3. Content organization and tagging

### Phase 3: Advanced Coordination (Week 5-6)
1. Scheduled content delivery
2. Fractional group assignments
3. Activity logging and replay

### Phase 4: Polish (Week 7-8)
1. Performance analytics
2. Swarm templates
3. Mobile optimization

---

## Code Structure Comparison

### Telebrain (2013):
```
server.js (877 lines)
├── Express 3.x routes
├── Socket.IO event handlers (inline)
├── MongoDB queries (inline)
└── File management (TTS, audio downloads)

public/
├── js/
│   ├── models/ (Backbone models)
│   ├── views/ (Backbone views - 1000+ lines each!)
│   └── main.js (app initialization)
```

### WarmSwarm (2025 - Modern):
```
backend/
├── server.js (clean, focused)
├── routes/ (separate files)
└── db/ (migrations, seeds)

src/
├── app/ (Next.js 15 routes)
├── components/ (React components)
├── hooks/ (useSyncedAudio, useWebRTC)
└── lib/ (utilities)
```

**Advantage:** WarmSwarm's modern structure is more maintainable!

---

## Key Takeaways

### What Telebrain Did Well:
1. **Granular role permissions** - Very flexible
2. **Multi-channel targeting** - Precise content delivery
3. **Pre-configuration** - Content ready before performance
4. **Time synchronization** - NTP approach for coordination
5. **Hierarchical content** - Organized content types

### What WarmSwarm Can Do Better:
1. **Modern stack** - Next.js 15, React 19, WebRTC
2. **Better UI/UX** - Mobile-first, modern design
3. **Real audio** - WebRTC instead of just file delivery
4. **Scalability** - PostgreSQL, Docker, AWS-ready
5. **Type safety** - TypeScript throughout

### Features to Port:
1. **Role system** with permissions ⭐⭐⭐
2. **Multi-target messaging** (roles/individuals) ⭐⭐⭐
3. **Content library** with presets ⭐⭐
4. **Scheduled delivery** ⭐⭐
5. **Activity logging** ⭐

---

## Next Steps

1. Design role permission system for WarmSwarm
2. Add multi-channel socket rooms
3. Create content library schema
4. Build UI for target selection
5. Implement scheduling system

Would you like me to start implementing any of these features?

