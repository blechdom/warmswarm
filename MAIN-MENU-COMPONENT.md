# 🧭 MainMenu Component

## ✅ What Was Created

A **standalone, reusable navigation component** that matches the original WarmSwarm design style, specifically the look and feel of the "Back" button from the swarms page.

---

## 📂 Component Location

```
src/components/MainMenu.tsx
```

---

## 🎨 Design Features

### Style Characteristics
- **Background**: `rgba(255, 255, 255, 0.2)` (semi-transparent white)
- **Hover Effect**: `rgba(255, 255, 255, 0.3)` (slightly more opaque)
- **Border Radius**: `25px` (pill-shaped buttons)
- **Typography**: White text, medium-bold weight
- **Transitions**: Smooth `0.225s ease` animations
- **Spacing**: Clean padding (`10px 20px`)

### Matches Original Design
✅ Same styling as the "← Back" button  
✅ Consistent rounded pill shape  
✅ Semi-transparent white overlay effect  
✅ Smooth hover transitions  
✅ Professional, minimal aesthetic  

---

## 🧩 Component Structure

### Desktop View
```
[warmswarm]  Home  All Views  Create  Join  My Swarms  [Live]
```
- Logo/brand on the left (clickable home link)
- Navigation links in the center/right
- "Live" button highlighted with slightly stronger background

### Mobile View (< 768px)
```
[warmswarm]                                    [☰]
```
- Logo on the left
- Hamburger menu (☰) on the right
- Dropdown menu with all links when opened

---

## 💻 Usage

### Import and Use

```tsx
import MainMenu from '@/components/MainMenu';

export default function MyPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%)',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <MainMenu />
      
      {/* Your page content */}
    </div>
  );
}
```

### Optional Props

```tsx
<MainMenu currentPath="/about" />
```

**Props:**
- `currentPath` (optional): Current page path for highlighting active links (future feature)

---

## 📍 Where It's Used

✅ **Home Page** (`/`)  
✅ **All Views** (`/telebrain`)  
✅ **Swarms Page** (`/swarms`)  
✅ **All Placeholder Pages** (`/telebrain/*`)  

Via the `ColorfulLayout` component, which now imports and uses `MainMenu` instead of inline navigation.

---

## 🎯 Component Features

### Desktop Navigation
- Horizontal layout
- Individual pill-shaped buttons for each link
- "Live" button stands out with stronger background
- Hover effects on all links

### Mobile Navigation
- Hamburger button (☰) appears on screens < 768px
- Dropdown menu with white background
- Includes emoji icons for better visual navigation
- Closes automatically when a link is clicked
- Touch-friendly tap targets

### Responsive Behavior
```css
@media (min-width: 768px) {
  /* Desktop navigation visible */
  /* Hamburger hidden */
}

@media (max-width: 767px) {
  /* Desktop navigation hidden */
  /* Hamburger visible */
}
```

---

## �� Styled Components

The component uses **styled-components** to match the design system of the swarms page.

### Key Styled Elements

1. **MenuContainer** - Flex container for layout
2. **Logo** - Brand/home link (pill-shaped button)
3. **DesktopNav** - Horizontal menu (hidden on mobile)
4. **NavLink** - Individual navigation links
5. **HamburgerButton** - Mobile menu toggle
6. **MobileMenu** - Dropdown for mobile
7. **MobileNavLink** - Links in mobile dropdown

---

## 🔧 Customization

### To Add a New Link

1. **Desktop Menu**: Add to `DesktopNav`
```tsx
<DesktopNav>
  {/* ... existing links ... */}
  <NavLink href="/new-page">New Page</NavLink>
</DesktopNav>
```

2. **Mobile Menu**: Add to `MobileMenu`
```tsx
<MobileMenu $isOpen={mobileMenuOpen}>
  {/* ... existing links ... */}
  <MobileNavLink href="/new-page" onClick={closeMenu}>
    🆕 New Page
  </MobileNavLink>
</MobileMenu>
```

### To Highlight a Link

Use the `$isPrimary` prop:
```tsx
<NavLink href="/important" $isPrimary>Important</NavLink>
```

---

## 📱 Mobile Menu Behavior

### Opening
- Click hamburger (☰) button
- Menu appears below with slide effect
- White background with rounded corners
- Shadow for elevation

### Closing
- Click any link (auto-closes)
- Click hamburger again (toggles)
- Links styled with hover states

