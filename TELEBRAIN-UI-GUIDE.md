# Telebrain-Inspired UI Implementation Guide

## Overview

WarmSwarm now includes a Telebrain-inspired UI theme as an alternative to the colorful gradient design. The new design features:

- ✅ Dark, minimal aesthetic
- ✅ Icon-based navigation
- ✅ Glass-morphism panels
- ✅ Quantico font (same as Telebrain)
- ✅ Activity log and performer lists
- ✅ Text-to-speech interface
- ✅ Two-button home layout (PERFORM / PROGRAM)

---

## Demo Pages

### Telebrain-Style Pages

| Route | Description |
|-------|-------------|
| `/telebrain-home` | Main landing page with PERFORM/PROGRAM buttons |
| `/telebrain-perform` | Live performance interface with activity log |

### Original Style Pages

| Route | Description |
|-------|-------------|
| `/` | Original colorful gradient home |
| `/live` | Original live performance page |
| `/create` | Create swarm page |
| `/join` | Join swarm page |
| `/swarms` | Browse swarms page |

---

## UI Components

### TelebrainLayout Component

Location: `src/components/TelebrainLayout.tsx`

Features:
- Dark header with dropdown menu
- Icon-based navigation (⚙️ Program, 📢 Perform, ℹ️ Info)
- Audio mute toggle (🔊/🔇)
- Sticky header
- Glass-panel dropdowns

```tsx
import TelebrainLayout from '@/components/TelebrainLayout';

export default function MyPage() {
  return (
    <TelebrainLayout>
      <div>Your content here</div>
    </TelebrainLayout>
  );
}
```

---

## Design Tokens

### Colors (CSS Variables)

```css
--bg-primary: #1a1a1a       /* Main background */
--bg-secondary: #2a2a2a     /* Secondary background */
--text-primary: #ffffff     /* Primary text */
--text-secondary: #a0a0a0   /* Secondary text */
--accent: #ded5e1           /* Accent color (lavender) */
--accent-dark: #9a8ea3      /* Darker accent */
--border: #404040           /* Border color */
```

### Typography

```css
font-family: 'Quantico', Arial, Helvetica, sans-serif;
```

Google Fonts CDN:
```html
<link href="https://fonts.googleapis.com/css2?family=Quantico:wght@400;700&display=swap" rel="stylesheet">
```

---

## CSS Classes

### Glass Panel

```html
<div class="glass-panel rounded-xl p-6">
  Content with frosted glass effect
</div>
```

### Hero Background

```html
<div class="hero-bg min-h-screen">
  Gradient dark background
</div>
```

### Telebrain Button

```html
<button class="btn-telebrain">
  Click me
</button>
```

### Activity Log

```html
<div class="activity-log">
  Scrollable log with custom scrollbar
</div>
```

### Message Item

```html
<div class="message-item">
  Hoverable message with border
</div>
```

### Chat Input

```html
<input class="chat-input" placeholder="Type..." />
```

### Icon Pulse Animation

```html
<span class="w-2 h-2 bg-green-500 rounded-full icon-pulse"></span>
```

---

## Key Features

### 1. Two-Button Home

Large PERFORM and PROGRAM buttons centered on the page:

```tsx
<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
  <Link href="/live">
    <div className="glass-panel p-12 rounded-2xl hover:scale-105 transition-all">
      <h2>PERFORM</h2>
    </div>
  </Link>
  <Link href="/create">
    <div className="glass-panel p-12 rounded-2xl hover:scale-105 transition-all">
      <h2>PROGRAM</h2>
    </div>
  </Link>
</div>
```

### 2. Performance Interface

Layout with main area and sidebar:

```tsx
<div className="grid lg:grid-cols-3 gap-6">
  {/* Main performance area (2/3 width) */}
  <div className="lg:col-span-2 space-y-6">
    {/* Image viewer */}
    {/* Text receive */}
    {/* Text send */}
    {/* TTS interface */}
  </div>

  {/* Sidebar (1/3 width) */}
  <div className="space-y-6">
    {/* Performers list */}
    {/* Activity log */}
    {/* Session info */}
  </div>
</div>
```

### 3. Activity Log

Telebrain-style scrollable activity log:

```tsx
<div className="glass-panel rounded-xl p-6">
  <h5 className="text-sm font-bold mb-4 text-[#ded5e1]">📋 Activity Log</h5>
  <div className="activity-log space-y-2">
    {activityLog.map((log, i) => (
      <div key={i} className="message-item rounded px-3 py-2 text-sm">
        <span className="font-bold text-xs text-[#39a64e]">{log.sender}:</span>
        <span className="text-[#a0a0a0]">{log.text}</span>
        <span className="float-right text-xs text-[#666]">{log.time}</span>
      </div>
    ))}
  </div>
</div>
```

### 4. Text-to-Speech Interface

Language selector and TTS input:

```tsx
<div className="glass-panel rounded-xl p-6">
  <h5 className="text-sm font-bold mb-3 text-[#ded5e1]">Live Text-to-Speech</h5>
  <div className="space-y-3">
    <select className="chat-input w-full">
      <option value="en">English</option>
      <option value="fr">French</option>
      {/* More languages */}
    </select>
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Type text for speech..."
        className="chat-input flex-1"
      />
      <button className="btn-telebrain px-6 py-3">
        Speak
      </button>
    </div>
  </div>
</div>
```

### 5. Performer List

