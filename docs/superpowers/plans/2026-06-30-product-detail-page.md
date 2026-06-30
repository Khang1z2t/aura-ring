# Product detail page implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/products/[slug]` scaffold with a real Aurora product detail page that shows large hero image, purchase panel, finish selection, size selection, reasons, and specs.

**Architecture:** Keep route page as server component that resolves `slug`, reads `searchParams`, and renders shell content. Put interactive purchase state in one client component so finish and size logic stay local, while image and content blocks stay presentational. Reuse current `products` data and existing `slugify` / `formatPrice` helpers instead of adding new data structures or dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, next/image, existing Aurora product data.

## Global Constraints

- Replace current scaffold at `/products/[slug]`
- Use existing `products` data as source of truth
- Show one large hero image for current product
- Show right-side purchase panel with badge when available, product name, short supporting copy, price, horizontal color selector, size mode with `Free sizing kit` as default, optional direct size selection from 6 to 13, and `Add to cart` button as UI-only state
- Read `?color=` query and preselect matching finish when valid
- Show `Why choose` section from existing `features`
- Show `Specifications` section from existing `specs`
- Keep mobile behavior clean by stacking layout vertically
- No real cart integration
- No dynamic image swapping per finish
- No fake CSS tinting of single product image
- No sticky buy rail
- No query-param persistence for selected size
- Invalid `slug` should render not found behavior
- Invalid `color` query should gracefully fall back to first available color
- Finish options must be real buttons or equivalent interactive controls
- Touch layout must not depend on hover
- Verify with `npm run lint`, browser checks on `/products/[slug]`, valid and invalid `?color=` behavior, size default/override behavior, and mobile readability

---

## File structure

- Modify: `src/app/products/[slug]/page.tsx`
  - Replace scaffold with real route page
  - Resolve product from slug
  - Read `searchParams.color`
  - Render detail shell with image, panel, reasons, and specs
- Create: `src/components/product/ProductDetailPurchasePanel.tsx`
  - Client state for selected finish and size mode
  - Render purchase controls and CTA
- Create: `src/components/product/ProductDetailImage.tsx`
  - Presentational framed product image block
- Optional create: `src/components/product/ProductDetailInfoSection.tsx`
  - Only if repeated markup for reasons/specs becomes noisy; skip if inline page code stays short

### Task 1: Replace route scaffold with server-rendered PDP shell

**Files:**
- Modify: `src/app/products/[slug]/page.tsx`
- Test: `src/app/products/[slug]/page.tsx` via lint and build

**Interfaces:**
- Consumes: `getAllSlugs(): string[]`, `getProductBySlug(slug: string): Product | undefined` from `src/data/products.ts`
- Produces: server page that passes `product: Product` and `initialColorSlug: string | null` into later client purchase panel

- [ ] **Step 1: Replace `src/app/products/[slug]/page.tsx` scaffold with server shell**

```tsx
import { notFound } from 'next/navigation'

import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ProductDetailImage } from '@/components/product/ProductDetailImage'
import { ProductDetailPurchasePanel } from '@/components/product/ProductDetailPurchasePanel'
import { getAllSlugs, getProductBySlug } from '@/data/products'
import { slugify } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    color?: string
  }>
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params
  const { color } = await searchParams
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const validColor = product.colors.find((item) => slugify(item.name) === color)
  const initialColorSlug = validColor ? slugify(validColor.name) : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 py-8 md:px-8 md:py-10 lg:px-0 lg:py-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.85fr)] lg:items-start lg:gap-10">
            <ProductDetailImage product={product} />
            <ProductDetailPurchasePanel product={product} initialColorSlug={initialColorSlug} />
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24 lg:px-0 lg:pb-28">
          <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[2rem] border border-border bg-card/50 p-6 md:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                Why choose {product.name}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground md:text-base">
                {product.features.map((feature) => (
                  <li key={feature} className="border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[2rem] border border-border bg-card/50 p-6 md:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                Specifications
              </p>
              <dl className="mt-4 space-y-3 text-sm md:text-base">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-6 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
```

- [ ] **Step 2: Restore `getProductBySlug` import in data file if missing**

Make sure `src/data/products.ts` exports both helpers exactly like this:

