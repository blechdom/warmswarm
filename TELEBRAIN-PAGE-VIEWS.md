# Telebrain Page Views - Complete Reference

## Overview

Telebrain uses Backbone.js routing with 45+ different views organized into functional categories.

---

## Main Routes & Page Views

### 🏠 Core Pages

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#` (home) | `HomeView` | `HomeView.html` | Landing page with PERFORM/PROGRAM buttons |
| `#login` | `LoginView` | `LoginView.html` | User authentication |
| `#about` | `AboutView` | `AboutView.html` | About/contact information |
| `#tutorial` | `TutorialView` | `TutorialView.html` | User tutorial |
| `#instructions` | `InstructionsView` | `InstructionsView.html` | How-to instructions |

---

## 🎭 Performance Pages

### Main Performance

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#performance` | `PerformanceView` | `PerformanceView.html` | Legacy performance interface |
| `#performance2` | `PerformanceMasterHeaderView2` | `PerformanceHeaderView2.html` | **Main performance setup** |
| `#performance2/:parent_id/:id` | `PerformanceMasterView2` | `PerformanceView2.html` | **Live performance interface** |
| `#perform/:parent_id/:id` | `PerformListView` | `PerformView.html` | Program content viewer |

### Performance Components

- **Performance Header**: Navigation and controls during performance
- **Activity Log**: Real-time event logging
- **Performer List**: Connected users
- **Content Display**: Images, audio, text, timers
- **TTS Interface**: Live text-to-speech

---

## ⚙️ Program/Create Pages

### Content Creation

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#create/:parent_id/:id` | `CreateListView` | `CreateView.html` | Browse/create content by type |

### Content Types (via Create)

| Parent ID | Type | View | Template |
|-----------|------|------|----------|
| `17`, `18` | Image URLs | `ImageURLView` | `ImageURLView.html` |
| `19` | Teleprompts (Text) | `TelepromptView` | `TelepromptView.html` |
| `21` | Audio URLs | `AudioURLView` | `AudioURLView.html` |
| `22` | Audio Uploads | `AudioUploadView` | `AudioUploadView.html` |
| `23` | Text-to-Speech | `TTSView` | `TTSView.html` |

---

## 📦 Collections & Structure

### Organizational Pages

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#structure/:parent_id/:id` | Various Master Views | Multiple | Structured content |

### Structure Types

| Parent ID | Type | View | Template |
|-----------|------|------|----------|
| `56` | Audio-Image Pairs | `AudioImagePairMasterView` | `AudioImagePairView.html` |
| `57` | Image Phrases | `ImagePhraseMasterView` | `ImagePhraseView.html` |
| `58` | Audio Sentences | `AudioSentenceMasterView` | `AudioSentenceView.html` |
| `59` | Content Collections | `ContentCollectionsMasterView` | `ContentCollectionsView.html` |

---

## 🎼 Program Management

### Programs & Organization

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#program/:parent_id/:id` | Various Program Views | Multiple | Program management |

### Program Types

| Parent ID | Type | View | Template |
|-----------|------|------|----------|
| `13` | Interfaces | `InterfaceView` | `InterfaceView.html` |
| `15` | Programs | `ProgramsMasterView` | `ProgramsView.html` + `ProgramView.html` |
| `50` | Multi-roles | `MultiroleMasterView` | `MultiroleView.html` |
| `51` | Fragments | `FractionsMasterView` | `FragmentView.html` + `FractionView.html` |

---

## ⏱️ Timing & Algorithms

### Time-Based Controls

| Type | View | Template | Route Pattern |
|------|------|----------|---------------|
| Timer | `TimerView` | `TimerView.html` | `#perform/35/:id` |
| Metronome | `MetroView` | `MetroView.html` | `#perform/36/:id` |
| Timed Organization | `TimedOrganizationMasterView` | `TimedOrganizationView.html` | `#perform/37/:id` |
| Scheduler | `SchedulerView` | `SchedulerView.html` | `#scheduler` |

---

## 👥 User & Role Management

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#brains/:id` | `MyBrainsView` | `MyBrainsView.html` | User's "brains" (projects) |
| `#perform/12/:id` | `RoleView` | `RoleView.html` | Role assignment/permissions |

---

## 🧪 Development & Testing

| Route | View | Template | Purpose |
|-------|------|----------|---------|
| `#testosc` | `TestoscView` | `TestoscView.html` | OSC (Open Sound Control) testing |
| `#database` | `DatabaseView` | `DatabaseView.html` | Database viewer/admin |

---

## Complete View List (Alphabetical)

### View Files (`public/js/views/`)

