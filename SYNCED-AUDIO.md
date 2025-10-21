# Synchronized Audio Playback 🎵

## Overview

WarmSwarm supports **millisecond-accurate synchronized audio playback** across multiple devices in the same swarm. This enables use cases like:

- 🎶 **DJ Sessions**: Everyone hears the same beat at the same time
- 📢 **Live Announcements**: Synchronized voice messages
- 🎮 **Gaming Coordination**: Perfectly timed audio cues
- 🎤 **Karaoke**: Synchronized backing tracks

## How It Works

### 1. **Time Synchronization (NTP-style)**

The system synchronizes device clocks using a precision time protocol:

```
Client                    Server
  |                         |
  |------ Ping (t0) ------->|
  |                         | (server time: ts)
  |<----- Pong (ts) --------|
  |                         | (receive time: t3)
  
Round Trip Time (RTT) = t3 - t0
Clock Offset = ts - (t0 + RTT/2)
```

**Key Features:**
- Takes 5 samples and uses median (filters outliers)
- Re-syncs every 30 seconds automatically
- Typical accuracy: ±10-30ms depending on network

### 2. **Audio Transmission**

```javascript
// Client A records audio
const audioBlob = await recordAudio();

// Calculate future playback time
const playAtTime = getServerTime() + 1000; // 1 second buffer

// Send to server with timestamp
socket.emit('send-synced-audio', {
  audioData: audioBlob,
  playAtTime: playAtTime,
  messageId: 'unique_id'
});
```

### 3. **Scheduled Playback**

All clients receive the audio with the same `playAtTime` timestamp:

```javascript
// Client B, C, D all receive
socket.on('synced-audio', ({ audioData, playAtTime }) => {
  const delayMs = playAtTime - getServerTime();
  
  // Decode audio
  const audioBuffer = await audioContext.decodeAudioData(audioData);
  
  // Schedule precise playback using Web Audio API
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(audioContext.currentTime + (delayMs / 1000));
});
```

## Timing Accuracy

### **Synchronization Precision**

| Network Condition | Expected Accuracy |
|-------------------|-------------------|
| Local Network (WiFi) | ±5-15ms |
| Good Internet | ±20-50ms |
| Poor Internet | ±50-150ms |

### **Why Web Audio API?**

Traditional `<audio>` elements have ~100-300ms jitter. Web Audio API provides:

- ✅ Sample-accurate scheduling
- ✅ No browser-induced latency
- ✅ Precise timing control
- ✅ Audio processing capabilities

```javascript
// BAD: HTML5 Audio (high jitter)
audio.currentTime = 0;
audio.play(); // Plays "soon", not precisely

// GOOD: Web Audio API (sample-accurate)
source.start(audioContext.currentTime + 1.5); // Plays at exactly 1.5 seconds
```

## Usage Example

### Basic Implementation

```typescript
import { useSyncedAudio } from '@/hooks/useSyncedAudio';

function MyComponent({ socket, swarmId }) {
  const { sendSyncedAudio, timeSync, isReady } = useSyncedAudio(socket, swarmId);
  
  const recordAndSend = async () => {
    const audioBlob = await recordAudio(); // Your recording logic
    
    // Send with 1-second buffer (allows network propagation)
    await sendSyncedAudio(audioBlob, 1000);
  };
  
  return (
    <div>
      <button onClick={recordAndSend} disabled={!isReady}>
        Record & Broadcast
      </button>
      <div>Time offset: {timeSync.offset}ms</div>
      <div>Network RTT: {timeSync.rtt}ms</div>
    </div>
  );
}
```

### Advanced: Custom Audio Processing

```typescript
// Add effects before playback
const audioContext = new AudioContext();
const source = audioContext.createBufferSource();
const gainNode = audioContext.createGain();
const filterNode = audioContext.createBiquadFilter();

// Audio graph: source -> gain -> filter -> destination
source.connect(gainNode);
gainNode.connect(filterNode);
filterNode.connect(audioContext.destination);

// Configure effects
gainNode.gain.value = 0.8;
filterNode.type = 'lowpass';
filterNode.frequency.value = 1000;

// Schedule playback
source.start(audioContext.currentTime + delaySeconds);
```

