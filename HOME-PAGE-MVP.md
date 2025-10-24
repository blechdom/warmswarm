# WarmSwarm MVP - Home Page Design

## Simplest Possible Navigation

### Hero Section (Main Actions)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🐝 WarmSwarm                       │
│         Real-time group coordination            │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │                  │  │                  │   │
│  │   🎭 JOIN        │  │   🎨 CREATE      │   │
│  │                  │  │                  │   │
│  │  Enter Code      │  │  Start Swarm     │   │
│  │                  │  │                  │   │
│  └──────────────────┘  └──────────────────┘   │
│                                                 │
│           [🔧 Advanced Builder →]               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Two Primary Actions + One Secondary

### 1. 🎭 JOIN (Left Card - Participant Path)
**For:** People with an invite code
**Action:** Immediately shows input field for invite code
**Flow:** Enter code → Join → Experience

### 2. 🎨 CREATE (Right Card - Organizer Path)  
**For:** People who want to coordinate a group
**Action:** Opens template selector
**Flow:** Choose template → Configure → Share code

### 3. 🔧 Advanced Builder (Link Below)
**For:** Power users who want full control
**Action:** Small link/button below main cards
**Flow:** Full 5 C's workflow

---

## Complete MVP Home Page Layout

```
┌───────────────────────────────────────────────────────┐
│  MainMenu: [🏠 Home] [🔍 Explore] [ℹ️ About]         │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│                                                       │
│                   🐝 WarmSwarm                        │
│              Real-time group coordination             │
│           Connect. Coordinate. Collaborate.           │
│                                                       │
└───────────────────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│                     │  │                     │
│    🎭 JOIN          │  │    🎨 CREATE        │
│                     │  │                     │
│  Have an invite?    │  │  Start a new swarm  │
│  Enter your code    │  │  Choose a template  │
│                     │  │                     │
│  [Input Field   →]  │  │  [Get Started   →]  │
│                     │  │                     │
│  • Join instantly   │  │  • Pick template    │
│  • No account       │  │  • Get invite code  │
│  • Experience live  │  │  • Share with group │
│                     │  │                     │
└─────────────────────┘  └─────────────────────┘

              Need more control?
          [🔧 Advanced Builder →]
          Build custom swarms from scratch

┌───────────────────────────────────────────────────────┐
│  Footer: [GitHub] [Docs] [Privacy] [Contact]         │
└───────────────────────────────────────────────────────┘
```

---

## Navigation Logic

### Clicking "🎭 JOIN"
```javascript
// Option 1: Modal popup
Shows modal with input field
User enters code → validates → redirects to /join?code=ABC123

// Option 2: Direct navigation
Redirects to /join immediately
User enters code on dedicated page
```

### Clicking "🎨 CREATE"
```javascript
// Goes to template selection
Redirects to /create/catalogue
Shows: LIVE templates | TIMED templates
User picks one → configures → gets invite code
```

### Clicking "🔧 Advanced Builder"
```javascript
// Goes to full builder (Phase 3)
Redirects to /create/constellation
Full 5 C's workflow
For power users only
```

---

## Mobile Layout (Stacked)

```
┌─────────────────────┐
│   🐝 WarmSwarm      │
│   Group coordination│
└─────────────────────┘

┌─────────────────────┐
│    🎭 JOIN          │
│                     │
│  Have an invite?    │
│  [Enter Code    →]  │
└─────────────────────┘

┌─────────────────────┐
│    🎨 CREATE        │
│                     │
│  Start a swarm      │
│  [Get Started   →]  │
└─────────────────────┘

      [🔧 Advanced →]
```

---

## Alternative: Even Simpler (Single Input Focus)

```
┌───────────────────────────────────────┐
│                                       │
│           🐝 WarmSwarm                │
│      Real-time group coordination     │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │  Enter invite code or create... │ │
│  │  [________________] [Go]        │ │
│  └─────────────────────────────────┘ │
│                                       │
│    Don't have a code?                 │
│    [Create New Swarm]                 │
│                                       │
│    Need full control?                 │
│    [Advanced Builder]                 │
│                                       │
└───────────────────────────────────────┘
```

