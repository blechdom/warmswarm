# WarmSwarm User Flow Map

## 🎯 Key Insight

**Organizers should NOT see the 5 C's complexity!**

The full workflow (Collect, Cast, Coordinate, Constellation, Catalogue, Connect) is for **Advanced** users who build templates and custom configurations.

**Organizers** get a simple flow:
1. Choose template
2. Customize (names, numbers, content)
3. Save & launch
4. Manage their swarms

---

## Three User Types

### 1. **Participants** 🎭
**Goal:** Join and experience swarms, potentially send/contribute when allowed

**Current Entry Points:**
- Home `/` → "Join a swarm" pill
- `/join` - Direct join page
- `/swarms` - Browse public swarms

**Ideal Journey:**
1. **Discover** → Browse available swarms
2. **Join** → Enter with nickname (and invite code if private)
3. **Experience** → Receive content/instructions
4. **Potentially Send** → Contribute when swarm allows (role upgrade)
5. **Stay Connected** → Bookmark/favorite swarms

**Key Needs:**
- Simple entry (minimal friction)
- Clear visibility of what swarm allows (receive-only vs. interactive)
- Easy transition from participant → sender when permitted
- See what actions are available in real-time

---

### 2. **Organizers** 🎨
**Goal:** Quickly organize and launch swarms from templates with simple customization

**Current Entry Points:**
- Home `/` → "create" card
- `/create` - Currently shows 5 C's (too complex, should be for Advanced)

**Ideal Journey (NEW SIMPLIFIED FLOW):**
1. **New Swarm** → Click "Create Swarm"
2. **Choose Template** → Pick from short list of pre-configured swarms
   - Examples: "Group Dance", "Sing Along", "Story Circle", "Meditation Session"
3. **Customize** → Adjust simple settings:
   - **Names** (swarm name, participant labels)
   - **Numbers** (how many participants, duration, timing)
   - **Content** (upload/select audio, text, video, TTS)
4. **Save** → Store swarm configuration
5. **Launch** → Go live or share invite code
6. **Manage** → View list of "My Swarms", edit, relaunch

**Key Needs:**
- Fast path (under 2 minutes to launch)
- Pre-configured templates (no need to understand coordination patterns)
- Simple content upload/selection
- Easy save and recall
- Share/invite system

