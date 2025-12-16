# Formatho Brand Guidelines

## Brand Overview

**Name:** Formatho  
**Tagline:** Privacy-First Developer Tools  
**Mission:** Provide essential developer tools that run 100% client-side, ensuring complete data privacy and security.

---

## Brand Identity

### Logo & Icon

**Primary Logo:**

- Binary-themed icon featuring "01" (top row) and "10" (bottom row)
- Monospace font, bold weight
- White text on black background
- Square format (optimized for 32x32px to 512x512px)

**Logo Files:**

- `/public/logo.png` - Sidebar logo
- `/public/favicon.png` - Browser favicon
- Binary icon assets in artifacts directory

**Icon Usage:**

- Always maintain square aspect ratio
- Minimum size: 16x16px (favicon)
- Recommended sizes: 32px, 64px, 128px, 256px, 512px
- Do not distort, rotate, or add effects
- Maintain clear space around logo (minimum 8px padding)

**Collapsed State:**

- Icon only (no text)
- 32x32px (h-8 w-8 in Tailwind)

**Expanded State:**

- Icon + "Formatho" text
- Icon: 32x32px
- Text: 18px (text-lg), bold, white

---

## Color Palette

### Primary Colors

**Background Colors:**

```
Dark Background:     #0f172a (slate-950) - Main background
Card Background:     #1e293b (slate-800) - Card/panel background
Muted Background:    #334155 (slate-700) - Muted elements
```

**Text Colors:**

```
Primary Text:        #f8fafc (slate-50)  - Main text
Muted Text:          #94a3b8 (slate-400) - Secondary text
Foreground:          #e2e8f0 (slate-200) - Standard foreground
```

**Accent Colors:**

```
Primary:             #f8fafc (slate-50)  - Primary actions
Secondary:           #334155 (slate-700) - Secondary actions
Border:              #334155 (slate-700) - Borders and dividers
```

### Semantic Colors

**Status Colors:**

```
Success (Valid):     #22c55e (green-500)
Error (Invalid):     #ef4444 (red-500)
Warning:             #f59e0b (amber-500)
Info:                #3b82f6 (blue-500)
```

**Interactive States:**

```
Hover:               rgba(255, 255, 255, 0.1) - Subtle white overlay
Active:              #1e293b (slate-800)
Focus Ring:          #94a3b8 (slate-400)
Disabled:            opacity: 0.5
```

### CSS Variables (Shadcn Theme)

**Light Mode:**

```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96.1%;
--muted: 210 40% 96.1%;
--border: 214.3 31.8% 91.4%;
```

**Dark Mode (Primary):**

```css
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 210 40% 98%;
--secondary: 217.2 32.6% 17.5%;
--muted: 217.2 32.6% 17.5%;
--border: 217.2 32.6% 17.5%;
```

---

## Typography

### Font Families

**Primary Font:**

```
System Font Stack:
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
"Helvetica Neue", Arial, sans-serif
```

**Monospace Font (Code):**

```
"SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
Consolas, "Courier New", monospace
```

### Font Sizes

```
Heading 1:    text-3xl (30px)  - Page titles
Heading 2:    text-2xl (24px)  - Section headers
Heading 3:    text-xl (20px)   - Subsections
Body Large:   text-lg (18px)   - Sidebar brand
Body:         text-base (16px) - Default text
Small:        text-sm (14px)   - Labels, captions
Extra Small:  text-xs (12px)   - Metadata, badges
```

### Font Weights

```
Bold:         font-bold (700)   - Headings, emphasis
Semibold:     font-semibold (600) - Subheadings
Medium:       font-medium (500)  - Card titles
Regular:      font-normal (400)  - Body text
```

---

## UI Components

### Buttons

**Primary Button:**

```
Background: bg-primary
Text: text-primary-foreground
Hover: hover:bg-primary/90
```

**Secondary Button:**

```
Background: bg-secondary
Text: text-secondary-foreground
Hover: hover:bg-secondary/80
```

**Ghost Button:**

```
Background: transparent
Text: text-foreground
Hover: hover:bg-muted
```

**Outline Button:**

```
Border: border border-border
Background: transparent
Hover: hover:bg-muted
```

**Sizes:**

