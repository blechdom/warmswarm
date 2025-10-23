# Timeline Editor Options for WarmSwarm

## Organizer Template Categories

### Live Templates
- Real-time coordination
- No pre-sequencing needed
- Creator controls flow manually
- Examples: Call & response, improvisation, distributed

### Timed Templates
- Pre-sequenced events
- Timeline-based coordination
- Automated playback
- Examples: Choreography, guided meditation, storytelling

---

## Timeline Editor Library Options

### 1. **@xzdarcy/react-timeline-editor** ⭐ RECOMMENDED
**npm:** `@xzdarcy/react-timeline-editor`  
**GitHub:** https://github.com/xzdarcy/react-timeline-editor

**Features:**
- ✅ Drag-and-drop timeline tracks
- ✅ Multi-track support (perfect for layers/groups)
- ✅ Zoom in/out timeline
- ✅ Snap to grid
- ✅ Event editing (move, resize, split)
- ✅ Playback controls
- ✅ Custom renderers
- ✅ TypeScript support
- ✅ Works with Next.js

**Perfect for:**
- Sequencing audio/text/video events
- Multiple participant layers
- Precise timing control

**Example Use Case:**
```
Track 1 (Group A): [Audio] [Text] [Pause] [Audio]
Track 2 (Group B):      [Text] [Audio] [Video]
Track 3 (Everyone):                  [Audio]
         0s    10s   20s   30s   40s   50s
```

---

### 2. **react-calendar-timeline**
**npm:** `react-calendar-timeline`  
**GitHub:** https://github.com/namespace-ee/react-calendar-timeline

**Features:**
- ✅ Horizontal timeline with groups
- ✅ Drag to move/resize items
- ✅ Zoom and pan
- ✅ Custom item renderers
- ✅ Touch support (mobile friendly)
- ✅ Very mature library

**Good for:**
- Calendar-style scheduling
- Group-based events
- Date/time based coordination

**Limitations:**
- More calendar-oriented than video-editor style
- Less precise for sub-second timing

---

### 3. **wavesurfer.js + Timeline Plugin**
**npm:** `wavesurfer.js`  
**GitHub:** https://github.com/wavesurfer-js/wavesurfer.js

**Features:**
- ✅ Audio waveform visualization
- ✅ Timeline regions plugin
- ✅ Markers and annotations
- ✅ Playback control
- ✅ Zoom waveform
- ✅ Perfect for audio-based swarms

**Perfect for:**
- Audio-centric sequences
- Visual waveform editing
- Music/sound coordination

**Limitations:**
- Focused on single audio track
- Less suitable for multi-layer non-audio content

---

### 4. **fabric.js Timeline (Custom Build)**
**npm:** `fabric`  
**GitHub:** https://github.com/fabricjs/fabric.js

**Features:**
- ✅ HTML5 canvas library
- ✅ Build custom timeline UI
- ✅ Full control over rendering
- ✅ Drag-and-drop support
- ✅ Object manipulation

**Good for:**
- Completely custom timeline UI
- Advanced interactions

**Limitations:**
- ❌ Need to build timeline logic yourself
- More development time required

---

### 5. **React-DnD + Custom Timeline**
**npm:** `react-dnd`  
**GitHub:** https://github.com/react-dnd/react-dnd

**Features:**
- ✅ Drag-and-drop primitives
- ✅ Build custom timeline
- ✅ Full flexibility
- ✅ Works great with Next.js

**Good for:**
- Custom timeline needs
- Specific interaction patterns

**Limitations:**
- ❌ Build everything from scratch
- More development overhead

---

## Recommendation: **@xzdarcy/react-timeline-editor**

### Why?
1. **Video-editor style interface** - Familiar to users
2. **Multi-track support** - Perfect for layers/groups
3. **Precise timing** - Sub-second accuracy
4. **Pre-built features** - Less custom code needed
5. **Active maintenance** - Regular updates
6. **TypeScript** - Type safety
7. **Lightweight** - Fast performance

### Implementation for WarmSwarm

```tsx
import { Timeline } from '@xzdarcy/react-timeline-editor';

interface SwarmEvent {
  id: string;
  start: number;  // seconds
  end: number;    // seconds
  layer: string;  // "all" | "group-a" | "group-b"
  type: 'audio' | 'text' | 'video' | 'tts';
  content: any;   // audio URL, text content, etc.
}

// Organizer customization interface
<Timeline
  scale={10}  // pixels per second
  tracks={[
    { id: 'all', name: 'Everyone' },
    { id: 'group-a', name: 'Group A' },
    { id: 'group-b', name: 'Group B' },
  ]}
  effects={{
    audio: AudioEffect,
    text: TextEffect,
    video: VideoEffect,
    tts: TTSEffect,
  }}
  onEventsChange={handleSaveSequence}
/>
```