**NOT included for Organizers:**
- Complex coordination (that's for Advanced)
- Constellation patterns (that's for Advanced)
- Deep customization (that's for Advanced)

---

### 3. **Advanced** 🔧
**Goal:** Build custom swarm configurations, constellation patterns, and complex coordination

**Current Entry Points:**
- `/create/constellation` - Choose coordination patterns
- `/create/coordinate` - Advanced sequencing
- **Should also include:** The full 5 C's workflow

**Ideal Journey:**
1. **Start** → Access advanced tools
2. **Collect** → Gather and organize content (audio, images, video)
3. **Cast** → Define roles, qualities, and permissions
4. **Coordinate** → Arrange sequences, layers, and swarms
5. **Constellation** → Choose/configure coordination patterns
   - Unison, Layers, Hub-Spoke, Distributed, Star, Circle, Line, Tree, Pairs, Broadcast
6. **Catalogue** → Browse and manage all components
7. **Connect** → Advanced deployment options
8. **Test** → Simulate and preview
9. **Save as Template** → Share for Organizers to use

**Key Needs:**
- Full control over all settings
- Access to all constellation patterns
- Complex coordination tools
- Ability to create reusable templates
- Testing/preview capabilities
- Documentation and examples

---

## Current Navigation Structure

### Home Page (`/`)
```
┌─────────────────────────────────────┐
│  warm 🐝 swarm                      │
│  synchronize action · coordinate    │
└─────────────────────────────────────┘

┌──────────────┬──────────────┐
│ 🐝 swarm     │ ✨ create    │
│ Join live    │ Build and    │
│ swarm        │ organize     │
│              │              │
│ • Examples   │ • Templates  │
│ • Start      │ • Collect    │
│ • Join       │ • Cast       │
└──────────────┴──────────────┘

┌──────────────┬──────────────┐
│ ❓ wtf?      │ 💡 about     │
│ Get started  │ Who/why      │
└──────────────┴──────────────┘
```

### Create Section (`/create`)
```
┌──────────────────────────────────┐
│        ⚙️ Create                 │
│  Build your swarm performance    │
└──────────────────────────────────┘

📦 Collect → Gather content (audio/image/video)
🎭 Cast → Define roles and qualities
🎯 Coordinate → Arrange sequences/layers
📚 Catalogue → Browse all components
🔗 Connect → Plan, invite, go live
```

---

## Proposed User-Oriented Reorganization

### Option A: Role-Based Home Page

```
┌───────────────────────────────────┐
│     "Who are you today?"          │
└───────────────────────────────────┘

┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ 🎭 Participant │  │ 🎨 Organizer  │  │ 🔧 Advanced   │
│               │  │               │  │               │
│ I want to     │  │ I want to     │  │ I want to     │
│ join a swarm  │  │ organize a    │  │ build custom  │
│               │  │ swarm         │  │ configs       │
│ [Browse]      │  │ [Templates]   │  │ [Advanced]    │
│ [Join Code]   │  │ [My Swarms]   │  │ [Full Tools]  │
└───────────────┘  └───────────────┘  └───────────────┘
```

### Option B: Action-Oriented Home Page (Current, but refined)

```
┌───────────────────────────────────┐
│  warm 🐝 swarm                    │
└───────────────────────────────────┘

┌─────────────┐  ┌─────────────┐
│ 🐝 Join     │  │ ✨ Create   │  (Primary)
└─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐
│ ⭐ Examples │  │ 🔧 Advanced │  (Secondary)
└─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐
│ ❓ WTF?     │  │ 💡 About    │  (Info)
└─────────────┘  └─────────────┘
```

### Option C: Journey-Oriented Home Page

```
┌───────────────────────────────────┐
│  Start your swarm journey         │
└───────────────────────────────────┘

PRIMARY PATHS:
┌──────────────────────────────────┐
│ 🎭 I want to join a swarm        │
│    → Browse · Join with code     │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ 🎨 I want to create a swarm      │
│    → Quick start · From template │
└──────────────────────────────────┘

SECONDARY:
• ⭐ Try an example
• 🔧 Advanced configuration (programmers)
• ❓ How does this work?
• 💡 About WarmSwarm
```

---

## Key Insights

### Permission Model (Participants → Senders)
```
SWARM CONFIGURATION (Creator sets):
┌────────────────────────────────────────┐
│ Participation Mode:                    │
│ ○ Receive Only (broadcast)             │
│ ○ Interactive (can send)               │
│ ○ Selective (some roles can send)     │
└────────────────────────────────────────┘

PARTICIPANT EXPERIENCE:
┌────────────────────────────────────────┐
│ You're in: "Morning Dance"             │
│ Your role: Participant                 │
│ Actions available:                     │
│  ✓ Receive instructions                │
│  ✓ Send reactions                      │
│  ✗ Send content (not allowed)          │
└────────────────────────────────────────┘
```

### Navigation Complexity Levels

**Level 1: Participant** (Simple)
- Browse swarms
- Join with code
- Experience swarm
- Basic interactions

**Level 2: Creator** (Moderate)
- 5 C's workflow
- Content management
- Basic coordination
- Invite management

**Level 3: Programmer** (Advanced)
- Constellation patterns
- Complex coordination
- Advanced sequences
- Custom configurations

---

## Recommended Changes

### 1. Home Page Refinement
- Make "Join" and "Create" the two primary actions
- Move "Advanced" (constellation/coordinate) to a separate clear section
- Keep examples and templates prominent for discoverability

### 2. Participant Path Optimization
```
/join → Clear two-path choice:
  1. "I have an invite code" (direct join)
  2. "Browse public swarms" (discovery)
```

### 3. Creator Path Simplification (NEW)
```
/create → Simple template-based flow ONLY:
  1. Choose Template (short list of pre-configured swarms)
  2. Customize: Names, Numbers, Content
  3. Save & Launch
  4. Manage "My Swarms" list
  
NO 5 C's for Creators - that's for Programmers!
```

### 4. Programmer Path (Full Power)
```
/program or /advanced → Full control:
  • 5 C's workflow (Collect, Cast, Coordinate, Catalogue, Connect)
  • Constellation patterns
  • Complex coordination
  • Save as templates for Creators to use
  • Clear "Advanced Tools - For Programmers" messaging
```

### 5. In-Swarm Permission Display
```
Real-time UI shows:
  • Your current role
  • What you can do (send/receive)
  • How to get more permissions (if available)
```

---

## New Creator Flow (Detailed)

### Step 1: Start New Swarm
```
┌────────────────────────────────────┐
│  Create a New Swarm                │
└────────────────────────────────────┘

Button: [+ New Swarm]
OR
Link to: [My Swarms] (to edit existing)
```

### Step 2: Choose Template
```
Templates divided into LIVE and TIMED:

LIVE TEMPLATES (Real-time control):
┌─────────────────┐  ┌─────────────────┐
│ 🎤 Sing Along   │  │ 🎭 Theater Game │
│ Call & response │  │ Improv & play   │
│ (You control)   │  │ (You control)   │
└─────────────────┘  └─────────────────┘

┌─────────────────┐
│ 🎨 Art Together │
│ Follow prompts  │
│ (You control)   │
└─────────────────┘

TIMED TEMPLATES (Pre-sequenced with timeline):
┌─────────────────┐  ┌─────────────────┐
│ 🎵 Group Dance  │  │ 🧘 Meditation   │
│ Choreographed   │  │ Guided session  │
│ [Timeline ⏱]   │  │ [Timeline ⏱]   │
└─────────────────┘  └─────────────────┘

┌─────────────────┐
│ 📖 Story Circle │
│ Timed sequence  │
│ [Timeline ⏱]   │
└─────────────────┘
```

### Step 3: Customize Settings
```
┌────────────────────────────────────┐
│  Customize: "Group Dance" (TIMED) │
└────────────────────────────────────┘

NAMES:
├─ Swarm Name: [Morning Dance Session    ]
├─ Organizer Name: [DJ Sarah             ]
└─ Participant Label: [Dancer            ]

NUMBERS:
├─ Max Participants: [50                  ]
└─ Total Duration: [3:00 minutes          ]

TIMELINE EDITOR (for TIMED templates only):
┌────────────────────────────────────────┐
│ [▶ Play] [⏸ Pause] [⏹ Stop]  0:00/3:00│
├────────────────────────────────────────┤
│ Everyone │████ Audio ████│ │██ Text ██││
│ Group A  │     │██ Text ██│            │
│ Group B  │          │████ Audio ████│  │
│          0s    30s    60s   90s   120s │
└────────────────────────────────────────┘
│ [+ Add Audio] [+ Add Text] [+ Add TTS] │

CONTENT LIBRARY:
├─ Audio: [Upload .mp3] or [Choose from library]
├─ Text: [Type instructions...            ]
├─ Video: [Upload .mp4] or [Choose from library]
└─ TTS: [Generate from text] [Voice: ▼   ]

SETTINGS:
└─ Privacy: ○ Public  ● Private  ○ Invite-Only

Note: LIVE templates skip timeline editor
```

### Step 4: Save & Launch
```
┌────────────────────────────────────┐
│  [Save Draft]  [Save & Go Live]    │
└────────────────────────────────────┘

After Save:
├─ Generate invite code: ABC123
├─ Get shareable link: warmswarm.org/join/ABC123
└─ Add to "My Swarms" list
```

### Step 5: Manage Swarms
```
┌────────────────────────────────────┐
│  My Swarms                         │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Morning Dance Session              │
│ Created: 2 days ago                │
│ Status: ● Live (12 participants)   │
│ [View] [Edit] [Stop] [Share]       │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Evening Meditation                 │
│ Created: 1 week ago                │
│ Status: ○ Draft                    │
│ [View] [Edit] [Delete] [Launch]    │
└────────────────────────────────────┘
```

### What Creators DON'T See:
- ❌ Constellation patterns (abstracted into templates)
- ❌ Coordinate/sequence builder (pre-configured)
- ❌ Cast roles (simplified to participant types)
- ❌ Complex layers (built into templates)
- ❌ Advanced timing (simplified to basic settings)

### What Programmers Build → Creators Use:
```
PROGRAMMER                    CREATOR
├─ Constellation: Unison  →   Template: "Group Dance"
├─ Layers: 3 groups       →   (hidden, just works)
├─ Sequence: Complex      →   "Every X seconds"
└─ Cast: 5 roles          →   "Participants"
```

---

## Questions to Address

1. **Home Page**: Which layout works best?
   - Option A: Role-based ("Who are you today?" - 3 cards)
   - Option B: Action-oriented ("Join" vs "Create" vs "Advanced")
   - Option C: Journey-oriented ("I want to..." statements)

2. **Participant → Sender transition**: How should this work?
   - Manual role upgrade by creator?
   - Automatic based on swarm rules?
   - Request permission system?

3. **Discovery**: How do participants find swarms?
   - Public directory?
   - Categories?
   - Featured/trending?

4. **Template Library**: What templates to start with?
   - Suggested: Group Dance, Sing Along, Story Circle, Meditation, Art Together, Theater Game
   - How many? (6-12 to start?)
   - Where do new templates come from? (Programmers save their work as templates)

5. **Programmer Access**: How to expose advanced tools?
   - Separate section: `/program` or `/advanced`
   - Link from Create page: "Need more control? Advanced Tools →"
   - Clear messaging: "For Programmers - Full control over all settings"

6. **"My Swarms" Management**: Where does this live?
   - Separate page: `/my-swarms`
   - Dashboard view
   - Show: Live swarms, drafts, past swarms, templates

## Next Steps

### Immediate Actions:
1. ✅ Document new user roles (DONE)
2. ⬜ Design new `/create` page (template picker)
3. ⬜ Move current `/create` (5 C's) to `/program` or `/advanced`
4. ⬜ Create 6 starter templates
5. ⬜ Build "My Swarms" management page
6. ⬜ Update home page to reflect new paths

### Phase 2:
- Build template customization form
- Implement save/load swarm configs
- Create invite/share system
- Add "My Swarms" dashboard

### Phase 3:
- Participant → Sender permission system
- Swarm discovery/directory
- Template marketplace (Programmers share templates)

