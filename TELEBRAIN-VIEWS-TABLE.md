# Telebrain-Master Complete Views/Pages Table

## Overview
This table documents all 46 views/pages found in the telebrain-master repository webapp.

---

| # | View/Page Name | Short Description | Visible Elements | Navigation Options | Actions Available |
|---|----------------|-------------------|------------------|-------------------|-------------------|
| **CORE PAGES** |
| 1 | **Home** | Main landing page with welcome message | - Welcome text<br>- Logo<br>- Navigation menu<br>- Quick start buttons | - Header menu (⚙️ Program, 📢 Perform)<br>- Login link<br>- About link<br>- Instructions link | - Navigate to Program<br>- Navigate to Perform<br>- View documentation |
| 2 | **Login** | User authentication page | - Username field<br>- Password field<br>- Login button<br>- Registration link | - Back to home<br>- Register new account | - Login to system<br>- Create new account<br>- Password recovery |
| 3 | **About** | Information about Telebrain | - Project description<br>- Creator info<br>- Contact details<br>- Credits | - Header menu<br>- Back to home | - Read about project<br>- View contact info |
| 4 | **Instructions** | How-to guide for using Telebrain | - Step-by-step guide<br>- Tutorial links<br>- Help text<br>- Example screenshots | - Header menu<br>- Tutorial link<br>- Home | - Read instructions<br>- Navigate to tutorial |
| 5 | **Tutorial** | Interactive walkthrough | - Interactive demo<br>- Step indicators<br>- Next/Previous buttons<br>- Sample content | - Header menu<br>- Next step<br>- Previous step<br>- Skip tutorial | - Complete tutorial steps<br>- Practice features |
| **PERFORMANCE PAGES** |
| 6 | **Performance2** | Live performance interface (v2) | - Room name display<br>- Participant list<br>- Role badges<br>- Content display area<br>- Audio/Image panels<br>- Text chat<br>- Join controls | - Header menu<br>- Leave performance<br>- Role selector<br>- Network selector | - Join performance room<br>- Send audio messages<br>- Send images<br>- Send text messages<br>- Receive synchronized content<br>- Change roles<br>- View participants |
| 7 | **Performance** (legacy) | Original performance interface | - Similar to Performance2<br>- Older UI design<br>- Basic chat<br>- Content display | - Header menu<br>- Leave room<br>- Basic navigation | - Join room<br>- Basic messaging<br>- View content |
| 8 | **Perform** | Performance viewer/observer mode | - Performance list<br>- Room status<br>- Participant count<br>- Join button<br>- Performance details | - Header menu<br>- Browse performances<br>- Join selected performance | - View available performances<br>- Join as performer<br>- Filter performances |
| **AUDIO CONTENT CREATION** |
| 9 | **Audio URLs** | Add audio from web URLs | - Name field<br>- URL input field<br>- Audio preview player<br>- Save/Delete buttons<br>- Image thumbnail | - Header menu<br>- Back to create<br>- Audio uploads<br>- Browse audio list | - Enter audio URL<br>- Name audio<br>- Preview audio<br>- Save audio reference<br>- Delete audio |
| 10 | **Audio Uploads** | Upload audio files | - Name field<br>- File upload button<br>- Audio preview player<br>- Progress indicator<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Audio URLs<br>- Browse audio list | - Upload audio file<br>- Name audio<br>- Preview uploaded audio<br>- Save to library<br>- Delete audio |
| 11 | **TTS (Text-to-Speech)** | Generate speech from text | - Text input field<br>- Voice selector dropdown<br>- Language selector<br>- Speech rate slider<br>- Preview button<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse TTS list | - Enter text<br>- Select voice<br>- Adjust speech rate<br>- Preview TTS<br>- Generate and save<br>- Delete TTS |
| **IMAGE CONTENT CREATION** |
| 12 | **Image URLs** | Add images from web URLs | - Name field<br>- URL input field<br>- Image preview<br>- Dimensions display<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Image uploads<br>- Browse image list | - Enter image URL<br>- Name image<br>- Preview image<br>- Save image reference<br>- Delete image |
| 13 | **Image Uploads** | Upload image files | - Name field<br>- File upload button<br>- Image preview<br>- Crop/resize tools<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Image URLs<br>- Browse image list | - Upload image file<br>- Name image<br>- Crop/resize image<br>- Save to library<br>- Delete image |
| 14 | **Teleprompts** | Create text prompts | - Name field<br>- Text editor<br>- Font size selector<br>- Color picker<br>- Preview pane<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse prompts list | - Enter text content<br>- Format text<br>- Set font size/color<br>- Preview prompt<br>- Save prompt<br>- Delete prompt |
| **COLLECTIONS** |
| 15 | **Audio-Image Pairs** | Combine audio with images | - Name field<br>- Audio selector dropdown<br>- Image selector dropdown<br>- Preview area (audio + image)<br>- Duration field<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse pairs list<br>- Audio library<br>- Image library | - Name pair<br>- Select audio<br>- Select image<br>- Set timing<br>- Preview pair<br>- Save pair<br>- Delete pair |
| 16 | **Image Phrases** | Create sequences of images | - Name field<br>- Image list builder<br>- Drag-and-drop reordering<br>- Duration per image<br>- Transition selector<br>- Preview button<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse phrases<br>- Image library | - Name phrase<br>- Add images to sequence<br>- Reorder images<br>- Set timing per image<br>- Preview sequence<br>- Save phrase<br>- Delete phrase |
| 17 | **Audio Sentences** | Create sequences of audio | - Name field<br>- Audio list builder<br>- Drag-and-drop reordering<br>- Gap duration between audio<br>- Preview playback<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse sentences<br>- Audio library | - Name sentence<br>- Add audio to sequence<br>- Reorder audio<br>- Set gaps/timing<br>- Preview sequence<br>- Save sentence<br>- Delete sentence |
| 18 | **Content Collections** | Organize content into folders | - Name field<br>- Collection type selector<br>- Content item list<br>- Drag-and-drop interface<br>- Preview area<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse collections<br>- Content browser | - Name collection<br>- Select collection type<br>- Add items<br>- Organize items<br>- Preview collection<br>- Save collection<br>- Delete collection |
| **PROGRAMS & STRUCTURE** |
| 19 | **Programs** | Create performance programs | - Name field<br>- Description<br>- Role list builder<br>- Network selector<br>- Image thumbnail<br>- Add/Remove roles<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse programs<br>- Roles list<br>- Networks list | - Name program<br>- Add description<br>- Select roles<br>- Assign network<br>- Build role list<br>- Save program<br>- Delete program |
| 20 | **Interfaces** | Design custom UI controls | - Name field<br>- Input type selector (button, dropdown, slider)<br>- Button text/color/size<br>- Folder selector (for dropdown)<br>- Preview area<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse interfaces<br>- Content folders | - Name interface<br>- Select input type<br>- Customize appearance<br>- Link to content<br>- Preview interface<br>- Save interface<br>- Delete interface |
| 21 | **Multi-roles** | Define multiple role combinations | - Name field<br>- Role selector (multi-select)<br>- Selected roles list<br>- Permissions settings<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse multi-roles<br>- Roles list | - Name multi-role<br>- Select multiple roles<br>- Set permissions<br>- Save multi-role<br>- Delete multi-role |
| 22 | **Fragments** | Create reusable content fragments | - Name field<br>- Fragment type selector<br>- Content builder<br>- Duration/timing<br>- Preview area<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse fragments | - Name fragment<br>- Build fragment content<br>- Set timing<br>- Preview fragment<br>- Save fragment<br>- Delete fragment |
| **TIMING & ALGORITHMS** |
| 23 | **Timers** | Create countdown/countup timers | - Name field<br>- Minutes field<br>- Seconds field<br>- Milliseconds field<br>- Preview timer button<br>- Image selector<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse timers | - Name timer<br>- Set time duration<br>- Select timer image<br>- Preview timer<br>- Save timer<br>- Delete timer |
| 24 | **Metronomes** | Create tempo/beat trackers | - Name field<br>- BPM (beats per minute) field<br>- Time signature selector<br>- Beat sound selector<br>- Preview button<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse metronomes | - Name metronome<br>- Set BPM<br>- Set time signature<br>- Select beat sound<br>- Preview metronome<br>- Save metronome<br>- Delete metronome |
| 25 | **Timed Organization** | Create algorithmic timing patterns | - Name field<br>- Content list<br>- Timing algorithm selector<br>- Duration settings<br>- Preview timeline<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse algorithms<br>- Content browser | - Name organization<br>- Select content items<br>- Choose algorithm<br>- Set timing parameters<br>- Preview timeline<br>- Save organization<br>- Delete organization |
| 26 | **Scheduler** | Schedule content delivery | - Name field<br>- Content selector<br>- Date/time picker<br>- Repeat settings<br>- Duration<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse schedules<br>- Calendar view | - Name schedule<br>- Select content<br>- Set date/time<br>- Configure repeats<br>- Save schedule<br>- Delete schedule |
| **USER MANAGEMENT** |
| 27 | **My Brains** | User's project dashboard | - Project list (grid/table)<br>- Project thumbnails<br>- Creation dates<br>- Edit/Delete buttons<br>- New project button<br>- Search/filter bar | - Header menu<br>- Open project<br>- Create new project<br>- Browse all brains | - View projects<br>- Open project<br>- Create new project<br>- Edit project<br>- Delete project<br>- Search projects |
| 28 | **Brains** | Browse all public projects | - Project grid<br>- Project details<br>- Owner info<br>- Like/favorite button<br>- Clone button<br>- Pagination | - Header menu<br>- View project details<br>- My Brains<br>- Next/Previous page | - Browse projects<br>- View project<br>- Clone project<br>- Like/favorite<br>- Filter/search |
| 29 | **Roles** | Define user roles | - Name field<br>- Description<br>- Permission checkboxes:<br>&nbsp;&nbsp;- Send audio<br>&nbsp;&nbsp;- Send images<br>&nbsp;&nbsp;- Send text<br>&nbsp;&nbsp;- Receive audio<br>&nbsp;&nbsp;- Receive images<br>&nbsp;&nbsp;- Receive text<br>- Color picker<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse roles | - Name role<br>- Set permissions<br>- Choose role color<br>- Save role<br>- Delete role |
| 30 | **Networks** | Define network topologies | - Name field<br>- Description<br>- Network diagram canvas<br>- Node add/remove tools<br>- Connection drawing<br>- Save/Delete buttons | - Header menu<br>- Back to create<br>- Browse networks<br>- Zoom in/out | - Name network<br>- Add nodes<br>- Connect nodes<br>- Draw topology<br>- Save network<br>- Delete network |
| 31 | **Troupes** | Manage performer groups | - Name field<br>- Member list<br>- Add member button<br>- Role assignments<br>- Group settings<br>- Save/Delete buttons | - Header menu<br>- Browse troupes<br>- Member profiles | - Name troupe<br>- Add members<br>- Assign roles<br>- Configure group<br>- Save troupe<br>- Delete troupe |
| **CREATION & BUILDING** |
| 32 | **Create** | Main creation hub | - Category list:<br>&nbsp;&nbsp;- Audio<br>&nbsp;&nbsp;- Images<br>&nbsp;&nbsp;- Text<br>&nbsp;&nbsp;- Collections<br>&nbsp;&nbsp;- Programs<br>&nbsp;&nbsp;- Timing<br>- Recent items list<br>- Quick create buttons | - Header menu<br>- Navigate to any creation view<br>- Browse existing content<br>- My Brains | - Select content type<br>- View recent items<br>- Quick create new item<br>- Browse by category |
| 33 | **Build** | Visual program builder | - Canvas/workspace<br>- Content library sidebar<br>- Drag-and-drop interface<br>- Timeline view<br>- Connection tools<br>- Save/Preview buttons | - Header menu<br>- Content library<br>- Timeline controls<br>- Zoom controls | - Drag content to canvas<br>- Connect elements<br>- Set timing<br>- Preview program<br>- Save program |
| 34 | **Module List** | Browse all modules/content | - Searchable list/grid<br>- Filter by type<br>- Sort options<br>- Pagination<br>- Thumbnails<br>- Quick actions (edit/delete) | - Header menu<br>- Filter menu<br>- Pagination<br>- Module details | - Browse modules<br>- Search modules<br>- Filter by type<br>- Sort list<br>- Edit module<br>- Delete module |
| 35 | **Module Details** | View single module details | - Module name<br>- Type/category<br>- Creation date<br>- Owner info<br>- Preview area<br>- Edit/Delete buttons<br>- Related items | - Header menu<br>- Back to list<br>- Edit module<br>- Related items | - View details<br>- Preview content<br>- Edit module<br>- Delete module<br>- View related |
| **SPECIALIZED VIEWS** |
| 36 | **Database** | Database viewer/admin | - Collection list<br>- Document viewer<br>- Search/filter tools<br>- JSON viewer<br>- Export button<br>- Query builder | - Header menu<br>- Collection selector<br>- Document navigation | - View collections<br>- Browse documents<br>- Search database<br>- Export data<br>- Run queries |
| 37 | **Test OSC** | OSC message tester | - OSC address field<br>- Parameter inputs<br>- Send button<br>- Response log<br>- Connection status<br>- Clear log button | - Header menu<br>- OSC settings | - Enter OSC address<br>- Set parameters<br>- Send OSC message<br>- View responses<br>- Test connectivity |
| 38 | **Controls** | System control panel | - Audio on/off toggle<br>- Visual effects toggle<br>- System settings<br>- Connection status<br>- Debug console | - Header menu<br>- Settings | - Toggle audio<br>- Toggle visuals<br>- Configure system<br>- View debug info |
| 39 | **Header** | Navigation header (component) | - Logo<br>- Main menu icons:<br>&nbsp;&nbsp;- ⚙️ Program<br>&nbsp;&nbsp;- 📢 Perform<br>- Audio toggle<br>- Info icon | - Program menu<br>- Perform menu<br>- Info/help<br>- Audio toggle | - Navigate to Program<br>- Navigate to Perform<br>- Toggle audio<br>- View info |
| 40 | **Performance Header 2** | Performance view header | - Performance name<br>- Participant count<br>- Role display<br>- Leave button<br>- Settings icon | - Leave performance<br>- Settings menu<br>- Help | - View performance info<br>- Leave session<br>- Access settings |
| 41 | **Paginator** | Pagination component | - Page numbers<br>- Previous/Next buttons<br>- Page size selector<br>- Total items count | - Previous page<br>- Next page<br>- Jump to page | - Navigate pages<br>- Change page size<br>- Jump to specific page |
| **LEGACY/SPECIALIZED** |
| 42 | **Phrases** | (Legacy) Text phrase creator | - Name field<br>- Text array builder<br>- Timing controls<br>- Save/Delete buttons | - Header menu<br>- Browse phrases | - Create text phrases<br>- Set timing<br>- Save/delete |
| 43 | **Schedules** | (Legacy) Schedule viewer | - Schedule list<br>- Date/time display<br>- Status indicators<br>- Edit button | - Header menu<br>- Edit schedule<br>- Calendar view | - View schedules<br>- Edit schedule<br>- View status |
| 44 | **TTSs** | (Legacy) TTS list viewer | - TTS item list<br>- Preview buttons<br>- Edit/Delete buttons<br>- Pagination | - Header menu<br>- Browse TTS<br>- Edit TTS | - Browse TTS items<br>- Preview TTS<br>- Edit/delete |
| 45 | **Fractions** | Fractional timing module | - Name field<br>- Numerator/Denominator<br>- Timing calculation display<br>- Save/Delete buttons | - Header menu<br>- Browse fractions | - Create fractions<br>- Set timing ratios<br>- Save/delete |
| 46 | **Units** | Time unit definitions | - Unit name<br>- Duration value<br>- Unit type<br>- Conversion factors<br>- Save/Delete buttons | - Header menu<br>- Browse units | - Define time units<br>- Set conversions<br>- Save/delete |