```ts
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getAllSlugs(): string[] {
  return products.map((product) => product.slug)
}
```

- [ ] **Step 3: Run lint on route page**

Run: `rtk npm run lint -- src/app/products/[slug]/page.tsx src/data/products.ts`
Expected: ESLint passes with no errors.

- [ ] **Step 4: Run build to verify dynamic route props shape**

Run: `rtk npm run build`
Expected: Next build passes and route compiles with `params` and `searchParams` promise types.

### Task 2: Build large image presentation block

**Files:**
- Create: `src/components/product/ProductDetailImage.tsx`
- Test: `src/components/product/ProductDetailImage.tsx` via lint and page render

**Interfaces:**
- Consumes: `product: Product`
- Produces: `ProductDetailImage({ product }: { product: Product })` for use in route page

- [ ] **Step 1: Create `src/components/product/ProductDetailImage.tsx`**

```tsx
import Image from 'next/image'

import type { Product } from '@/types/product'

interface ProductDetailImageProps {
  product: Product
}

export function ProductDetailImage({ product }: ProductDetailImageProps) {
  const image = product.images[0]

  return (
    <section className="rounded-[2rem] border border-border bg-card/60 p-4 md:p-6 lg:p-8">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-surface">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 md:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            {product.name}
          </p>
          {product.badge ? (
            <span className="rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="aspect-[1/1.02] md:aspect-[1.05/1]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-contain p-6 md:p-8 lg:p-10"
            priority
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run lint on image component**

Run: `rtk npm run lint -- src/components/product/ProductDetailImage.tsx`
Expected: ESLint passes with no errors.

- [ ] **Step 3: Smoke-check render through build**

Run: `rtk npm run build`
Expected: Component imports cleanly and no server/client boundary errors appear.

### Task 3: Build interactive purchase panel

**Files:**
- Create: `src/components/product/ProductDetailPurchasePanel.tsx`
- Test: `src/components/product/ProductDetailPurchasePanel.tsx` via lint and browser interaction

**Interfaces:**
- Consumes: `product: Product`, `initialColorSlug: string | null`, `formatPrice(price: number): string`, `slugify(value: string): string`
- Produces: `ProductDetailPurchasePanel({ product, initialColorSlug }: ProductDetailPurchasePanelProps)` that manages local finish and size state

- [ ] **Step 1: Create `src/components/product/ProductDetailPurchasePanel.tsx`**

```tsx
'use client'

import { useMemo, useState } from 'react'

import { formatPrice, slugify } from '@/lib/utils'
import type { Product } from '@/types/product'

const ringSizes = ['6', '7', '8', '9', '10', '11', '12', '13'] as const

interface ProductDetailPurchasePanelProps {
  product: Product
  initialColorSlug: string | null
}