### Styling
- **Background**: `rgba(255, 255, 255, 0.95)` (nearly opaque white)
- **Text**: Dark gray (`#333`) for readability
- **Primary Links**: Red accent (`#ff6b6b`)
- **Icons**: Emoji for visual clarity

---

## 🌈 Visual Comparison

### Before (Old Navigation)
```
❌ Inline navigation in each component
❌ Inconsistent styling across pages
❌ Different layouts for desktop/mobile
❌ Text-based navigation
```

### After (MainMenu Component)
```
✅ Single reusable component
✅ Consistent pill-shaped buttons everywhere
✅ Matches "Back" button aesthetic perfectly
✅ Unified responsive behavior
✅ Easy to maintain and update
```

---

## 🎯 Design Philosophy

### Matches Original WarmSwarm Style
1. **Semi-transparent white** overlays on gradient
2. **Pill-shaped buttons** with generous border radius
3. **Smooth hover effects** that increase opacity
4. **Clean, minimal** design language
5. **Professional appearance** with playful gradient background

### Inspired by Swarms Page
The MainMenu component specifically replicates the styling of the "Back" button (`← Back`) that appears in the top-left of the swarms page:

```css
background: rgba(255, 255, 255, 0.2);
color: white;
padding: 10px 20px;
border-radius: 25px;
transition: all 0.225s ease;

&:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

---

## 📊 Integration with ColorfulLayout

The `ColorfulLayout` component now uses `MainMenu`:

```tsx
// src/components/ColorfulLayout.tsx

import MainMenu from './MainMenu';

export default function ColorfulLayout({ children }) {
  return (
    <div style={{
      background: 'gradient...',
      padding: '20px'
    }}>
      <MainMenu />
      <main>{children}</main>
    </div>
  );
}
```

This means **all pages using ColorfulLayout automatically get the MainMenu**.

---

## 🚀 Benefits

### For Users
✅ Consistent navigation across all pages  
✅ Easy to find and use  
✅ Mobile-friendly responsive design  
✅ Fast, smooth interactions  

### For Developers
✅ Single source of truth for navigation  
✅ Easy to add/remove links  
✅ Matches design system perfectly  
✅ Reusable across entire app  
✅ Type-safe with TypeScript  

---

## 🔍 Technical Details

### Technology Stack
- **React** (Client Component)
- **TypeScript** (Type safety)
- **styled-components** (CSS-in-JS)
- **Next.js** (Routing with Link component)

### State Management
- Uses `useState` for mobile menu toggle
- Closes menu automatically on navigation
- No external state dependencies

### Performance
- Lightweight component (~150 lines)
- No heavy dependencies
- Efficient re-renders
- CSS animations (GPU-accelerated)

---

## 📸 Visual Reference

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [warmswarm]  Home  All Views  Create  Join  My Swarms [Live]│
│                                                              │
│                    Page Content                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Menu Closed)
```
┌──────────────────────────┐
│ [warmswarm]          [☰] │
│                           │
│     Page Content          │
│                           │
└──────────────────────────┘
```

### Mobile Layout (Menu Open)
```
┌──────────────────────────┐
│ [warmswarm]          [☰] │
│    ┌─────────────────┐   │
│    │ 🏠 Home         │   │
│    │ �� All Views    │   │
│    │ ⚙️ Create       │   │
│    │ 🔑 Join         │   │
│    │ 🕸️ My Swarms    │   │
│    │ 📢 Live         │   │
│    └─────────────────┘   │
│                           │
│     Page Content          │
└──────────────────────────┘
```

---

## ✨ Future Enhancements

### Potential Improvements
1. **Active Link Highlighting** - Highlight current page in menu
2. **User Avatar/Profile** - Add user info to right side
3. **Notifications Badge** - Show unread count on links
4. **Search Bar** - Quick search in navigation
5. **Dropdown Submenus** - Nested navigation options

---

## 📝 Code Example

Full usage example:

```tsx
'use client';

import MainMenu from '@/components/MainMenu';

export default function MyPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%)',
      padding: '20px',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Navigation Menu */}
      <MainMenu />
      
      {/* Page Content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        marginTop: '20px'
      }}>
        <h1>My Page</h1>
        <p>Content goes here...</p>
      </div>
    </div>
  );
}
```

---

**Last Updated**: 2025-10-21  
**Component Version**: 1.0  
**Design System**: WarmSwarm Original Style  
