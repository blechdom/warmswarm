# Testing Synchronized Audio

## Quick Start Guide

### 1. **Rebuild and Start Services**

```bash
docker compose up --build -d
```

### 2. **Add Component to Live Page**

Update `/src/app/live/page.tsx`:

```typescript
import SyncedAudioRecorder from '@/components/SyncedAudioRecorder';

// Inside your component:
{socket && swarmId && (
  <SyncedAudioRecorder socket={socket} swarmId={swarmId} />
)}
```

### 3. **Test Locally**

**Setup:**
1. Open http://localhost:3333
2. Create or join a swarm
3. Open same swarm in **2-3 different browser tabs** (or devices on same network)

**Test Procedure:**
1. In Tab 1: Click "Record & Send"
2. Speak into microphone for 2-3 seconds
3. Click "Stop Recording"
4. **Listen** - all tabs should play audio at the EXACT same time

**Expected Result:**
- Time sync shows <50ms offset
- Audio plays simultaneously across all tabs
- Network latency displayed in UI

## Detailed Test Cases

### Test 1: Basic Synchronization

```bash
# Open 3 terminal windows to monitor

# Terminal 1: Backend logs
docker compose logs -f backend | grep -i sync

# Terminal 2: Network timing
watch -n 1 'curl -s http://localhost:4444/health'

# Terminal 3: Check connections
docker compose exec backend sh -c "netstat -an | grep 4444"
```

**Steps:**
1. Open 3 browser tabs
2. Join same swarm in all tabs
3. Check "Time Sync" displays in UI
4. Record 5-second audio in Tab 1
5. Observe playback in all tabs

**Metrics to Check:**
- [ ] Time offset: Should be <100ms
- [ ] RTT: Should be <50ms on local network
- [ ] Audio plays within ±50ms across tabs

### Test 2: Network Latency Simulation

**Using Chrome DevTools:**
1. F12 → Network tab → Throttling dropdown
2. Set "Fast 3G" or "Slow 3G"
3. Record and send audio
4. Check if sync still works

**Expected:**
- Slower networks → Higher RTT
- System should auto-adjust buffer
- Audio still syncs (but with more delay)

### Test 3: Multiple Devices

**Real-world test:**
1. Get 2-3 phones/tablets on same WiFi
2. Navigate to your local IP: `http://192.168.1.X:3333`
3. Join same swarm on all devices
4. Record audio on one device
5. Listen on all devices

**Measure sync accuracy:**
- Record video of all screens playing audio
- Use slow-motion to check waveform alignment
- Typical accuracy: ±30-60ms

## Debugging

### Check Time Sync Working

```javascript
// Open browser console
socket.emit('time-sync-request', Date.now());
socket.once('time-sync-response', (data) => {
  console.log('Server time:', data.serverTime);
  console.log('Client time:', Date.now());
  console.log('Offset:', data.serverTime - Date.now());
});
```

### Monitor Audio Messages

```javascript
// Backend logs
socket.on('send-synced-audio', (data) => {
  console.log(`Audio message: ${data.messageId}`);
  console.log(`Play at: ${data.playAtTime}`);
  console.log(`Current server time: ${Date.now()}`);
  console.log(`Delay: ${data.playAtTime - Date.now()}ms`);
});
```

### Verify Audio Scheduling

```javascript
// Client console
audioContext.currentTime; // Current audio time
source.start(audioContext.currentTime + 1.5); // Should log scheduled time
```

## Performance Benchmarks

### Expected Metrics

| Metric | Local Network | Internet |
|--------|---------------|----------|
| Time Sync RTT | 1-10ms | 20-100ms |
| Clock Offset | ±5ms | ±30ms |
| Audio Latency | 10-30ms | 50-150ms |
| Sync Accuracy | ±10ms | ±50ms |

### Measuring Accuracy

```javascript
// Log actual playback times
const playbackTimes = [];

socket.on('synced-audio', ({ playAtTime, messageId }) => {
  const actualPlayTime = audioContext.currentTime;
  const expectedDelay = (playAtTime - Date.now()) / 1000;
  const actualDelay = actualPlayTime - audioContext.currentTime;
  
  playbackTimes.push({
    messageId,
    expected: expectedDelay,
    actual: actualDelay,
    error: Math.abs(expectedDelay - actualDelay) * 1000 // ms
  });
  
  console.table(playbackTimes);
});
```

## Troubleshooting

### ❌ "Audio context not ready"

**Cause:** Browser requires user gesture before audio
**Fix:** Click anywhere on page first, then try recording

### ❌ "Microphone permission denied"

**Cause:** Browser blocked microphone access
**Fix:** Check browser settings, allow microphone for localhost

### ❌ "High RTT (>200ms)"

**Cause:** Network congestion or poor connection
**Fix:** 
- Check WiFi signal strength
- Close bandwidth-heavy apps
- Increase buffer time: `sendSyncedAudio(blob, 2000)`

### ❌ "Audio plays out of sync"

**Possible causes:**
1. Clock drift (re-sync needed)
2. Device performance issues
3. Network packet loss

**Debug:**
```javascript
// Check if time sync is recent
if (Date.now() - timeSync.lastSync > 60000) {
  console.warn('Time sync stale, re-syncing...');
  syncTime();
}
```

## Visual Testing Tool

Create a simple visual indicator:

```typescript
// Add to component
const [lastPlayTime, setLastPlayTime] = useState(0);

useEffect(() => {
  if (!socket) return;
  
  socket.on('synced-audio', ({ playAtTime }) => {
    setLastPlayTime(playAtTime);
    
    // Flash screen when audio should play
    const delay = playAtTime - Date.now();
    setTimeout(() => {
      document.body.style.backgroundColor = 'yellow';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 100);
    }, delay);
  });
}, [socket]);
```

Open multiple tabs - all should flash yellow **at exactly the same moment**.

## Advanced Testing

### Stress Test

```javascript
// Send multiple audio messages rapidly
for (let i = 0; i < 10; i++) {
  const blob = await recordShortClip();
  await sendSyncedAudio(blob, 1000 + (i * 2000));
  await sleep(500); // Small gap between recordings
}
```

All messages should queue and play in sequence, perfectly synchronized.

### Latency Heatmap

Track synchronization quality over time:

```javascript
const syncHistory = [];

setInterval(() => {
  syncHistory.push({
    time: Date.now(),
    offset: timeSync.offset,
    rtt: timeSync.rtt
  });
  
  if (syncHistory.length > 100) syncHistory.shift();
  
  // Plot as graph
  console.log('Avg RTT:', 
    syncHistory.reduce((a,b) => a + b.rtt, 0) / syncHistory.length
  );
}, 5000);
```

## Success Criteria

✅ **Basic Sync:** Audio plays within ±100ms on local network
✅ **Time Sync:** RTT consistently <50ms
✅ **Reliability:** No dropped messages in 10 consecutive tests
✅ **Multi-device:** Works across 3+ devices simultaneously
✅ **Network Tolerance:** Handles 100ms+ latency gracefully

## Next Steps

Once basic sync is working:

1. **Add visual countdown** before audio plays
2. **Show waveform** of recorded audio
3. **Add replay buffer** to re-listen
4. **Implement voting** on audio quality
5. **Add audio effects** (reverb, echo, etc.)

## Support

If you encounter issues:
1. Check browser console for errors
2. Review backend logs: `docker compose logs backend`
3. Test with simple beep sound instead of voice
4. Verify WebSocket connection is stable