---

## Recommended MVP Approach

### **Use the Two-Card Design**

**Why:**
1. **Clear Separation** - Users immediately know if they're joining or creating
2. **Visual Balance** - Two equal-weight options, no hierarchy confusion
3. **Scalable** - Easy to add third card later if needed
4. **Mobile-Friendly** - Stacks naturally on small screens

**Implementation:**
```typescript
// src/app/page.tsx (Home)
<Container>
  <MainMenu />
  
  <Hero>
    <Logo>🐝 WarmSwarm</Logo>
    <Tagline>Real-time group coordination</Tagline>
    <Subtitle>Connect. Coordinate. Collaborate.</Subtitle>
  </Hero>
  
  <ActionCards>
    <Card onClick={() => router.push('/join')}>
      <Icon>🎭</Icon>
      <Title>JOIN</Title>
      <Description>Have an invite code?</Description>
      <CTA>Enter Code →</CTA>
      <Features>
        • Join instantly
        • No account needed
        • Experience live
      </Features>
    </Card>
    
    <Card onClick={() => router.push('/create/catalogue')}>
      <Icon>🎨</Icon>
      <Title>CREATE</Title>
      <Description>Start a new swarm</Description>
      <CTA>Get Started →</CTA>
      <Features>
        • Choose template
        • Get invite code
        • Share with group
      </Features>
    </Card>
  </ActionCards>
  
  <SecondaryAction>
    Need more control?
    <Link href="/create/constellation">
      🔧 Advanced Builder →
    </Link>
  </SecondaryAction>
</Container>
```

---

## User Flow from Home

### Participant (Most Common)
```
Home → Click "JOIN" → /join → Enter code → /swarm (live)
3 clicks total
```

### Organizer
```
Home → Click "CREATE" → /create/catalogue → Pick template 
→ Configure → Get code → Share
4-5 clicks total
```

### Advanced (Rare)
```
Home → Click "Advanced Builder" → /create/constellation 
→ Full 5 C's workflow
Many steps, but they expect it
```

---

## Progressive Disclosure Strategy

### First Visit
```
Show: JOIN + CREATE cards (prominent)
Show: Advanced Builder (small link)
Hide: Complex features
```

### After Using Once
```
Could add:
• "Recent Swarms" section
• "My Templates" quick access
• But not in MVP!
```

---

## Key Design Principles for MVP

1. **Two Main Paths Only**
   - JOIN (participants)
   - CREATE (organizers)
   
2. **Advanced is Hidden**
   - Small link below
   - Doesn't clutter main decision
   
3. **No Accounts Needed**
   - Both paths work immediately
   - No signup friction
   
4. **Clear Next Steps**
   - Each card tells you exactly what happens
   - No mystery about the flow

5. **Mobile First**
   - Cards stack vertically
   - Large touch targets
   - Clear tap actions

---

## What We DON'T Show on Home (MVP)

❌ Login/Signup (no accounts yet)
❌ Dashboard/Profile (not needed)
❌ Analytics/Stats (later)
❌ Multiple template categories (just "Create" is enough)
❌ Swarm history (not MVP)
❌ Search/Filter (too complex)
❌ Social features (later)

---

## Metrics to Track

### Success Metrics
- **Join Card Click Rate** - Are participants finding their way?
- **Create Card Click Rate** - Are organizers trying it?
- **Join → Swarm Conversion** - Do codes work?
- **Create → Share Conversion** - Do people finish setup?

### Failure Signals
- High bounce rate on home
- Users clicking back from /join or /create
- High Advanced Builder clicks (might mean main paths aren't clear)

---

## Next Step: Implementation

Create a new homepage that replaces current `/` with:
- Clean two-card design
- Immediate navigation to JOIN or CREATE
- Hidden Advanced link for power users
- Mobile-optimized layout
- No unnecessary content

Keep it stupid simple. Let the clarity do the work.

