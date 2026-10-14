# Velora — UI Design System

This document describes Velora's UI design system, color palette, and component architecture. New screens and components should follow it.

## 1. Principles

- **Travel first** — every page leads toward a search, a listing or a booking.
- **One brand language** — the same tokens, typography and card patterns across catalogs, community and admin.
- **Calm, readable surfaces** — soft backgrounds, white cards, generous spacing and one strong accent per view.
- **Responsive by CSS** — layouts adapt with media queries; no device-specific page variants.

## 2. Design tokens

Defined in `scss/variables.scss`.

### Color palette

| Token | Value | Usage |
|-------|-------|-------|
| `$velora-primary` | `#5b3df5` | Primary actions, active tabs, prices, pagination, links |
| `$velora-primary-dark` | `#4527db` | Section eyebrows, hover and pressed states |
| `$velora-accent` | `#ff6b2c` | Search CTA, active navigation item, logo gradient, highlights |
| `$velora-text-main` | `#181a20` | Headings and body text |
| `$velora-background-soft` | `#f5f7fb` | Section and page backgrounds |
| `$velora-surface` | `#ffffff` | Cards, panels, search card |

### Typography

| Role | Font | Notes |
|------|------|-------|
| UI and headings | **Poppins** (`$font`) | Weights 400–800 |
| Section eyebrows | **Kalam** (`$font-script`) | Handwritten label above section headings via `@include velora-script-eyebrow` (22px desktop, 20px mobile) |

### Breakpoints

| Width | Purpose |
|-------|---------|
| `≤ 980px` | Tablet: navigation collapses into a drawer, compact page hero |
| `≤ 900px` | Two-column content blocks stack |
| `≤ 768px` | Catalog toolbars and cards switch to mobile spacing |
| `≤ 560px` | Phone: single-column forms, compact hero, smaller type |
| `≤ 375px` | Small phones: tightest paddings |

## 3. Layout architecture

| Layout | Used by | Behaviour |
|--------|---------|-----------|
| `LayoutHome` | `/` | Overlay navbar on a full-bleed hero |
| `LayoutBasic` | Inner pages | Contrast navbar, page hero with title and subtitle, footer |
| Auth layout | `/login`, `/register`, `/account/join` | No navbar or footer; full-screen travel background with a centered auth card |
| `LayoutAdmin` | `/_admin/*` | Sidebar navigation and Velora-themed MUI admin surfaces |

## 4. Navigation

```text
[● VELORA]      Home   Tours   Agents   Community   CS      [Login / Register] [🇺🇸 ▾]
```

- Fixed top bar, about 80px high (72px on mobile).
- Home: dark translucent overlay that becomes more opaque on scroll; inner pages use the solid contrast variant.
- Active link uses `$velora-accent`.
- Right side shows Login / Register or the member avatar menu, plus the language menu (English, Korean, Russian).
- Below 980px the centre links move into a slide-in drawer.
- Flights, hotels and rental cars are reached from the hero search tabs, not from the navbar.

## 5. Home hero and search

```text
┌─────────────────────────────────────────────┐
│  Navbar (fixed overlay)                     │
│                                             │
│       Full-bleed background slider          │
│                                             │
│            ┌──────────────────────┐         │
│            │ Hotel│Flights│RentCar│         │
│            │ search fields   [Go] │         │
│            └──────────┬───────────┘         │
└───────────────────────┼─────────────────────┘
                        │ ~50% overlap
              ┌─────────▼─────────┐
              │ Home sections     │
              └───────────────────┘
```

- Tabs: **Hotel** (default), **Flights**, **Rent a Car**. Each tab has its own set of three backgrounds (`libs/data/heroBackgrounds.ts`) that auto-advance every 5 seconds, paused under `prefers-reduced-motion`.
- The white search card overlaps the next section; the Search button uses `$velora-accent`.
- Searches route to `/hotels`, `/flights` or `/rentcar` with the query in the URL.

## 6. Component patterns

| Pattern | Where | Notes |
|---------|-------|-------|
| Section header | Home sections, catalogs | Kalam eyebrow → bold Poppins `h2` → muted lead paragraph |
| Package card | Tours, hotels, cars | Image with favourite button, title, location and meta, purple price footer with rating |
| Flight card | Flights | Airline badge, route timeline, fare and "View deal" action |
| Catalog toolbar | Catalog pages | Search with type-ahead suggestions, date and party filters, category pills, sort select |
| Pagination | Catalogs, agents, community | Two desktop rows per page (8 items); changing pages keeps the scroll position |
| Album card | Popular destinations | Large image tiles with overlaid caption |
| Article card | Community, Latest News | Cover image, category chip, title, date and reading time |
| AI assistant | Every page | Floating robot button opens a chat panel with listing cards, suggestion chips and an AI / FAQ badge |
| Empty and error states | Catalogs, community detail | Dashed soft panel with a clear message and a way back |

## 7. Imagery and icons

- High-quality travel photography served through `next/image` (Unsplash and the API host).
- Uploaded images are served by the API from `/uploads`.
- Icons: Phosphor Icons and MUI icons; flags in the language menu are fixed at 24×17px.

## 8. Accessibility and motion

- Visible focus states on inputs and buttons; buttons carry text or an `aria-label`.
- Animations are subtle and respect `prefers-reduced-motion`.
- Text keeps WCAG-friendly contrast on both light surfaces and the dark navbar.
