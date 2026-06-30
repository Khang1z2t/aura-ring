# Aurora Ring — Design System
> Project: `aura-ring` | Brand: Aurora | Direction: Living Organism

Read `architecture.md` for folder structure, routing, and component rules.

---

## 1. Project Identity

| Key | Value |
|---|---|
| Project name | `aura-ring` |
| Brand name | Aurora |
| Product line | Aura Ring (4 models: Air, Pro, Elite, Obsidian) |
| Design direction | Living Organism — warm, organic energy; not cold tech |
| Default theme | Dark (light mode fully supported) |
| Signature element | Ember glow — `#FF6B35` accent, never seen in health tech |

---

## 2. Color Tokens

### 2.1 Raw Palette (never use these directly in components — use semantic tokens below)

```
/* ── Dark mode foundation ── */
--raw-void:        #0D0D12;   /* near-black with purple undertone */
--raw-surface:     #15151E;   /* dark section surface */
--raw-card:        #1E1E2C;   /* dark card background */
--raw-border-dark: #2A2A38;   /* subtle dark border */

/* ── Brand accents ── */
--raw-ember:       #FF6B35;   /* primary accent — warm orange-red */
--raw-amber:       #FFB347;   /* secondary accent — warm amber */

/* ── Product tier colors ── */
--raw-gold:        #C8A96A;   /* champagne titanium for Elite */
--raw-platinum:    #E0E0E8;   /* platinum/silver for Pro */
--raw-obsidian:    #3A3A4A;   /* dark titanium for Obsidian */
--raw-air:         #D4C5B0;   /* rose/champagne titanium for Air */

/* ── Dark mode text ── */
--raw-ivory:       #F0EEE8;   /* primary text on dark */
--raw-dusk:        #8B8A9F;   /* muted text on dark */

/* ── Light mode foundation — warm premium, not pure white ── */
--raw-warm-white:  #F3EFE8;   /* light page background */
--raw-warm-surface:#FAF7F1;   /* light section surface */
--raw-warm-card:   #FFFDF8;   /* light card background */
--raw-deep:        #211D1A;   /* warm dark text */
--raw-muted-light: #746B62;   /* muted text on light */
--raw-border-lgt:  #DDD4C8;   /* soft warm border */
--raw-border-strong-lgt: #C9BDAF;
```

### 2.2 Semantic Tokens — Dark Mode
```
/* ── Backgrounds ── */
--background:          #0D0D12;   /* page canvas */
--surface:             #15151E;   /* section backgrounds */
--card:                #1E1E2C;   /* product cards, panels */
--card-hover:          #252535;   /* card on hover */
--popover:             #1E1E2C;

/* ── Borders ── */
--border:              #2A2A38;   /* default hairline */
--border-strong:       #3A3A4E;   /* emphasized border */
--input:               #2A2A38;

/* ── Text ── */
--foreground:          #F0EEE8;   /* primary text */
--muted-foreground:    #8B8A9F;   /* secondary / muted text */
--card-foreground:     #F0EEE8;

/* ── Accent 1 — Ember ── */
--primary:             #FF6B35;
--primary-foreground:  #FFFFFF;
--primary-hover:       #FF8555;
--primary-muted:       rgba(255, 107, 53, 0.12);
--primary-glow:        rgba(255, 107, 53, 0.25);

/* ── Accent 2 — Amber ── */
--secondary:           #FFB347;
--secondary-foreground:#1A1A00;
--secondary-hover:     #FFC060;
--secondary-muted:     rgba(255, 179, 71, 0.12);

/* ── Ring tier colors — product display only ── */
--ring-gold:           #C8A96A;   /* Elite — champagne titanium */
--ring-platinum:       #E0E0E8;   /* Pro — platinum silver */
--ring-obsidian:       #3A3A4A;   /* Obsidian — dark titanium */
--ring-air:            #D4C5B0;   /* Air — rose/champagne titanium */

/* ── Feedback ── */
--destructive:         #E05252;
--destructive-foreground: #FFFFFF;
--success:             #4CAF82;
--warning:             #FFB347;

/* ── Misc ── */
--radius:              0.5rem;
--ring:                #FF6B35;
```
### 2.3 Semantic Tokens — Light Mode

