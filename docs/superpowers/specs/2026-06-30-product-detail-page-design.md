# Aura Ring `/products/[slug]` Product Detail Page Design

## Goal
Build first real `/products/[slug]` product detail page as a calm premium PDP: large product visual on left, purchase configuration on right, then reasons and specs below. Page should feel like a lightweight luxury ecommerce detail page, not a full marketplace template.

## Scope
In scope for this version:
- Replace current scaffold at `/products/[slug]`
- Use existing `products` data as source of truth
- Show one large hero image for current product
- Show right-side purchase panel with:
  - badge when available
  - product name
  - short supporting copy
  - price
  - horizontal color selector
  - size mode with `Free sizing kit` as default
  - optional direct size selection from 6 to 13
  - `Add to cart` button as UI-only state
- Read `?color=` query and preselect matching finish when valid
- Show `Why choose` section from existing `features`
- Show `Specifications` section from existing `specs`
- Keep mobile behavior clean by stacking layout vertically

Out of scope for this version:
- Real cart integration
- Dynamic image swapping per finish
- Fake CSS tinting of single product image
- Reviews, testimonials, upsells, cross-sells
- Sticky buy rail
- Quantity selector
- Shipping calculator
- Variant availability matrix
- Query-param persistence for selected size

## Product Detail Intent
This page should sit between editorial brand presentation and ecommerce purchase flow.

Visual priorities:
1. Product image first
2. Product identity and finish selection second
3. Size decision third
4. Reinforcement content after purchase controls

Interaction priorities:
1. Land on page and understand model instantly
2. Pick finish quickly
3. Stay on `Free sizing kit` unless customer already knows size
4. See strong but simple CTA without needing full cart logic yet

## Data Model Decisions
Use existing fields in `src/data/products.ts`.

Required product fields already present:
- `slug`
- `name`
- `tagline`
- `price`
- `originalPrice` (optional)
- `badge` (optional)
- `images`
- `colors`
- `features`
- `specs`
- `inStock`

No new permanent data fields are required for first version.

Detail page derived state:
- `selectedColor` comes from `?color=` if valid, otherwise first item in `colors`
- `sizeMode` defaults to `kit`
- `selectedSize` defaults to `null`
- Selecting direct size changes mode from `kit` to `size`
- Re-selecting `Free sizing kit` clears direct size

## Routing
Route stays:
- `/products/[slug]`

Supported query param:
- `?color=<color-slug>`

Examples:
- `/products/aura-air?color=rose-titanium`
- `/products/aura-pro?color=matte-black`

Behavior:
- Invalid `slug` should render not found behavior
- Invalid `color` query should gracefully fall back to first available color
- No client-side routing tricks are required for first version

## Layout

### 1. Hero buy section
Desktop:
- two-column layout
- left image area takes roughly 60–70%
- right purchase panel takes roughly 30–40%
- generous spacing between columns

Mobile/tablet:
- image first
- purchase panel below
- reasons/specs continue below in single column

### 2. Left image area
Content:
- one large product image from `product.images`
- use selected product image regardless of selected finish because only one real asset exists today

Behavior:
- do not attempt CSS hue shifts or fake material recoloring
- selected finish changes UI state only, not image bitmap

Visual intent:
- quiet framed surface
- image should dominate without heavy chrome

### 3. Right purchase panel
Order:
- badge if present
- product name
- one short supporting line
- price row
- finish selector
- size selector block
- add to cart button

Supporting line source:
- use existing `product.tagline`
- optionally pair with selected finish label nearby, but do not duplicate too much copy

Price row:
- show `originalPrice` only when present
- show current price as primary value

### 4. Finish selector
Presentation:
- horizontal list of finish pills/cards/buttons
- each option shows color dot and finish name
- active option has clear visual selected state
- keep labels concise by using `color.shortName ?? color.name`

