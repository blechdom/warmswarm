# WarmSwarm Hub Hierarchy

Last Updated: October 21, 2025

```
┌──────────────────────────────────────────────────────────────┐
│                    WARMSWARM (Root: /)                       │
│                  Warm[LOGO]Swarm Homepage                    │
│                                                              │
│   Navigation: [warmswarm] Create | Collect | Coordinate |    │
│               Connect                                        │
│                                                              │
│   Action Cards:  [🐝 SWARM]    [⚙️ CREATE]                  │
│   (Swarm accessed through Connect → Start Swarm)            │
└──────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼

┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  CREATE  │      │CATALOGUE │      │COORDINATE│      │ CONNECT  │
│ /create  │      │/catalogue│      │/coordinate│     │ /connect │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │                  │
     │                 │                  │                  │
     ▼                 ▼                  ▼                  ▼
                                                                    
CREATE HUB:             CATALOGUE HUB:         COORDINATE HUB:      CONNECT HUB:
Content Creation        Browse & Manage        Planning & Org      Share & Schedule

├─ Audio                ├─ Audio                ├─ Sequences        ├─ Share QR Code
│  ├─ From URL         │  (Browse audio)       │  (Timeline)       │  (Generate codes)
│  ├─ Upload File      │                        │                   │
│  └─ Text-to-Speech   ├─ Image                ├─ Layers           ├─ Send Invites
│                       │  (Browse images)      │  (Layer mgmt)     │  (Email/Link)
├─ Image                │                        │                   │
│  ├─ From URL         ├─ Video                └─ Swarms           └─ Start Swarm
│  ├─ Upload File      │  (Browse videos)         (Setup swarm)       (→ /swarm)
│  └─ Text Prompt      │                                              
│                       ├─ Sequences                                  
└─ Video                │  (Browse sequences)                         
   ├─ From URL         │                                              
   ├─ Upload File      ├─ Layers                                     
   └─ Generate         │  (Browse layers)                            
                        │                                              
                        └─ Swarms                                     
                           (Browse swarms)


═══════════════════════════════════════════════════════════════════════════

TIER 1 - TOP LEVEL NAVIGATION (Main Menu):
┌───────────────┬────────────┬─────────────────────────────────────────┐
│ Route         │ Name       │ Description                             │
├───────────────┼────────────┼─────────────────────────────────────────┤
│ /             │ Home       │ Landing page with action cards          │
│ /create       │ Create     │ Content creation hub                    │
│ /connect      │ Connect    │ Share, invite, schedule                 │
│ /coordinate   │ Coordinate │ Organize sequences, layers, swarms      │
│ /swarm        │ Swarm      │ Live swarm sessions (primary)           │
│ /catalogue    │ Catalogue  │ Browse all content types                │
└───────────────┴────────────┴─────────────────────────────────────────┘

TIER 2 - CREATE CATEGORIES (/create):
┌─────────────────┬──────────┬────────────────────────────────────────┐
│ Route           │ Name     │ Sub-features                           │
├─────────────────┼──────────┼────────────────────────────────────────┤
│ /create/audio   │ Audio    │ URL / Upload / Text-to-Speech          │
│ /create/image   │ Image    │ URL / Upload / Text Prompt             │
│ /create/video   │ Video    │ URL / Upload / Generate (NEW)          │
└─────────────────┴──────────┴────────────────────────────────────────┘

TIER 2 - CONNECT FEATURES (/connect):
┌─────────────────┬──────────────┬─────────────────────────────────────┐
│ Route           │ Name         │ Purpose                             │
├─────────────────┼──────────────┼─────────────────────────────────────┤
│ /connect/qr     │ Share QR     │ Generate shareable QR codes         │
│ /connect/invite │ Send Invites │ Email/link invitations              │
│ /connect/schedule│ Schedule    │ Plan upcoming swarm sessions        │
└─────────────────┴──────────────┴─────────────────────────────────────┘

TIER 2 - COORDINATE CATEGORIES (/coordinate):
┌───────────────────────┬───────────┬──────────────────────────────────┐
│ Route                 │ Name      │ Purpose                          │
├───────────────────────┼───────────┼──────────────────────────────────┤
│ /coordinate/sequences │ Sequences │ Timeline-based content sequences │
│ /coordinate/layers    │ Layers    │ Multi-layer content management   │
│ /coordinate/swarms    │ Swarms    │ Swarm coordination & setup       │
└───────────────────────┴───────────┴──────────────────────────────────┘

TIER 2 - CATALOGUE CATEGORIES (/catalogue):
┌──────────────────────┬───────────┬──────────────────────────────────┐
│ Route                │ Name      │ Content                          │
├──────────────────────┼───────────┼──────────────────────────────────┤
│ /catalogue/audio     │ Audio     │ Browse all audio content         │
│ /catalogue/image     │ Image     │ Browse all image content         │
│ /catalogue/video     │ Video     │ Browse all video content         │
│ /catalogue/sequences │ Sequences │ Browse saved sequences           │
│ /catalogue/layers    │ Layers    │ Browse saved layers              │
│ /catalogue/swarms    │ Swarms    │ Browse all swarms                │
└──────────────────────┴───────────┴──────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════

DATABASE TABLE SCHEMAS (Recommended):

CREATE:
  - audio_content (url, upload_path, tts_config)
  - image_content (url, upload_path, text_prompt)
  - video_content (url, upload_path, generated_config)

COORDINATE:
  - sequences (timeline_data, content_references)
  - layers (layer_config, z_index, content_refs)
  - swarms (swarm_config, participants, topology)

CATALOGUE:
  - Uses same tables as CREATE categories
  - Plus views/indexes for browsing and search


═══════════════════════════════════════════════════════════════════════════

NAMING CHANGES APPLIED:
✅ "Perform" → "Swarm" (live sessions)
✅ "Program" → "Create" (content creation)
✅ "Library" → "Catalogue" (browse content)
✅ "Audio Hub" → "Audio"
✅ "Visual Hub" → "Image"
✅ Added "Video" category under Create
✅ Added "Connect" top-level (QR/Invite/Schedule)
✅ Added "Coordinate" top-level (Sequences/Layers/Swarms)

ICON UPDATES:
  Home:       🏠
  Create:     ⚙️
  Connect:    🔗
  Coordinate: 🎯
  Swarm:      🐝 (primary/highlighted)
  Catalogue:  📚
```

## Implementation Status

### ✅ Completed:
- Main navigation menu updated
- Homepage action cards updated
- `/create` directory renamed from `/program`
- `/connect` hub page created with 3 features
- MainMenu component updated with all new names

### 🔄 To Do:
- Update `/create/page.tsx` with new category names (Audio, Image, Video)
- Rename `/create/audio` page (remove "Hub" from title)
- Rename `/create/visual` → `/create/image` (and update content)
- Create `/create/video` page
- Create `/coordinate` hub page
- Create `/coordinate/sequences` page
- Create `/coordinate/layers` page (NEW)
- Create `/coordinate/swarms` page
- Create `/catalogue` hub page
- Create `/catalogue/*` category pages
- Rename `/swarms` → `/swarm` (for live sessions)
- Update all internal links to use new routes

## Next Steps

1. Update Create hub with Audio/Image/Video categories
2. Build out Connect features (QR/Invite/Schedule)
3. Build Coordinate hub and sub-pages
4. Build Catalogue hub and browsing interfaces
5. Update database schemas to match new structure

