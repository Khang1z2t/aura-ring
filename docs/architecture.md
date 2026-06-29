# Helicorp — Architecture Document
> Read `design.md` for visual design decisions (colors, typography, spacing, motion tokens).

---

## 1. Project Overview

**Product:** Helicorp Smart Health Ring — brand landing page with 3–4 ring models  
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion + GSAP  
**Data:** Static — all product/content data lives in `src/data/`. No external DB.  
**Deployment:** Vercel (recommended) — zero-config with Next.js  
**Chatbot AI:** Google Gemini API (`gemini-2.0-flash`)  
**State:** Zustand (client-side only — cart, wishlist, recently viewed, theme, chatbot)

---

## 2. Tech Stack — DO and DON'T

### ✅ DO USE
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | RSC, image optimization, metadata API |
| Language | TypeScript strict mode | No `any`, explicit return types everywhere |
| Styling | Tailwind CSS v4 | CSS-first config, no `tailwind.config.js` |
| UI primitives | shadcn/ui (Radix-based) | Accessible, unstyled, easy to override |
| Animation | Framer Motion + GSAP | Framer for React state-driven UI, GSAP for scroll/timeline |
| State | Zustand with persist middleware | Cart, wishlist, theme, recently viewed |
| Icons | Lucide React | Tree-shakeable, consistent with shadcn |
| Fonts | `next/font` (Google Fonts) | Zero layout shift, self-hosted automatically |
| Images | `next/image` | WebP conversion, lazy load, blur placeholder |
| Form | React Hook Form + Zod | Validation, type-safe schema |
| Webhook | Native `fetch` POST to webhook URL | Newsletter form submission |
| Chatbot | Gemini API via Next.js Route Handler | Never expose API key to client |
| Analytics/tracking | Custom hooks (`useScrollTracking`, `useClickTracking`) | Behavior events, no external SDK needed |
| Linting | ESLint + Prettier | Enforce code style |

### ❌ DON'T USE
| What | Why not |
|---|---|
| `pages/` router | Project uses App Router only — never mix |
| `any` type | Breaks type safety — use `unknown` and narrow |
| Inline styles | Use Tailwind utilities or CSS vars — never `style={{}}` except for dynamic GSAP values |
| `useEffect` for data fetching | Data is static — import from `src/data/` directly in RSC |
| External UI libraries (MUI, Ant Design, Chakra) | Conflicts with shadcn/ui and Tailwind v4 |
| `localStorage` directly | Always go through Zustand persist — handles SSR safely |
| Server Actions for static data | Overkill — data is local, import it |
| `react-spring` or `anime.js` | Already have Framer + GSAP — no duplicate animation libs |
| Default `<img>` tag | Always use `next/image` for performance |
| Hardcoded color hex in JSX | Use CSS custom properties defined in `design.md` tokens |
| `console.log` in production | Remove before deploy — use env guard if needed |

---

## 3. Folder Structure

```
helicorp/
├── public/
│   ├── images/
│   │   ├── rings/              # Product images (WebP, multiple sizes)
│   │   └── og-image.jpg        # Open Graph image
│   └── fonts/                  # Fallback fonts if needed
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout — font, theme provider, metadata
│   │   ├── page.tsx            # Home: landing page (all sections)
│   │   ├── globals.css         # Tailwind v4 @import, CSS custom properties
│   │   │
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Individual product detail page
│   │   │
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts    # POST — Gemini chatbot handler
│   │       └── subscribe/
│   │           └── route.ts    # POST — newsletter webhook handler
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── sections/           # One file per landing page section
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   ├── SpecsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── SubscribeSection.tsx
│   │   │   └── RecentlyViewed.tsx
│   │   │
│   │   ├── ui/                 # shadcn/ui generated components (DO NOT edit manually)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCardSkeleton.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   └── ProductBadge.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartIcon.tsx
│   │   │
│   │   ├── chatbot/
│   │   │   ├── ChatbotWidget.tsx   # Floating button + chat window
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   │
│   │   └── common/
│   │       ├── ThemeToggle.tsx
│   │       ├── ScrollProgress.tsx
│   │       └── AnimatedSection.tsx # Reusable Framer Motion scroll reveal wrapper
│   │
│   ├── data/                   # Static data — source of truth
│   │   ├── products.ts         # All ring models
│   │   ├── features.ts         # Feature list with icons/descriptions
│   │   ├── specs.ts            # Technical specifications table
│   │   └── testimonials.ts     # Review quotes
│   │
│   ├── hooks/
│   │   ├── useScrollTracking.ts    # Track scroll depth milestones
│   │   ├── useClickTracking.ts     # Track CTA click events
│   │   ├── useGSAPTimeline.ts      # GSAP scroll trigger setup
│   │   └── useMediaQuery.ts        # Responsive breakpoint detection
│   │
│   ├── store/                  # Zustand stores
│   │   ├── useCartStore.ts
│   │   ├── useWishlistStore.ts
│   │   ├── useRecentlyViewedStore.ts
│   │   ├── useChatStore.ts
│   │   └── useThemeStore.ts
│   │
│   ├── types/
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── chat.ts
│   │   └── tracking.ts
│   │
│   ├── lib/
│   │   ├── gemini.ts           # Gemini client helper (server-side only)
│   │   ├── webhook.ts          # Webhook POST helper
│   │   ├── validators.ts       # Zod schemas (subscribe form, chat input)
│   │   └── utils.ts            # cn(), formatPrice(), slugify()
│   │
│   └── config/
│       ├── site.ts             # Site name, URL, social links, metadata defaults
│       └── animations.ts       # Shared Framer Motion variants, GSAP defaults
│
├── .env.local                  # GEMINI_API_KEY, WEBHOOK_URL (never commit)
├── .env.example                # Template with key names, no values
├── next.config.ts
├── tsconfig.json               # strict: true
├── components.json             # shadcn/ui config
├── architecture.md             # This file
└── design.md                   # UI/visual decisions — READ THIS
```