## Architecture Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Device A   │         │   Server    │         │  Device B   │
│             │         │             │         │             │
│ 1. Record   │         │             │         │             │
│    Audio    │         │             │         │             │
│             │         │             │         │             │
│ 2. Encode   │─────────▶ 3. Receive  │─────────▶ 4. Receive  │
│    (Opus)   │ WebSocket│    Audio    │ Broadcast│    Audio   │
│             │         │             │         │             │
│ 5. Schedule │         │ Add timestamp         │ 6. Schedule │
│    Play at  │         │ playAt: T+1s          │    Play at  │
│    T+1s     │         │             │         │    T+1s     │
│             │         │             │         │             │
│ 7. ▶️ PLAY  │◀────────┴─────────────┴─────────▶│ 8. ▶️ PLAY  │
└─────────────┘      SYNCHRONIZED PLAYBACK       └─────────────┘
        ⏱️ Both play at exactly the same moment ⏱️
```

## Technical Details

### Audio Format

**Recommended:** WebM with Opus codec
- Best compression (128kbps = ~1MB per minute)
- Low latency encoding/decoding
- Wide browser support

```javascript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000
});
```

### Buffer Time Selection

The `delayMs` parameter is critical:

| Delay | Use Case | Trade-off |
|-------|----------|-----------|
| 500ms | Local network | Fast but risky |
| 1000ms | **Recommended** | Good balance |
| 2000ms | Poor network | Very safe but slower |

### Handling Edge Cases

**Late Arrivals:**
```javascript
if (delayMs < -100) {
  console.warn('Audio message too old, skipping');
  return; // Don't play audio that should have played >100ms ago
}
```

**Network Jitter:**
```javascript
// Add extra buffer for unstable networks
const adaptiveDelay = Math.max(1000, timeSync.rtt * 3);
await sendSyncedAudio(audioBlob, adaptiveDelay);
```

## Performance Considerations

### Network Bandwidth

Audio size depends on duration and quality:

```
Duration × Bitrate = File Size
5 seconds × 128kbps = 80KB
10 seconds × 128kbps = 160KB
```

**Socket.IO supports binary data efficiently** - no base64 overhead.

### Memory Management

```javascript
// Clean up after playback
source.onended = () => {
  source.disconnect();
  gainNode.disconnect();
  // Buffers will be garbage collected
};
```

## Testing Synchronization

### Local Testing

Open 2-3 browser tabs to the same swarm:

```bash
# Terminal 1: Watch logs
docker compose logs -f backend

# Terminal 2: Check timing
curl http://localhost:4444/health
```

### Measuring Accuracy

Record video of multiple devices playing the same audio:
1. Use slow-motion video (240fps)
2. Measure visual waveform alignment
3. Calculate actual synchronization delta

Expected result: **±20-40ms** (human ear threshold: ~30ms)

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| MediaRecorder | ✅ | ✅ | ✅ | ✅ |
| Socket.IO Binary | ✅ | ✅ | ✅ | ✅ |
| Opus Codec | ✅ | ✅ | ✅* | ✅ |

*Safari iOS requires user interaction before audio playback

## Common Issues

### 1. "Audio context not ready"
**Solution:** Web Audio API requires user gesture on mobile
```javascript
button.onclick = async () => {
  await audioContext.resume();
  // Now can play audio
};
```

### 2. High synchronization drift
**Solution:** Check network quality and increase buffer time
```javascript
const adaptiveDelay = timeSync.rtt * 3; // 3x RTT as buffer
```

### 3. Echo/feedback
**Solution:** Use echo cancellation in recording
```javascript
navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true
  }
});
```

## Future Enhancements

- [ ] Adaptive buffer sizing based on network quality
- [ ] Audio compression optimization
- [ ] Playback confirmation/sync verification
- [ ] Visual waveform display
- [ ] Multi-track mixing
- [ ] Spatial audio positioning

## References

- [Web Audio API Specification](https://webaudio.github.io/web-audio-api/)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [NTP Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol)
- [Socket.IO Binary Support](https://socket.io/docs/v4/emitting-events/#binary)