---

## View Categories Summary

### By Function
- **Core Pages**: 5 views (Home, Login, About, Instructions, Tutorial)
- **Performance**: 3 views (Performance2, Performance legacy, Perform)
- **Audio Content**: 3 views (URLs, Uploads, TTS)
- **Image Content**: 3 views (URLs, Uploads, Teleprompts)
- **Collections**: 4 views (Audio-Image Pairs, Image Phrases, Audio Sentences, Content Collections)
- **Programs**: 4 views (Programs, Interfaces, Multi-roles, Fragments)
- **Timing**: 4 views (Timers, Metronomes, Timed Organization, Scheduler)
- **User Management**: 5 views (My Brains, Brains, Roles, Networks, Troupes)
- **Creation Tools**: 3 views (Create, Build, Module List/Details)
- **System**: 6 views (Database, Test OSC, Controls, Headers, Paginator)
- **Legacy**: 6 views (Phrases, Schedules, TTSs, Fractions, Units)

### Common Elements Across Most Views
- **Navigation**: Header menu with Program (⚙️) and Perform (📢) icons
- **Form Fields**: Name, description, and type-specific inputs
- **Actions**: Save, Delete, Preview/Play buttons
- **Feedback**: Success/error alerts, validation messages

### Common Actions Across Most Views
1. **Create/Edit**: Name content, configure settings
2. **Preview**: Test/preview content before saving
3. **Save**: Store content to database
4. **Delete**: Remove content from database
5. **Navigate**: Browse related content, return to lists

---

## Key Observations

### Design Patterns
- **Backbone.js MVC**: All views extend `Backbone.View`
- **Template Rendering**: Most views use templates for HTML generation
- **Socket.IO Events**: Performance views heavily use real-time socket communication
- **Validation**: Form validation on all creation views
- **Nested Navigation**: Parent-child relationships (parent_id system)

### Unique Features
- **Performance2**: Most complex view with real-time multi-user coordination
- **Build**: Visual drag-and-drop program builder
- **Networks**: Visual network topology editor
- **OSC Test**: Hardware integration testing
- **Database**: Direct database access for admin

### Mobile Considerations
- Most views are desktop-oriented
- Would benefit from responsive redesign
- Touch-friendly controls needed for performance views

---

**Generated**: 2025-10-21
**Source**: telebrain-master repository
**Total Views Documented**: 46