---

## 4. Routing

| Route | Type | Description |
|---|---|---|
| `/` | RSC Page | Full landing page — all sections |
| `/products/[slug]` | RSC Page | Product detail (slug from `products.ts`) |
| `/api/chat` | Route Handler | POST — proxies Gemini API, never exposes key |
| `/api/subscribe` | Route Handler | POST — validates then forwards to webhook |

**Rules:**
- `/` renders all landing sections as RSC — only leaf interactive components use `"use client"`
- `[slug]` generates static params via `generateStaticParams()` from `src/data/products.ts`
- API routes are server-only — import `src/lib/gemini.ts` only inside `app/api/`

---

## 5. Types

```typescript
// src/types/product.ts
export interface Product {
  id: string
  slug: string
  name: string              // e.g. "Helicorp Ring Pro"
  tagline: string
  price: number
  originalPrice?: number    // for discount display
  badge?: "NEW" | "BESTSELLER" | "LIMITED"
  colors: RingColor[]
  images: ProductImage[]
  features: string[]        // feature IDs referencing features.ts
  specs: Record<string, string>
  inStock: boolean
}

export interface RingColor {
  name: string
  hex: string
  imageIndex: number        // which image to show for this color
}

export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
}

// src/types/cart.ts
export interface CartItem {
  productId: string
  quantity: number
  selectedColor: string
}

// src/types/chat.ts
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

// src/types/tracking.ts
export interface TrackingEvent {
  type: "click" | "scroll"
  target: string            // e.g. "cta-hero", "scroll-50"
  timestamp: number
  metadata?: Record<string, unknown>
}
```

---

## 6. State Management (Zustand)

### Rules
- All stores use `persist` middleware with `localStorage` — Zustand handles SSR safely via `skipHydration`
- Never read `localStorage` directly — always via store
- Keep stores flat — no nested objects deeper than 2 levels
- Derived values (e.g. cart total) are computed inside the store as getters, not stored

### Store Responsibilities

```
useCartStore        → items[], addItem, removeItem, updateQty, clearCart, totalPrice (getter)
useWishlistStore    → ids[], toggle, isWishlisted
useRecentlyViewedStore → ids[] (max 6), addViewed — FIFO eviction
useChatStore        → messages[], isOpen, isLoading, sendMessage, clearChat
useThemeStore       → theme: "light"|"dark", toggle — syncs with <html> class
```

---

## 7. Data Layer

All data is **TypeScript modules** — no API calls, no DB, no fetch at build time.

```typescript
// src/data/products.ts
import type { Product } from "@/types/product"

export const products: Product[] = [ ... ]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return products.map(p => p.slug)
}
```

- Import `products` directly in RSC — zero network cost
- `generateStaticParams` in `app/products/[slug]/page.tsx` calls `getAllSlugs()`
- Features and specs are separate files to avoid bloating `products.ts`

---

## 8. Component Rules

### General
- **RSC by default** — only add `"use client"` when component uses hooks, browser APIs, or event handlers
- One component per file — filename matches component name exactly
- Props interface defined in the same file, named `[ComponentName]Props`
- No prop drilling beyond 2 levels — use Zustand store instead

### `"use client"` components (must be)
- All Zustand consumers
- Framer Motion animated components
- GSAP components
- Form components (React Hook Form)
- ChatbotWidget, CartDrawer, ThemeToggle

### Sections (in `components/sections/`)
- Each section is RSC — receives static data as props from `app/page.tsx`
- Animated children are split into separate `"use client"` subcomponents
- Pattern:
  ```tsx
  // HeroSection.tsx — RSC
  import HeroAnimation from "./HeroAnimation" // "use client"
  
  export default function HeroSection() {
    return (
      <section>
        <h1>Static heading</h1>
        <HeroAnimation /> {/* client boundary */}
      </section>
    )
  }
  ```

### AnimatedSection wrapper
```tsx
// components/common/AnimatedSection.tsx — "use client"
// Wraps children with Framer Motion viewport reveal
// Props: children, delay?, direction?: "up"|"left"|"right"
// Used by all sections for consistent scroll reveal behavior
```