1. `about.js` - About page
2. `audioImagePair.js` - Audio-image pair creator
3. `audioSentence.js` - Audio sentence builder
4. `audioUploads.js` - Audio upload manager
5. `audioURLs.js` - Audio URL manager
6. `brains.js` - Brain (project) list
7. `build.js` - Build interface
8. `contentCollections.js` - Collection organizer
9. `controls.js` - Performance controls
10. `create.js` - Content creation interface
11. `database.js` - Database viewer
12. `fractions.js` - Fraction components
13. `fragments.js` - Fragment builder
14. `header.js` - Navigation header
15. `home.js` - Home page
16. `imagePhrase.js` - Image phrase creator
17. `imageUploads.js` - Image upload manager
18. `imageURLs.js` - Image URL manager
19. `instructions.js` - Instructions page
20. `interfaces.js` - Interface builder
21. `login.js` - Login form
22. `metronomes.js` - Metronome control
23. `moduledetails.js` - Module detail view
24. `modulelist.js` - Module list view
25. `multirole.js` - Multi-role manager
26. `myBrains.js` - User's brains view
27. `networks.js` - Network topology
28. `paginator.js` - Pagination component
29. `performance2.js` - **Main performance view**
30. `performanceheader2.js` - Performance header
31. `performance.js` - Legacy performance view
32. `perform.js` - Perform view
33. `phrases.js` - Phrase builder
34. `programs.js` - Program manager
35. `roles.js` - Role manager
36. `scheduler.js` - Scheduler interface
37. `schedules.js` - Schedule viewer
38. `teleprompts.js` - Teleprompt manager
39. `testosc.js` - OSC tester
40. `timedOrganization.js` - Timing algorithm
41. `timers.js` - Timer controls
42. `troupes.js` - Troupe (group) manager
43. `tts.js` - Text-to-speech view
44. `ttss.js` - TTS collection view
45. `tutorial.js` - Tutorial page
46. `units.js` - Unit organizer

---

## Key Content Type IDs

| ID | Content Type |
|----|--------------|
| `4` | Programs |
| `5` | Visual content |
| `6` | Audio content |
| `8` | Collections |
| `11` | Organization tools |
| `12` | Roles |
| `13` | Interfaces |
| `15` | Programs |
| `16` | Fragments |
| `17` | Image URLs (menu) |
| `18` | Image URLs (upload) |
| `19` | Teleprompts |
| `21` | Audio URLs |
| `22` | Audio Uploads |
| `23` | Text-to-Speech |
| `35` | Timers |
| `36` | Metronomes |
| `37` | Timed Organization |
| `50` | Multi-roles |
| `51` | Fragments |
| `56` | Audio-Image Pairs |
| `57` | Image Phrases |
| `58` | Audio Sentences |
| `59` | Content Collections |
| `75` | Brains (projects) |
| `77` | Under construction |

---

## Navigation Flow

### Typical User Journey

```
Home
  ├─→ PERFORM
  │   ├─→ Select Program
  │   ├─→ Join Performance Session
  │   ├─→ Send/Receive Content
  │   └─→ View Activity Log
  │
  └─→ PROGRAM
      ├─→ Create Content
      │   ├─→ Audio (URL/Upload/TTS)
      │   ├─→ Images (URL/Upload)
      │   ├─→ Text (Teleprompts)
      │   └─→ Timers/Metronomes
      │
      ├─→ Organize Content
      │   ├─→ Audio-Image Pairs
      │   ├─→ Image Phrases
      │   ├─→ Audio Sentences
      │   └─→ Collections
      │
      └─→ Build Programs
          ├─→ Create Program
          ├─→ Assign Roles
          ├─→ Set Interfaces
          └─→ Add Fragments
```

---

## Implementation Priority for WarmSwarm

### ✅ Already Implemented

1. **Home** - Telebrain-style with PERFORM/PROGRAM buttons
2. **Performance Interface** - Activity log, performer list, messaging

### 🎯 High Priority

1. **Content Creation Views**
   - Audio upload/URL
   - Image upload/URL
   - Text/TTS creation
   - Timer/Metronome controls

2. **Program Builder**
   - Create programs
   - Assign roles
   - Build sequences

3. **Content Collections**
   - Organize content into groups
   - Create structured performances

### 📋 Medium Priority

1. **Role Management** - Permission system
2. **Interfaces** - Custom UI layouts
3. **Fragments** - Reusable program components
4. **Scheduler** - Time-based automation

### 🔮 Future Enhancements

1. **Timed Organization** - Complex timing algorithms
2. **Multi-role** - Advanced role coordination
3. **Network Visualization** - Topology viewer
4. **Database Admin** - Advanced DB management

---

## Technical Architecture

### View Structure

```javascript
// Typical Backbone View Pattern
var MyView = Backbone.View.extend({
    template: _.template(...),
    
    events: {
        'click .button': 'handleClick'
    },
    
    initialize: function() {
        // Setup
    },
    
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
```

### Router Pattern

```javascript
routes: {
    "": "home",
    "performance2": "performanceSetup2",
    "create/:parent_id/:id": "createType"
}
```

---

## Component Relationships

```
Header (always visible)
  └─→ Content Area
      ├─→ List Views (browse)
      ├─→ Detail Views (edit/view)
      └─→ Master Views (manage)
          ├─→ Collection
          └─→ Individual Items
```

---

## See Also

- `TELEBRAIN-ANALYSIS.md` - Detailed feature analysis
- `TELEBRAIN-UI-GUIDE.md` - UI implementation guide
- `DATABASE-SCHEMA.md` - Database structure
- Original Telebrain: `/home/kgalvin/CascadeProjects/telebrain-master`