```
Small:   size="sm"  - 32px height
Default: size="md"  - 40px height
Large:   size="lg"  - 48px height
Icon:    size="icon" - 40x40px square
```

### Cards

```
Background: bg-card
Border: border border-border
Radius: rounded-lg (8px)
Padding: p-4 or p-6
Shadow: None (flat design)
```

### Inputs & Textareas

```
Background: bg-background
Border: border border-input
Focus: ring-2 ring-ring
Radius: rounded-md (6px)
Font: font-mono (for code inputs)
```

### Scrollbars

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

---

## Layout & Spacing

### Sidebar

**Collapsed State:**

```
Width: 64px (w-16)
Icon Size: 32px (h-8 w-8)
Padding: p-4
```

**Expanded State:**

```
Width: 256px (w-64)
Padding: p-4
Gap: gap-2 (8px between items)
```

**Navigation Items:**

```
Padding: px-2 py-1.5
Border Radius: rounded-md
Active State: bg-secondary
Hover State: hover:bg-muted
```

### Content Area

```
Padding: p-4 (16px)
Gap: gap-4 (16px)
Background: bg-muted/30
```

### Grid Layouts

```
Two-Column: grid grid-cols-1 md:grid-cols-2 gap-4
Responsive: Mobile stacks, Desktop side-by-side
```

---

## Brand Voice & Messaging

### Tone

- **Professional** yet approachable
- **Technical** but not intimidating
- **Privacy-focused** and trustworthy
- **Helpful** and educational

### Key Messages

1. **Privacy First:** "Your data never leaves your device"
2. **Client-Side Processing:** "100% browser-based tools"
3. **Developer-Focused:** "Essential tools for developers"
4. **Open & Transparent:** "Open source and community-driven"

### Writing Style

- Use active voice
- Keep sentences concise
- Explain technical concepts clearly
- Emphasize security and privacy benefits
- Use bullet points for clarity
- Include code examples where relevant

---

## Social Media

### Twitter (@heyformatho)

**Profile Photo:**

- Binary icon (01/10)
- 400x400px
- Black background, white text

**Header Image:**

- 1500x500px
- Black background
- "Formatho" text on left
- "Privacy-First Developer Tools" subtitle
- Floating tool icons on right (white line art)

**Bio Template:**

```
Privacy-first developer tools 🔒
100% client-side processing
JSON, YAML, Base64, JWT & more
Your data stays with you 🛡️
formatho.com
```

### GitHub

**Repository:** github.com/nnn-gif/tools

**Description:**

```
Privacy-first developer tools - All processing happens client-side in your browser
```

---

## File Locations

### Assets

```
/public/logo.png          - Sidebar logo (binary icon)
/public/favicon.png       - Browser favicon (binary icon)
/public/CNAME             - Custom domain configuration
```

### Styles

```
/src/style.css            - Global styles, Shadcn theme, scrollbar
```

### Components

```
/src/layouts/AppLayout.vue - Main layout with sidebar
/src/components/ui/        - Shadcn UI components
```

---

## Technical Specifications

### Framework & Tools

```
Framework:     Vue 3 (Composition API)
Build Tool:    Vite
CSS:           Tailwind CSS 3
UI Library:    Shadcn Vue
Icons:         Lucide Vue Next
Routing:       Vue Router
```

### Browser Support

```
Chrome:  Last 2 versions
Firefox: Last 2 versions
Safari:  Last 2 versions
Edge:    Last 2 versions
```

### Performance

```
Bundle Size:   ~1.08 MB (gzipped: ~337 KB)
Lighthouse:    Target 90+ for all metrics
Load Time:     < 2 seconds on 3G
```

---

## Brand Don'ts

❌ Don't use gradients on the logo  
❌ Don't change the binary numbers (01/10)  
❌ Don't use colors other than black/white for the icon  
❌ Don't add drop shadows or effects to the logo  
❌ Don't rotate or skew the logo  
❌ Don't use light mode as primary (dark mode is brand identity)  
❌ Don't claim server-side processing  
❌ Don't collect user data

---

## Contact & Support

**Website:** formatho.com  
**Twitter:** @heyformatho  
**GitHub:** github.com/nnn-gif/tools  
**Issues:** github.com/nnn-gif/tools/issues

---

_Last Updated: December 16, 2024_  
_Version: 1.0_