---

## 9. Styling Rules

### Tailwind v4 — CSS-first config
- All design tokens defined as CSS custom properties in `globals.css` — **not** in JS config
- Use `@theme` block in `globals.css` for Tailwind token registration
- Never hardcode hex values in JSX — always use token names

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-ring-gold: #C9A84C;
  --color-ring-platinum: #E8E8E8;
  /* ... see design.md for full token list */
}
```

### Class naming
- Tailwind utilities only — no custom CSS classes except for GSAP targets
- GSAP target classes prefixed with `js-` (e.g. `js-hero-ring`) — never style these
- Dark mode via `.dark` class on `<html>` (Tailwind `darkMode: "class"`)

### Responsive
- Mobile-first — base classes for mobile, `md:` and `lg:` for larger screens
- Breakpoints: `sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px`
- Never use fixed pixel widths on layout containers — use `max-w-*` + `mx-auto`

---

## 10. Animation Architecture

### Framer Motion — use for:
- Component mount/unmount transitions
- Scroll-triggered section reveals (via `whileInView`)
- Cart drawer slide-in, modal open/close
- Product card hover micro-interactions
- Shared variants defined in `src/config/animations.ts`

### GSAP — use for:
- Hero section timeline (ring rotation, text stagger on load)
- Parallax scroll effects (ring floating, background depth layers)
- Specs section counter animation
- ScrollTrigger pinning for scrollytelling sections
- Register plugins once in a `"use client"` layout component or custom hook

### Rule: Never mix Framer and GSAP on the same element
- GSAP owns the hero ring and parallax layers
- Framer owns card hovers, drawers, modals, section reveals

---

## 11. API Routes

### `/api/chat` — POST
```typescript
// Input
{ message: string; history: { role: string; content: string }[] }

// Behavior
// 1. Validate input with Zod
// 2. Build system prompt with product context from src/data/
// 3. Call Gemini API server-side (GEMINI_API_KEY from env)
// 4. Stream or return response text
// 5. Never expose API key — this route is the only Gemini caller

// Output
{ reply: string }
```

### `/api/subscribe` — POST
```typescript
// Input
{ email: string; name?: string }

// Behavior
// 1. Validate email with Zod
// 2. POST to WEBHOOK_URL (env var) with payload
// 3. Return success/error

// Output
{ success: boolean; message: string }
```

---

## 12. SEO & Performance

### Metadata (per page)
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: { default: "Helicorp Ring", template: "%s | Helicorp" },
  description: "...",
  openGraph: { images: ["/og-image.jpg"] },
  // ...
}

// app/products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  return { title: product.name, description: product.tagline }
}
```

### Performance rules
- All images: `next/image` with explicit `width`/`height` and `blurDataURL` placeholder
- Hero image: `priority={true}` — no lazy load for LCP element
- Fonts: `next/font/google` with `display: "swap"`
- Heavy components (ChatbotWidget, CartDrawer): `dynamic()` import with `ssr: false`
- GSAP: import only used plugins — never `import gsap/all`
- Framer Motion: import from `"framer-motion"` not the full bundle path

### Target scores
| Metric | Target |
|---|---|
| PageSpeed Mobile | ≥ 85 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID/INP | < 200ms |

---

## 13. Environment Variables

```bash
# .env.local (never commit)
GEMINI_API_KEY=           # Google AI Studio key
WEBHOOK_URL=              # Newsletter webhook endpoint

# .env.example (commit this — no values)
GEMINI_API_KEY=
WEBHOOK_URL=
```

- Access in API routes via `process.env.GEMINI_API_KEY`
- Never import env vars in `"use client"` components — only in server components and route handlers
- Prefix with `NEXT_PUBLIC_` only if the value must be on the client (avoid if possible)

---

## 14. Git & Branch Strategy

```
main          → production (Vercel auto-deploy)
develop       → integration branch
feature/*     → individual features (e.g. feature/chatbot, feature/cart)
fix/*         → bug fixes
```

**Commit message format:**
```
type(scope): short description

feat(cart): add quantity update in cart drawer
fix(hero): prevent GSAP flash on mobile
perf(images): add blurDataURL to all product images
style(navbar): adjust mobile menu spacing
chore(deps): upgrade framer-motion to 11.x
```

---

## 15. Key Files Quick Reference

| File | Purpose |
|---|---|
| `src/data/products.ts` | Single source of truth for all product data |
| `src/config/animations.ts` | Shared Framer variants + GSAP defaults |
| `src/config/site.ts` | Site-wide constants (name, URL, nav links) |
| `src/lib/utils.ts` | `cn()` helper, `formatPrice()`, `slugify()` |
| `src/app/globals.css` | Tailwind v4 theme tokens, CSS custom properties |
| `design.md` | **READ THIS** — all color, typography, spacing decisions |

---

> **For visual design decisions (palette, typography, spacing scale, motion tokens, dark mode values) — read `design.md` before writing any UI code.**
