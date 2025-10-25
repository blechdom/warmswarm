# Action Library Guide

## Overview

The WarmSwarm Action Library provides **20+ pre-loaded actions** that organizers/senders can choose from when creating swarm commands.

## Features

### ✨ Current Actions (20+)

**Movement** (5)
- Run, Walk, Jump, Spin, Stop

**Position** (3)
- Sit, Stand, Kneel

**Gestures** (5)
- Wave, Point, Clap, Raise Hand, Arms Up

**Voice** (4)
- Shout, Scream, Whistle, Sing

**Emotions** (5)
- Smile, Sad, Angry, Surprised, Love

### 🎨 Components

1. **ActionPicker Component** (`/src/components/ActionPicker.tsx`)
   - Beautiful modal interface
   - Search functionality
   - Category filtering
   - Grid layout with icons
   - Click to select

2. **Action Library** (`/src/lib/actionLibrary.tsx`)
   - Centralized action definitions
   - Category management
   - Search/filter utilities
   - GIF path ready

3. **Demo Page** (`/action-library`)
   - Test the action picker
   - See all available actions
   - Preview selections

## Usage

### Try it now:

1. Visit: **http://localhost:3333/action-library**
2. Click "Browse Action Library"
3. Explore categories or search
4. Click any action to select it

### For Development:

```tsx
import ActionPicker from '@/components/ActionPicker';
import { Action } from '@/lib/actionLibrary';

function MyComponent() {
  const [showPicker, setShowPicker] = useState(false);
  
  const handleActionSelect = (action: Action) => {
    console.log('Selected:', action.name);
    // action.id, action.icon, action.gifPath, etc.
  };
  
  return (
    <>
      <button onClick={() => setShowPicker(true)}>
        Choose Action
      </button>
      
      {showPicker && (
        <ActionPicker
          onSelect={handleActionSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
```

## Adding GIF Files

Currently using **react-icons** as placeholders. To add actual animated GIFs:

1. Download free GIFs from:
   - Pixabay (pixabay.com/gifs)
   - Icons8 (icons8.com)
   - Animately (animately.co)

2. Save to: `/public/gifs/actions/[action-name].gif`
   - Example: `/public/gifs/actions/run.gif`

3. The paths are already configured in the Action Library!

4. GIFs will automatically be available at the path specified in each action's `gifPath` property.

## Future Enhancements

- [ ] Add more actions (50+ total)
- [ ] Allow custom user-uploaded GIFs
- [ ] Integrate GIPHY API for unlimited options
- [ ] Add action preview/animation
- [ ] Create action sequences/combos
- [ ] Export/import custom action sets

## Integration Points

The Action Library is ready to integrate into:
- `/swarm` page (sender interface)
- `/templates` page (swarm organizer)
- `/create/constellation` page (advanced builder)

## Status

✅ Action Library created (20+ actions)
✅ ActionPicker component ready
✅ Demo page available
✅ GIF paths configured
⏳ Waiting for actual GIF files to be added
⏳ Integration into swarm sender interface (next step)

## Next Steps

1. **Test the demo**: Visit `/action-library` to see the picker in action
2. **Download GIFs**: Get 10-20 animated GIFs from free sources
3. **Integrate into swarm page**: Add ActionPicker to sender interface
4. **Create templates**: Build pre-configured swarm templates with actions