Behavior:
- clicking finish updates local selected state
- selected state updates current finish label in purchase panel
- page image does not change for now
- if initial `?color=` exists and matches normalized finish slug, preselect it

### 5. Size selector
Default state:
- `Free sizing kit` selected by default

Structure:
- first option: `Free sizing kit`
- below or after that: direct size choices `6` through `13`

Behavior:
- clicking size `6–13` deselects kit and activates direct size mode
- clicking `Free sizing kit` clears direct size and restores default mode
- size choices are single-select

Copy intent:
- explain that sizing kit is safest default
- direct size is for customers who already know fit

### 6. Add to cart button
Behavior for first version:
- UI-only button
- no real cart mutation required
- may reflect current selection state in button-adjacent helper text if useful

Guardrail:
- avoid fake success toast or fake cart badge increment unless explicitly requested later

## Content Below Purchase Panel

### 1. Why choose section
Purpose:
- reinforce value without bloating hero panel

Source:
- existing `product.features`

Presentation:
- simple vertical list
- no accordion
- no icons required unless existing page language strongly benefits

### 2. Specifications section
Purpose:
- quick factual scan

Source:
- existing `product.specs`

Presentation:
- simple key/value rows
- stacked under reasons section
- no comparison table in this version

## Component Strategy
Prefer smallest change set that keeps files readable.

Recommended structure:
- `src/app/products/[slug]/page.tsx`
  - fetch product from slug
  - parse search params
  - render page shell
- `src/components/product/ProductDetailPurchasePanel.tsx`
  - client component for finish and size selection state
- `src/components/product/ProductDetailImage.tsx`
  - presentational large image surface
- `src/components/product/ProductDetailInfoSection.tsx`
  - reusable content block for reasons/specs if needed

If implementation remains small, `ProductDetailInfoSection` can be skipped and reasons/specs can stay inline in page file. Do not create extra abstraction without need.

## State Strategy
Server/client split should stay minimal.

Server responsibilities:
- resolve slug
- choose product
- pass initial selected finish slug/value into client purchase panel

Client responsibilities:
- selected finish state
- selected size mode state
- selected size state
- button label or helper text derived from current selection if used

No external state store required.
No cart store wiring required.

## Responsive Behavior
Desktop:
- two-column hero section
- finish options can wrap if needed but should prefer horizontal flow
- reasons/specs remain in vertical blocks below

Tablet/mobile:
- stack image and purchase panel
- finish rail remains horizontally scan-friendly or wraps cleanly
- size choices stay easy to tap
- add-to-cart button spans full width

Touch behavior:
- no hover-dependent information
- selected states must remain visible without hover

## Accessibility
- finish options must be real buttons or equivalent interactive controls
- selected finish and selected size must expose active state clearly
- focus rings must remain visible
- image alt text should use existing product image alt
- invalid query fallback must not produce broken UI
- button labels and helper copy must stay understandable without visual styling

## Styling Direction
- stay inside current Aurora warm-luxury palette
- keep surfaces clean and premium
- avoid loud gradients or fake glass unless already consistent with surrounding page language
- let spacing and typography carry most of visual hierarchy
- selected controls should feel refined, not game-like

## Non-Goals / Guardrails
- Do not build full ecommerce backend illusion
- Do not fake color-swapped imagery with CSS filters
- Do not overbuild variant system for future images yet
- Do not add sticky desktop purchase rail in this pass
- Do not add shipping, warranty, review, or delivery modules unless separately requested

## Testing / Verification
Minimum verification for implementation phase:
- `npm run lint`
- open one or more `/products/[slug]` pages in browser
- verify valid slug renders real product detail content
- verify invalid slug does not render scaffold
- verify valid `?color=` preselects matching finish
- verify invalid `?color=` falls back to first finish
- verify `Free sizing kit` is default
- verify selecting size `6–13` overrides kit
- verify re-selecting kit clears direct size
- verify mobile layout stays readable and tappable
- verify no hover-only critical content exists