Override under `.light` or `:root` when theme = light.
/* ── Backgrounds ── */
--background:          #F3EFE8;  
--surface:             #FAF7F1;  
--card:                #FFFDF8; 
--card-hover:          #F0EAE2;
--popover:             #FFFDF8;

/* ── Borders ── */
--border:              #DDD4C8;
--border-strong:       #C9BDAF;
--input:               #DDD4C8;

/* ── Text ── */
--foreground:          #211D1A;  
--muted-foreground:    #746B62;
--card-foreground:     #211D1A;

/* ── Accent 1 — Ember ── */
--primary:             #C94F1D;  
--primary-foreground:  #FFFFFF;
--primary-hover:       #DD6330;
--primary-muted:       rgba(201, 79, 29, 0.08);
--primary-glow:        rgba(201, 79, 29, 0.16);

/* ── Accent 2 — Amber ── */
--secondary:           #B87516;  
--secondary-foreground:#FFFFFF;
--secondary-hover:     #C98520;
--secondary-muted:     rgba(184, 117, 22, 0.10);

/* ── Feedback ── */
--destructive:         #B84235;
--success:             #2F8F5B;
--warning:             #B87516;

### 2.4 globals.css Setup

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Register custom colors into Tailwind v4 */
  --color-ember:     #FF6B35;
  --color-amber:     #FFB347;
  --color-gold:      #C9A84C;
  --color-platinum:  #E0E0E8;
  --color-void:      #0D0D12;
  --color-ivory:     #F0EEE8;
  --color-dusk:      #8B8A9F;

  /* Font families */
  --font-display: 'Sora', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Spacing extensions */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
}

/* shadcn CSS var mapping — dark (default) */
:root {
  --background: 13 13 18;         /* #0D0D12 in HSL-ish for shadcn */
  --foreground: 240 236 232;
  --primary: 22 100% 60%;         /* #FF6B35 */
  --primary-foreground: 0 0% 100%;
  --secondary: 36 100% 71%;       /* #FFB347 */
  --secondary-foreground: 40 100% 5%;
  --card: 30 27 44;
  --card-foreground: 240 236 232;
  --border: 42 42 56;
  --input: 42 42 56;
  --ring: 22 100% 60%;
  --radius: 0.5rem;
  --muted: 21 21 30;
  --muted-foreground: 139 138 159;
  --accent: 21 21 30;
  --accent-foreground: 240 236 232;
  --popover: 30 27 44;
  --popover-foreground: 240 236 232;
  --destructive: 0 68% 60%;
  --destructive-foreground: 0 0% 100%;
}

.light {
  --background: 249 248 245;
  --foreground: 26 26 40;
  --primary: 16 82% 52%;          /* #E85A22 */
  --primary-foreground: 0 0% 100%;
  --card: 255 255 255;
  --border: 226 224 218;
  --muted: 244 243 240;
  --muted-foreground: 107 107 126;
}
```

> **Note for agent:** shadcn expects CSS vars as space-separated RGB channels, not hex. The values above follow that convention. Double-check with `shadcn/ui` docs if format changes.

---

## 3. Typography

### 3.1 Font Stack

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display | Sora | 600, 700 | Hero headline, section titles |
| Body | DM Sans | 400, 500 | All body copy, UI labels |
| Mono | JetBrains Mono | 400 | Specs table, data readouts, price |

### 3.2 Load via next/font

```typescript
// src/app/layout.tsx
import { Sora, DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

// JetBrains Mono — use variable font from Google
import { JetBrains_Mono } from 'next/font/google'
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})
```

### 3.3 Type Scale

```
--text-xs:   0.75rem  / 12px   — captions, badges
--text-sm:   0.875rem / 14px   — helper text, labels
--text-base: 1rem     / 16px   — body default
--text-lg:   1.125rem / 18px   — lead paragraph
--text-xl:   1.25rem  / 20px   — card titles
--text-2xl:  1.5rem   / 24px   — section subtitles
--text-3xl:  1.875rem / 30px   — section headings
--text-4xl:  2.25rem  / 36px   — large headings
--text-5xl:  3rem     / 48px   — hero subheading
--text-6xl:  3.75rem  / 60px   — hero heading desktop
--text-7xl:  4.5rem   / 72px   — hero heading large screen
```

### 3.4 Typography Rules

- Hero headline: Sora 700, `text-5xl md:text-6xl lg:text-7xl`, tracking `-0.03em`
- Section titles: Sora 600, `text-3xl md:text-4xl`, tracking `-0.02em`
- Body: DM Sans 400, `text-base`, `leading-7` (1.75)
- Price display: JetBrains Mono 400, `text-3xl`, `--foreground`
- Spec values: JetBrains Mono 400, `text-sm`, `--muted-foreground`
- Badge/label: DM Sans 500, `text-xs`, `uppercase`, `tracking-widest`
- Never use font-weight 300 — too thin on dark background
- Never mix display font in body paragraphs

---

## 4. Spacing Scale

Use Tailwind's default spacing + these custom values. Section padding is the most important.

```
Section vertical padding:   py-20 md:py-28 lg:py-36
Section horizontal padding: px-4 md:px-8 lg:px-0 (inside max-w container)
Container max width:        max-w-7xl mx-auto
Card padding:               p-5 md:p-6
Card gap in grid:           gap-4 md:gap-6
Component internal gap:     gap-3 (tight), gap-4 (default), gap-6 (loose)
```

---

## 5. Border Radius

```
--radius-sm:   0.25rem   / 4px    — badges, tags, small chips
--radius:      0.5rem    / 8px    — buttons, inputs (shadcn default)
--radius-md:   0.75rem   / 12px   — cards, panels
--radius-lg:   1rem      / 16px   — large cards, modals
--radius-xl:   1.5rem    / 24px   — hero feature blocks
--radius-full: 9999px             — pills, avatar circles
```

Tailwind classes: `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`

---

## 6. Shadows & Glow

Dark mode shadows are glow-based, not drop-shadow.

```css
/* Card default */
--shadow-card: 0 0 0 1px var(--border);

