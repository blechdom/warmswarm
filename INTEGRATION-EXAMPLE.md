# Integration Example: Adding Synced Audio to Live Page

## Quick Integration (5 minutes)

### Step 1: Update live/page.tsx

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import SyncedAudioRecorder from '@/components/SyncedAudioRecorder';

function LiveContent() {
  const searchParams = useSearchParams();
  const swarmId = searchParams.get('swarmId');
  const swarmName = searchParams.get('swarmName');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    // Get nickname from localStorage
    const storedNickname = localStorage.getItem('swarm-nickname') || 'Anonymous';
    setNickname(storedNickname);

    // Connect to socket
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      if (swarmId) {
        newSocket.emit('join-swarm', { swarmId, nickname: storedNickname });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [swarmId]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{swarmName || 'Live Swarm'}</h1>
      <p>Welcome, {nickname}!</p>
      
      {/* Add the synced audio component */}
      {socket && swarmId && (
        <SyncedAudioRecorder socket={socket} swarmId={swarmId} />
      )}
      
      {/* Your existing live page content */}
    </div>
  );
}

export default function LivePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveContent />
    </Suspense>
  );
}
```

### Step 2: Install dependencies (if needed)

```bash
# Check if socket.io-client is installed
npm list socket.io-client

# If not installed:
npm install socket.io-client
```

### Step 3: Test it!

```bash
# Rebuild containers
docker compose up --build -d

# Open multiple tabs
# Tab 1: http://localhost:3333/live?swarmId=test&swarmName=Test%20Swarm
# Tab 2: Same URL
# Tab 3: Same URL

# Record audio in Tab 1, hear it in all tabs simultaneously!
```

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Tab 1                          │
│                                                             │
│  ┌────────────────┐         ┌──────────────────┐          │
│  │  Live Page     │         │  SyncedAudio     │          │
│  │                │────────▶│  Recorder        │          │
│  │  - Swarm info  │         │                  │          │
│  │  - Members     │         │  - Record button │          │
│  │  - Chat        │         │  - Time sync UI  │          │
│  └────────────────┘         └──────────────────┘          │
│                                      │                      │
└──────────────────────────────────────┼──────────────────────┘
                                       │
                                       ▼
                            ┌──────────────────┐
                            │  Socket.IO       │
                            │  WebSocket       │
                            │                  │
                            │  - join-swarm    │
                            │  - time-sync     │
                            │  - synced-audio  │
                            └──────────────────┘
                                       │
                                       ▼
                            ┌──────────────────┐
                            │  Backend Server  │
                            │  (Node.js)       │
                            │                  │
                            │  - Broadcasts    │
                            │  - Time stamps   │
                            │  - Coordinates   │
                            └──────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
            │ Browser Tab 2│   │ Browser Tab 3│  │  Phone App   │
            │              │   │              │  │              │
            │ 🔊 Plays     │   │ 🔊 Plays     │  │ 🔊 Plays     │
            │ at time T    │   │ at time T    │  │ at time T    │
            └──────────────┘   └──────────────┘  └──────────────┘
                    ALL SYNCHRONIZED TO MILLISECOND
```

## Customization Options

### Option 1: Add Visual Countdown

```typescript
const [countdown, setCountdown] = useState<number | null>(null);

useEffect(() => {
  if (!socket) return;
  
  socket.on('synced-audio', ({ playAtTime }) => {
    const updateCountdown = () => {
      const remaining = Math.max(0, playAtTime - Date.now());
      setCountdown(remaining);
      
      if (remaining > 0) {
        requestAnimationFrame(updateCountdown);
      } else {
        setCountdown(null);
      }
    };
    
    updateCountdown();
  });
}, [socket]);

return (
  <div>
    {countdown !== null && (
      <div style={{ fontSize: '2rem', color: 'red' }}>
        Playing in {(countdown / 1000).toFixed(1)}s...
      </div>
    )}
    <SyncedAudioRecorder socket={socket} swarmId={swarmId} />
  </div>
);
```

### Option 2: Add Voice Filters

```typescript
// In useSyncedAudio.ts, modify scheduleAudioPlayback:

// Add reverb effect
const convolver = audioContext.createConvolver();
const reverb = await generateReverb(audioContext);
convolver.buffer = reverb;

// Audio graph: source -> convolver -> gain -> destination
source.connect(convolver);
convolver.connect(gainNode);
gainNode.connect(audioContext.destination);
```

### Option 3: Add Recording Indicator

```typescript
<SyncedAudioRecorder 
  socket={socket} 
  swarmId={swarmId}
  onRecordingStart={() => {
    // Show animation
    document.body.classList.add('recording');
  }}
  onRecordingStop={() => {
    document.body.classList.remove('recording');
  }}
/>
```

## Production Considerations

### 1. Authentication

```typescript
// Add authentication to time sync
socket.on('time-sync-request', (clientTime, token) => {
  if (!verifyToken(token)) return;
  // ... rest of time sync
});
```

### 2. Rate Limiting

```javascript
// backend/server.js
const audioRateLimit = new Map();

socket.on('send-synced-audio', ({ swarmId, audioData }) => {
  const key = `${socket.id}:${swarmId}`;
  const lastSent = audioRateLimit.get(key) || 0;
  
  // Max 1 audio per 3 seconds per user
  if (Date.now() - lastSent < 3000) {
    socket.emit('error', { message: 'Rate limit exceeded' });
    return;
  }
  
  audioRateLimit.set(key, Date.now());
  // ... rest of broadcast logic
});
```

### 3. Audio Size Limits

```javascript
// Limit to 1MB per message
if (audioData.byteLength > 1024 * 1024) {
  socket.emit('error', { message: 'Audio too large (max 1MB)' });
  return;
}
```

### 4. Error Handling

```typescript
try {
  await sendSyncedAudio(audioBlob, 1000);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Retry with exponential backoff
  } else if (error.code === 'AUDIO_TOO_LARGE') {
    // Show error to user
  }
}
```

## Monitoring & Analytics

```typescript
// Track sync quality
const analyticsRef = useRef({
  totalMessages: 0,
  avgOffset: 0,
  avgRTT: 0,
  errors: 0
});

useEffect(() => {
  const analytics = analyticsRef.current;
  
  // Update on each time sync
  analytics.totalMessages++;
  analytics.avgOffset = (analytics.avgOffset + timeSync.offset) / 2;
  analytics.avgRTT = (analytics.avgRTT + timeSync.rtt) / 2;
  
  // Send to analytics service every 5 minutes
  const interval = setInterval(() => {
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        swarmId,
        syncQuality: analytics
      })
    });
  }, 300000);
  
  return () => clearInterval(interval);
}, [timeSync]);
```

## Next Steps

1. ✅ Basic integration (this guide)
2. 🔄 Add UI enhancements (countdown, waveform)
3. 🔄 Implement audio effects
4. 🔄 Add recording history
5. 🔄 Mobile optimization
6. 🔄 Production hardening

## Help & Support

- See `SYNCED-AUDIO.md` for architecture details
- See `TEST-SYNCED-AUDIO.md` for testing procedures
- Check browser console for debug logs
- Monitor backend: `docker compose logs -f backend | grep -i sync`