Connected users with status indicators:

```tsx
<div className="glass-panel rounded-xl p-6">
  <h5 className="text-sm font-bold mb-4 text-[#ded5e1]">👥 Performers</h5>
  <div className="space-y-2">
    {performers.map((performer, i) => (
      <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-white/5 transition-colors">
        <span className={`w-2 h-2 rounded-full ${performer.connected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        <span className="text-sm">{performer.nickname}</span>
        {performer.role && (
          <span className="text-xs text-[#999] ml-auto">{performer.role}</span>
        )}
      </div>
    ))}
  </div>
</div>
```

---

## Comparison: Telebrain vs WarmSwarm

### Similarities

| Feature | Telebrain | WarmSwarm |
|---------|-----------|-----------|
| Header | Dark navbar with dropdowns | ✅ Implemented |
| Typography | Quantico font | ✅ Same font |
| Home | Two large buttons (PERFORM/PROGRAM) | ✅ Implemented |
| Activity Log | Scrollable with timestamps | ✅ Implemented |
| TTS Interface | Language selector + input | ✅ Implemented |
| Icons | Font Awesome icons | 🎨 Emoji icons (modern) |

### Improvements in WarmSwarm

| Feature | Telebrain | WarmSwarm Enhancement |
|---------|-----------|----------------------|
| Design | Bootstrap 2 (2013) | Tailwind CSS + modern CSS |
| Effects | Basic shadows | Glass-morphism, blur effects |
| Animations | Minimal | Smooth transitions, hover effects |
| Responsive | Basic | Fully responsive grid layouts |
| Accessibility | Limited | Better contrast, larger touch targets |

---

## Migration Guide

### Converting Existing Pages

1. **Wrap with Layout**:
```tsx
// Before
export default function MyPage() {
  return <div>Content</div>;
}

// After
import TelebrainLayout from '@/components/TelebrainLayout';

export default function MyPage() {
  return (
    <TelebrainLayout>
      <div>Content</div>
    </TelebrainLayout>
  );
}
```

2. **Replace Container**:
```tsx
// Before
<div style={{ padding: '2rem', background: '#fff' }}>

// After
<div className="container mx-auto px-4 py-8">
```

3. **Use Glass Panels**:
```tsx
// Before
<div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>

// After
<div className="glass-panel rounded-xl p-6">
```

4. **Update Colors**:
```tsx
// Before
color: '#333'

// After
className="text-[#a0a0a0]"
```

---

## Screenshot Comparison

### Telebrain Original

```
┌─────────────────────────────────────────┐
│  telebrain   ⚙️  📢   ℹ️  🔊          │
├─────────────────────────────────────────┤
│                                         │
│              🧠                         │
│                                         │
│      ┌──────────────┐  ┌──────────────┐│
│      │              │  │              ││
│      │   PERFORM    │  │   PROGRAM    ││
│      │              │  │              ││
│      └──────────────┘  └──────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### WarmSwarm Telebrain Style

```
┌─────────────────────────────────────────┐
│  warmswarm   ⚙️  📢   ℹ️  🔊          │
├─────────────────────────────────────────┤
│                                         │
│              🧠                         │
│           WARMSWARM                     │
│                                         │
│      ┌──────────────┐  ┌──────────────┐│
│      │      📢      │  │      ⚙️      ││
│      │   PERFORM    │  │   PROGRAM    ││
│      │  Join live   │  │Create content││
│      └──────────────┘  └──────────────┘│
│                                         │
│  [Join with Code]  [My Swarms]         │
│                                         │
│            🟢 System Synchronized       │
└─────────────────────────────────────────┘
```

---

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Uses:
- CSS Grid
- Flexbox
- CSS Variables
- Backdrop filter (glass effect)
- CSS animations

---

## Performance

### Optimizations

- CSS containment for animations
- Will-change hints for transforms
- Lazy loading of Socket.IO
- Debounced scroll events
- Minimal re-renders with React hooks

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

---

## Customization

### Change Accent Color

```css
/* globals.css */
:root {
  --accent: #ded5e1;  /* Change to your color */
  --accent-dark: #9a8ea3;
}
```

### Adjust Glass Effect

```css
.glass-panel {
  background: rgba(42, 42, 42, 0.6);  /* Opacity 0-1 */
  backdrop-filter: blur(10px);        /* Blur amount */
}
```

### Change Font

```css
body {
  font-family: 'Your Font', Arial, sans-serif;
}
```

---

## Next Steps

1. **Test the demo pages**:
   ```bash
   npm run dev
   # Visit http://localhost:3444/telebrain-home
   ```

2. **Migrate existing pages** to use `TelebrainLayout`

3. **Add more Telebrain features**:
   - Visual content viewer
   - Audio phrase library
   - Role management
   - Metronome/timer controls

4. **Integrate with backend**:
   - Socket.IO event handlers
   - Real-time updates
   - Content loading

---

## Resources

- Original Telebrain: https://github.com/blechdom/telebrain-master
- Quantico Font: https://fonts.google.com/specimen/Quantico
- Glass-morphism: https://glassmorphism.com/
- Tailwind CSS: https://tailwindcss.com/

---

## See Also

- `src/components/TelebrainLayout.tsx` - Layout component
- `src/app/globals.css` - Global styles and theme
- `src/app/telebrain-home/page.tsx` - Home page example
- `src/app/telebrain-perform/page.tsx` - Perform page example