export function ProductDetailPurchasePanel({
  product,
  initialColorSlug,
}: ProductDetailPurchasePanelProps) {
  const initialColor =
    product.colors.find((color) => slugify(color.name) === initialColorSlug) ?? product.colors[0]

  const [selectedColorName, setSelectedColorName] = useState(initialColor.name)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const selectedColor = useMemo(
    () => product.colors.find((color) => color.name === selectedColorName) ?? product.colors[0],
    [product.colors, selectedColorName]
  )

  const finishLabel = selectedColor.shortName ?? selectedColor.name
  const usingSizingKit = selectedSize === null

  return (
    <section className="rounded-[2rem] border border-border bg-card/60 p-6 md:p-8">
      {product.badge ? (
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {product.badge}
        </p>
      ) : null}

      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
        {product.name}
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{product.tagline}</p>

      <div className="mt-5 flex items-end gap-3">
        <p className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {formatPrice(product.price)}
        </p>
        {product.originalPrice ? (
          <p className="pb-1 text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Finish</p>
          <p className="text-sm text-muted-foreground">{finishLabel}</p>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {product.colors.map((color) => {
            const isActive = color.name === selectedColor.name
            const shortName = color.shortName ?? color.name

            return (
              <button
                key={color.name}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedColorName(color.name)}
                className={`shrink-0 rounded-2xl border px-3 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/8 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="block h-2.5 w-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-medium">{shortName}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Size</p>

        <button
          type="button"
          aria-pressed={usingSizingKit}
          onClick={() => setSelectedSize(null)}
          className={`mt-3 w-full rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
            usingSizingKit
              ? 'border-primary bg-primary/8 text-foreground'
              : 'border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground'
          }`}
        >
          <span className="block text-sm font-medium text-foreground">Free sizing kit</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Best for first-time buyers who want to confirm fit before the ring ships.
          </span>
        </button>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Know your size already? Choose 6–13.</p>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {ringSizes.map((size) => {
              const isActive = selectedSize === size

              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary/60'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add to cart
      </button>

      <p className="mt-3 text-sm text-muted-foreground">
        {usingSizingKit
          ? 'Sizing kit selected by default. You can confirm your fit before the ring ships.'
          : `Direct size ${selectedSize} selected.`}
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Run lint on purchase panel**

Run: `rtk npm run lint -- src/components/product/ProductDetailPurchasePanel.tsx`
Expected: ESLint passes with no errors.

- [ ] **Step 3: Run full build to catch client boundary mistakes**

Run: `rtk npm run build`
Expected: Build passes and client component compiles without server-only import errors.

### Task 4: Verify page behavior in browser and clean polish issues

**Files:**
- Modify: `src/app/products/[slug]/page.tsx` if spacing/copy adjustments are needed after browser check
- Modify: `src/components/product/ProductDetailPurchasePanel.tsx` if interaction polish is needed after browser check
- Modify: `src/components/product/ProductDetailImage.tsx` if image framing needs adjustment after browser check
- Test: live browser checks on `/products/aura-air`, `/products/aura-pro?color=matte-black`, and invalid color query

**Interfaces:**
- Consumes: completed route page, image component, purchase panel
- Produces: verified detail page behavior that matches approved spec

- [ ] **Step 1: Run lint on final touched files**

Run: `rtk npm run lint -- src/app/products/[slug]/page.tsx src/components/product/ProductDetailImage.tsx src/components/product/ProductDetailPurchasePanel.tsx`
Expected: ESLint passes with no errors.

- [ ] **Step 2: Run production build**

Run: `rtk npm run build`
Expected: Next build passes with `/products/[slug]` route compiled.

- [ ] **Step 3: Launch app and verify core flows in browser**

Run dev server in background:

```bash
rtk npm run dev
```

Then verify these manual checks:
- `/products/aura-air` renders real product detail page instead of scaffold
- `/products/aura-pro?color=matte-black` preselects Matte finish
- invalid query like `/products/aura-pro?color=nope` falls back to first finish
- `Free sizing kit` is active on first load
- clicking size `10` deselects sizing kit and shows direct-size helper copy
- clicking `Free sizing kit` again clears direct size
- mobile width stacks image above purchase panel and keeps controls tappable

- [ ] **Step 4: Apply minimal polish only if browser check reveals a real problem**

Allowed polish examples:

```tsx
className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.85fr)] lg:items-start lg:gap-10"
```

```tsx
className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
```

Do not add new sections, fake cart logic, or image tinting during polish.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/app/products/[slug]/page.tsx src/components/product/ProductDetailImage.tsx src/components/product/ProductDetailPurchasePanel.tsx docs/superpowers/specs/2026-06-30-product-detail-page-design.md docs/superpowers/plans/2026-06-30-product-detail-page.md
git commit -m "feat: build product detail page"
```

Expected: one focused commit containing spec, plan, and PDP implementation.

## Self-review

### Spec coverage
- Route replacement: Task 1
- Large image left + purchase panel right: Tasks 1 and 2 and 3
- Valid/invalid `?color=` behavior: Tasks 1 and 4
- Finish selector, default sizing kit, direct sizes 6–13, UI-only CTA: Task 3
- Reasons and specs below: Task 1
- Mobile-safe non-hover UI: Tasks 1 and 3 and 4
- Verification requirements: Task 4

No gaps found.

### Placeholder scan
- No `TBD`, `TODO`, or vague implementation placeholders remain.
- Each file path, command, and component interface is explicit.

### Type consistency
- `ProductDetailImage` consumes `product: Product`
- `ProductDetailPurchasePanel` consumes `product: Product` and `initialColorSlug: string | null`
- Route page passes those exact props
- `getProductBySlug` and `getAllSlugs` names match current data helpers