/* Card hover — ember glow */
--shadow-card-hover: 0 0 0 1px var(--border-strong),
                     0 0 24px rgba(255, 107, 53, 0.15);

/* Primary button glow */
--shadow-btn-primary: 0 0 20px rgba(255, 107, 53, 0.35);

/* Focus ring */
--shadow-focus: 0 0 0 2px var(--background),
                0 0 0 4px var(--primary);

/* Hero ring product glow (GSAP animates opacity) */
--shadow-product: 0 0 80px rgba(255, 107, 53, 0.20),
                  0 0 160px rgba(255, 179, 71, 0.10);
```

Light mode: replace glow shadows with standard drop shadows.
```css
--shadow-card-hover: 0 4px 24px rgba(0, 0, 0, 0.10);
--shadow-btn-primary: 0 4px 14px rgba(232, 90, 34, 0.30);
```

---

## 7. Gradient Recipes

```css
/* Hero background nebula — subtle, behind product image */
--gradient-hero: radial-gradient(
  ellipse 80% 60% at 50% 40%,
  rgba(255, 107, 53, 0.08) 0%,
  rgba(255, 179, 71, 0.04) 40%,
  transparent 70%
);

/* Ember gradient — used on primary CTA button, badge pill */
--gradient-ember: linear-gradient(135deg, #FF6B35 0%, #FFB347 100%);

/* Gold gradient — Elite ring model badge */
--gradient-gold: linear-gradient(135deg, #C9A84C 0%, #E8D08A 50%, #C9A84C 100%);

/* Section fade — bottom of sections for seamless bleed */
--gradient-fade-down: linear-gradient(to bottom, transparent, var(--background));

/* Text gradient — hero headline accent word */
--gradient-text: linear-gradient(90deg, #FF6B35 0%, #FFB347 60%, #FF6B35 100%);
/* Usage: background-clip: text; -webkit-text-fill-color: transparent; */
```

---

## 8. Animation Tokens

### 8.1 Shared Framer Motion Variants
Define in `src/config/animations.ts`

```typescript
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Drawer / modal
export const drawerVariants = {
  closed: { x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  open:   { x: 0,      transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }
}

// Chatbot widget pop
export const chatbotVariants = {
  hidden:  { opacity: 0, scale: 0.85, y: 16 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }
}
```

### 8.2 GSAP Defaults
Define in `src/config/animations.ts`

```typescript
export const gsapDefaults = {
  ease: 'power3.out',
  duration: 0.8,
}

export const gsapScrollDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
}
```

### 8.3 Timing Reference

| Action | Duration | Easing |
|---|---|---|
| Button hover | 150ms | ease-out |
| Card hover | 200ms | ease-out |
| Section reveal (Framer) | 500ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Hero timeline (GSAP) | 1000ms | power3.out |
| Drawer open | 350ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Modal open | 300ms | ease-out |
| Page transition | 400ms | ease-in-out |

### 8.4 Reduced Motion

Always respect `prefers-reduced-motion`. Wrap GSAP and Framer logic:

```typescript
// In useGSAPTimeline.ts
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) return // skip animation, show final state

// In Framer variants — add to transition:
transition: { duration: prefersReduced ? 0 : 0.5, ... }
```

---

## 9. Component Visual Specs

### 9.1 Buttons

```
Primary (Ember gradient):
  background:    linear-gradient(135deg, #FF6B35, #FFB347)
  text:          #FFFFFF, DM Sans 500, text-sm
  padding:       px-6 py-2.5
  radius:        rounded (8px)
  hover:         brightness(1.08), shadow-btn-primary
  active:        scale(0.97)
  transition:    150ms ease-out

Secondary (ghost):
  background:    transparent
  border:        1px solid var(--border-strong)
  text:          var(--foreground), DM Sans 500, text-sm
  hover:         border-color var(--primary), text var(--primary)
  transition:    150ms ease-out

Icon button (cart, wishlist):
  size:          40x40px
  radius:        rounded-md
  background:    var(--card)
  border:        1px solid var(--border)
  hover:         border var(--primary-muted), background var(--primary-muted)
```

### 9.2 Product Cards

```
Dark mode:
  background:    var(--card)          // #1E1E2C
  border:        1px solid var(--border)
  radius:        rounded-xl (12px)
  padding:       p-5
  hover:         border var(--border-strong), shadow-card-hover (ember glow)
  transition:    200ms ease-out

Image area:
  aspect-ratio:  1:1
  background:    #15151E
  radius:        rounded-lg (8px)
  overflow:      hidden

Badge (NEW / BESTSELLER / LIMITED):
  position:      absolute top-3 left-3
  background:    var(--primary-muted)
  color:         var(--primary)
  font:          DM Sans 500, text-xs, uppercase, tracking-widest
  padding:       px-2.5 py-1
  radius:        rounded-sm (4px)

Price:
  font:          JetBrains Mono 400, text-2xl, var(--foreground)
  originalPrice: text-sm, line-through, var(--muted-foreground)
```

### 9.3 Specs Table

```
Layout:          2-column grid (label | value)
Label:           DM Sans 400, text-sm, var(--muted-foreground)
Value:           JetBrains Mono 400, text-sm, var(--foreground)
Row separator:   1px solid var(--border)
Row padding:     py-3
Even rows bg:    transparent (no zebra stripe)
Section header:  DM Sans 500, text-xs, uppercase, tracking-widest,
                 var(--primary), mt-6 mb-2
```

### 9.4 Navbar

```
Background:      backdrop-blur-md, bg-background/80
border-bottom:   1px solid var(--border) — appears on scroll
height:          64px
logo:            Sora 700, text-lg, var(--foreground)
nav links:       DM Sans 500, text-sm, var(--muted-foreground)
nav link hover:  var(--foreground)
active link:     var(--primary)
CTA button:      Primary button, compact (px-4 py-2)
cart icon:       Icon button with item count badge (ember bg)
position:        sticky top-0 z-50
```

### 9.5 Hero Section

```
Height:          min-h-screen
Layout:          centered, text above product image on mobile
                 split 50/50 on lg: text left, product right
Background:      var(--background) + gradient-hero overlay
Eyebrow label:   DM Sans 500, text-xs, uppercase, tracking-widest,
                 var(--primary), mb-4
Headline:        Sora 700, text-5xl→text-7xl, var(--foreground)
                 one word in gradient-text (ember)
Subheading:      DM Sans 400, text-lg→text-xl, var(--muted-foreground), max-w-lg
CTA row:         gap-4, Primary button + Secondary button
Product image:   GSAP animated — subtle float + rotation on scroll
                 shadow-product glow underneath
Scroll indicator: animated chevron-down, position absolute bottom-8
```

### 9.6 Chatbot Widget

```
Trigger button:
  position:      fixed bottom-6 right-6 z-50
  size:          56x56px
  radius:        rounded-full
  background:    gradient-ember
  icon:          MessageCircle (Lucide), 24px, white
  shadow:        shadow-btn-primary
  hover:         scale(1.05)

Chat window:
  position:      fixed bottom-24 right-6 z-50
  size:          w-80 md:w-96, h-[480px]
  background:    var(--card)
  border:        1px solid var(--border-strong)
  radius:        rounded-xl
  animation:     chatbotVariants (Framer)

Header:
  background:    gradient-ember
  padding:       px-4 py-3
  title:         DM Sans 500, text-sm, white — "Aurora Assistant"
  subtitle:      text-xs, white/70 — "Powered by Gemini AI"

Messages:
  user bubble:   background var(--primary-muted), border var(--primary-muted)
                 text var(--foreground), radius rounded-xl rounded-br-sm
  ai bubble:     background var(--surface), border var(--border)
                 text var(--foreground), radius rounded-xl rounded-bl-sm
  font:          DM Sans 400, text-sm, leading-6

Input area:
  border-top:    1px solid var(--border)
  input:         shadcn Input, bg var(--background)
  send button:   Icon button with ember background
```

---

## 10. Section Layout Map

Order of sections in `app/page.tsx`:

```
1. <Navbar />                  — sticky, z-50
2. <HeroSection />             — min-h-screen, GSAP + parallax
3. <FeaturesSection />         — 3-col grid, Framer stagger reveal
4. <ProductsSection />         — 4 product cards, filterable by color
5. <SpecsSection />            — tabbed by model, GSAP counter animation
6. <TestimonialsSection />     — horizontal scroll or grid
7. <RecentlyViewed />          — shows if store has items
8. <SubscribeSection />        — full-width, ember gradient bg
9. <Footer />
10. <CartDrawer />             — Framer slide-in from right
11. <ChatbotWidget />          — fixed bottom-right
```

---

## 11. Dark / Light Mode Switch

- Default: dark — `<html class="dark">`
- Toggle: `useThemeStore` sets class on `document.documentElement`
- Tailwind config: `darkMode: 'class'`
- Transition on switch: `transition-colors duration-300` on `<body>`
- ThemeToggle component: Sun/Moon icons (Lucide), icon button style
- Never flash: use `suppressHydrationWarning` on `<html>` + inline script to read localStorage before paint

```html
<!-- In layout.tsx <head> — prevents flash -->
<script dangerouslySetInnerHTML={{__html: `
  (function(){
    const t = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(t);
  })()
`}} />
```

---

## 12. Responsive Breakpoints

```
Mobile:   < 640px   — single column, stacked layout
sm:       640px     — minor adjustments
md:       768px     — 2-column grids begin
lg:       1024px    — hero split layout, 3-col product grid
xl:       1280px    — max content width reached
2xl:      1536px    — no layout change, just more breathing room
```

Key responsive rules:
- Product grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Features grid: `grid-cols-1 md:grid-cols-3`
- Hero: `flex-col lg:flex-row`
- Chatbot: full-width on mobile (`w-[calc(100vw-3rem)]`), fixed width on md+
- Navbar: hamburger menu on mobile, horizontal links on lg+

---

## 13. Accessibility

- All interactive elements have visible focus rings (`--shadow-focus`)
- Color is never the only indicator (badges also have text)
- `aria-label` on all icon-only buttons (cart, wishlist, theme toggle)
- Reduced motion respected everywhere (see section 8.4)
- Contrast ratios:
  - Ember `#FF6B35` on `#0D0D12` → passes AA for large text, use carefully for small
  - Ivory `#F0EEE8` on `#0D0D12` → passes AAA ✓
  - Muted `#8B8A9F` on `#0D0D12` → passes AA ✓
  - Light mode ember `#E85A22` on `#F9F8F5` → passes AA ✓

---

## 14. Quick Reference — Tailwind Class Mappings

| Token | Tailwind class |
|---|---|
| Primary accent | `text-ember` / `bg-ember` |
| Secondary accent | `text-amber` / `bg-amber` |
| Page bg | `bg-background` |
| Card bg | `bg-card` |
| Body text | `text-foreground` |
| Muted text | `text-muted-foreground` |
| Border | `border-border` |
| Display font | `font-display` |
| Body font | `font-body` |
| Mono font | `font-mono` |
| Ember gradient btn | `bg-gradient-to-br from-ember to-amber` |
| Hero text gradient | `bg-gradient-to-r from-ember via-amber to-ember bg-clip-text text-transparent` |

---

> **For project structure, routing, component rules, and state management — read `architecture.md`.**

---

## 15. Hero Section — Detailed Spec

### Layout
```
Desktop (lg+): 2-col split 50/50
  Left:  eyebrow → headline → sub → CTA row → stats bar
  Right: ring product image (GSAP animated)

Mobile (<lg):  1-col stacked, centered
  Top:   ring image (smaller)
  Below: eyebrow → headline → sub → single primary CTA → stats row
```

### Left col content order
```
1. Eyebrow row
   - Badge: "New · 2025" — ember bg (--primary-muted), ember text, text-xs uppercase tracking-widest
   - Chip: "Helicorp Ring" — ghost border, muted text

2. Headline — Sora 700
   Line 1: "Health."  → color: --foreground (ivory)
   Line 2: "On Your Finger." → gradient-text (ember→amber)
   Size: text-5xl md:text-6xl lg:text-7xl, tracking -0.03em

3. Subheading — DM Sans 400, text-lg, --muted-foreground, max-w-lg, leading-7
   "Track sleep, heart rate, SpO₂, stress — all day, all night.
    No screen. No distraction. Just data that matters."

4. CTA row — flex gap-4
   Primary: "Shop Rings" — gradient-ember button, shadow-btn-primary
   Ghost:   "See Features ↓" — border --border-strong, hover ember

5. Stats bar — border-top --border, pt-4, flex gap-8
   Values: JetBrains Mono 400, text-2xl, --foreground
   Labels: DM Sans 400, text-xs, --muted-foreground
   Items: "7 days / Battery life" · "150m / Water resist" · "12+ / Health metrics"
```

### Right col — ring image
```
- next/image with priority={true} (LCP element — never lazy load)
- Size: 480x480 desktop, 280x280 mobile
- No bg — image has transparent bg (PNG or WebP with alpha)
- GSAP float loop: gsap.to(".js-hero-ring", { y: -8, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 })
- Ember glow: absolute div behind image, border-radius full
  background: radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)
  GSAP pulse: opacity 0.4→1, duration 2s, yoyo repeat
- Parallax on scroll: GSAP ScrollTrigger, y moves at 0.4x scroll speed
```

### Background
```
- Base: --background (#0D0D12)
- Nebula overlay: radial-gradient ellipse 80% 60% at 50% 40%
  rgba(255,107,53,0.08) → rgba(255,179,71,0.04) → transparent
- Pure CSS — no canvas, no WebGL
- class="js-hero-bg" for GSAP opacity control
```

### Scroll indicator
```
- position: absolute bottom-8 left-1/2 -translate-x-1/2
- "scroll" text + ChevronDown icon (Lucide), text-xs --muted-foreground
- Framer Motion: animate y 0→6px loop, duration 1.2s
- useEffect: fade out when window.scrollY > 100
```

---

## 16. Hero Scrollytelling — GSAP ScrollTrigger

Hero section is **pinned** while user scrolls through 3 acts. Total scroll distance = 300vh.

```
Total section height: 300vh (pin for 3 acts)
GSAP ScrollTrigger pin: ".js-hero-section", scrub: 1
```

### Act 1 — Entry (0vh → 0vh, on load, no scroll)
```
- All left-col text fades + slides up via Framer Motion (whileInView, once)
- Ring image fades in, float loop starts
- Glow pulse starts
- Scroll indicator appears
```

### Act 2 — Ring focus (scroll 0 → 150vh)
```
Trigger: scrollY enters act 2 zone

Left col:
  - Text block fades out (opacity 1→0, y 0→-40px)
  - Stats bar fades out
  - 3 floating metric cards fade IN around the ring:
    Card 1 (left):  "Heart Rate · 68 bpm" — icon + value
    Card 2 (top):   "Sleep Score · 87" — icon + value
    Card 3 (right): "SpO₂ · 98%" — icon + value
  Cards animate: opacity 0→1, scale 0.8→1, stagger 0.15s

Ring:
  - Scales up slightly (scale 1→1.15) and moves to center of viewport
  - Float loop continues
  - Glow intensifies (opacity increases)

Background:
  - Nebula expands slightly
```

### Act 3 — CTA return (scroll 150vh → 300vh)
```
Trigger: scrollY enters act 3 zone

Metric cards fade out
Ring scales back (1.15→1), moves back to right col position

New content fades in on left:
  - Headline: "Ready to feel the difference?"
  - Subheading: "Starting from $199. Free shipping worldwide."
  - CTA: "Shop All Rings →" (full-width ember gradient button)
  - Secondary: "Compare models ↓"

Unpin: section unpins, page continues scrolling to FeaturesSection
```

### Implementation note
```typescript
// hooks/useGSAPTimeline.ts
// Register ScrollTrigger once:
gsap.registerPlugin(ScrollTrigger)

// Pin the hero:
ScrollTrigger.create({
  trigger: ".js-hero-section",
  start: "top top",
  end: "+=300%",
  pin: true,
  scrub: 1,
})

// Act 2 timeline:
const act2 = gsap.timeline({
  scrollTrigger: { trigger: ".js-hero-section", start: "top top", end: "+=150%", scrub: 1 }
})
act2.to(".js-hero-text", { opacity: 0, y: -40 })
    .to(".js-ring", { scale: 1.15, x: "25%" }, "<")
    .to(".js-metric-cards", { opacity: 1, scale: 1, stagger: 0.15 }, "<0.3")

// Act 3 timeline:
const act3 = gsap.timeline({
  scrollTrigger: { trigger: ".js-hero-section", start: "+=150%", end: "+=300%", scrub: 1 }
})
act3.to(".js-metric-cards", { opacity: 0 })
    .to(".js-ring", { scale: 1, x: 0 }, "<")
    .to(".js-hero-cta-final", { opacity: 1, y: 0 }, "<0.2")
```

---

## 17. Product Page — `/products/[slug]`

Style reference: Oura Ring product page — deep dive, cinematic, single product focus.

### Route & data
```
Route:     /products/[slug]   (SSG via generateStaticParams)
Data:      getProductBySlug(slug) from src/data/products.ts
Metadata:  generateMetadata — title: product.name, description: product.tagline
```

### Page section order
```
1. ProductHero          — full-screen, ring image dominant
2. ProductColorPicker   — select ring color/material variant
3. ProductStory         — scrollytelling: what makes this model special
4. ProductMetrics       — animated stat cards (GSAP counter)
5. ProductSpecs         — full spec table for this model
6. ProductFeatures      — 3-col feature grid specific to this model
7. ProductReviews       — 2-3 testimonials for this model
8. ProductCTA           — sticky bottom bar + add to cart / wishlist
9. RelatedProducts      — other Helio Ring models (max 3 cards)
```

### ProductHero
```
Height: 100vh
Layout: ring image fills 60% of screen (right), text left — same as landing hero
Ring image: large, priority, GSAP float
Headline: product.name — Sora 700, text-5xl lg:text-6xl
Tagline: product.tagline — DM Sans 400, text-xl, muted
Price: JetBrains Mono, text-4xl, --foreground
Badge: product.badge (NEW / BESTSELLER / LIMITED) — ember or gold bg
CTA: "Add to Cart" (ember) + heart icon button (wishlist toggle)
```

### ProductColorPicker
```
Layout: horizontal row of color swatches
Swatch: 32x32px circle, border 2px solid transparent
Active swatch: border 2px solid --primary
Hover: scale 1.1
On select: update displayed ring image + color name label
Color name: DM Sans 500, text-sm, --foreground, below swatches
```

### ProductStory (scrollytelling)
```
GSAP ScrollTrigger pin — similar to hero act pattern
3 story beats, each triggered by scroll:
  Beat 1: "Built for sleep" — sleep metric animation
  Beat 2: "Reads your body" — heart rate / SpO₂ visualization  
  Beat 3: "Lasts all week" — battery life illustration
Each beat: left text panel fades in, right visual changes
Duration: 200vh pinned
```

### Sticky CTA bar
```
Position: fixed bottom-0 w-full, z-40
Visible: after user scrolls past ProductHero (100vh)
Background: --card, border-top --border, backdrop-blur-md
Content: product name (left) · price (center) · "Add to Cart" button (right)
Height: 64px
Animation: slides up from bottom when triggered (Framer Motion)
```

### RelatedProducts
```
Title: "Explore other Helio Ring models"
Grid: 3 cards — other products from products.ts excluding current slug
Card: same ProductCard component used in landing page ProductsSection
Link: each card → /products/[slug]
```