### What Organizers See:
```
┌────────────────────────────────────────────────────┐
│  Timeline Editor                                   │
│  [Play ▶] [Pause ⏸] [Stop ⏹]  Duration: 2:30     │
├────────────────────────────────────────────────────┤
│                                                    │
│ Everyone  │████ Audio ████│    │███ Text ███│     │
│           │                                        │
│ Group A   │     │███ Text ███│  │█ TTS █│         │
│           │                                        │
│ Group B   │         │████ Audio ████│              │
│           │                                        │
│           0s     30s    60s    90s   120s   150s  │
└────────────────────────────────────────────────────┘

[+ Add Event] [Save Sequence] [Preview]
```

### Behind the Scenes (Advanced builds this):
- Constellation pattern: Layers
- 3 layers: Everyone, Group A, Group B
- Timing engine: Sequence player
- Content delivery: Socket.io coordinated

---

## Alternative Lightweight Option

### **Custom Simple Timeline**
If @xzdarcy/react-timeline-editor is too heavy, build a simpler version:

```tsx
// Simple drag-drop timeline bars
<div className="timeline">
  <div className="track">
    <DraggableEvent start={0} duration={30} type="audio" />
    <DraggableEvent start={35} duration={15} type="text" />
  </div>
</div>
```

**Pros:**
- ✅ Lightweight
- ✅ Exact features needed
- ✅ Easy to customize

**Cons:**
- ❌ More development time
- ❌ Need to handle edge cases
- ❌ Zoom/scale features to build

---

## Decision Matrix

| Library | Complexity | Features | Next.js | Mobile | Recommendation |
|---------|-----------|----------|---------|--------|----------------|
| @xzdarcy/react-timeline-editor | Medium | ⭐⭐⭐⭐⭐ | ✅ | ✅ | **Best choice** |
| react-calendar-timeline | Low | ⭐⭐⭐ | ✅ | ✅ | Good for calendar-style |
| wavesurfer.js | Medium | ⭐⭐⭐⭐ | ✅ | ⚠️ | Best for audio-only |
| Custom (React-DnD) | High | ⭐⭐⭐⭐ | ✅ | ✅ | If you want full control |
| Simple Custom | Medium | ⭐⭐ | ✅ | ✅ | Lightweight option |

---

## Next Steps

1. ✅ Document timeline editor options
2. ⬜ Install and test @xzdarcy/react-timeline-editor
3. ⬜ Create prototype timed template with timeline
4. ⬜ Build event types (audio, text, video, TTS)
5. ⬜ Connect timeline to swarm playback engine
6. ⬜ Add to Organizer workflow

---

## Example Timed Templates

### Template: "Guided Dance Sequence"
```
Timeline (3 minutes):
Everyone: [Intro Audio 0:00-0:30] [Instruction Text 0:30-0:45] 
          [Music 0:45-2:30] [Cool Down Audio 2:30-3:00]

Type: Timed
Pattern: Unison
Content: Pre-sequenced
```

### Template: "Story Circle (Timed)"
```
Timeline (5 minutes):
Person 1: [Story Prompt 0:00-1:00]
Person 2: [Story Prompt 1:00-2:00]
Person 3: [Story Prompt 2:00-3:00]
Person 4: [Story Prompt 3:00-4:00]
Everyone: [Conclusion 4:00-5:00]

Type: Timed
Pattern: Circle (sequential)
Content: Timed transitions
```

### Template: "Meditation (Timed)"
```
Timeline (10 minutes):
Everyone: [Breathing Instructions 0:00-2:00]
          [Guided Imagery 2:00-7:00]
          [Silence 7:00-9:00]
          [Return Instructions 9:00-10:00]

Type: Timed
Pattern: Broadcast
Content: Pre-sequenced audio + TTS
```

---

## Integration with Organizer Flow

### Step 2.5: Choose Template Type
```
┌────────────────────────────────┐
│ Choose Template Type:          │
│                                │
│ ○ Live (Real-time control)     │
│   You control timing manually  │
│                                │
│ ● Timed (Pre-sequenced)        │
│   Events play automatically    │
│   [Edit Timeline →]            │
└────────────────────────────────┘
```

### Step 3b: Edit Timeline (Timed Templates Only)
```
If "Timed" selected:
  → Open timeline editor
  → Drag/drop events
  → Set durations
  → Preview sequence
  → Save
```

