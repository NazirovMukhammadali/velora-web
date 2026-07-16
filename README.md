# Velora Web

**Velora** is a modern travel booking frontend — search and compare **flights**, **hotels**, **rental cars**, and **tour packages**, connect with **travel agents**, and explore a **travel community**. Built as a portfolio-grade Next.js application with a Nestar GraphQL backend and a resilient static demo fallback when the API is offline.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-e535ab)

---

## Features

| Area | Highlights |
|------|------------|
| **Home** | Immersive hero with tabbed search (Hotel · Flights · RentCar), rotating backgrounds, overlapping search card |
| **Catalogs** | `/tours`, `/hotels`, `/rentcar`, `/flights` — filters, sort, URL-shareable query params |
| **Details** | Rich package & flight detail pages with gallery, reviews, and booking panels |
| **Booking** | Guest flow with date validation, auth-aware panels, local booking persistence |
| **Agents** | Agent directory and profile pages with reviews |
| **Community** | Articles, comments, and member profiles |
| **Auth** | JWT login/register, `useAuth()` hook, protected my-page & admin routes |
| **UX** | Error boundaries, skeleton loaders, toast notifications (notistack) |
| **i18n** | English, Korean, Russian via `next-i18next` |
| **SEO** | Per-route `<title>` and meta descriptions; dynamic detail metadata |
| **Mobile** | Responsive CSS — hero banners and layouts adapt without user-agent splitting |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 14](https://nextjs.org/) (Pages Router) |
| UI | React 18, [MUI](https://mui.com/) 5, SCSS |
| Data | [Apollo Client](https://www.apollographql.com/docs/react/) GraphQL |
| Backend | Nestar GraphQL API (NestJS) — typically `http://127.0.0.1:3007/graphql` |
| i18n | `next-i18next` |
| Images | `next/image` with `remotePatterns` (Unsplash + API host) |
| Notifications | `notistack` |

---

## Static / demo fallback strategy

Velora is designed to **look complete even without a running backend**:

1. **Catalog pages** (`/tours`, `/hotels`, `/rentcar`, `/flights`) call GraphQL with `errorPolicy: 'all'`.
2. If the API returns data → results are mapped via `libs/data/packageApi.ts` and `libs/data/flights.ts`.
3. If the API is empty or unreachable → the UI falls back to curated static datasets in `libs/data/packages.ts` and `libs/data/flights.ts`.
4. **Detail pages** check the static catalog first by ID; only then query the API for items not in the demo set.

This makes demos, portfolio reviews, and local UI work reliable without requiring a live Nestar instance.

---

## Local setup

### Prerequisites

- Node.js 18+
- [Yarn](https://yarnpkg.com/) 1.x
- (Optional) Nestar backend on port `3007` for live GraphQL data

### Install & run

```bash
git clone <your-repo-url>
cd velora-web
yarn install
cp .env.example .env
yarn dev
```

Open **http://localhost:3000**

### Environment variables

Copy `.env.example` to `.env` and adjust if your API runs elsewhere:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3007
NEXT_PUBLIC_API_GRAPHQL_URL=http://127.0.0.1:3007/graphql
NEXT_PUBLIC_API_WS_URL=ws://127.0.0.1:3007/graphql
```

Legacy `REACT_APP_*` names are also supported for backward compatibility.

### Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Development server with hot reload |
| `yarn build` | Production build |
| `yarn start:prod` | Serve production build on port 3000 |
| `yarn lint` | ESLint (optional; skipped during build) |

---

## Project structure

```
pages/                  # Next.js routes
libs/
  components/           # UI (layout, homepage, packages, flights, …)
  hooks/                # useAuth, useCatalogQuery, useToast, …
  data/                 # Static catalogs + API mappers
  config/               # SEO and app config
apollo/                 # GraphQL client, queries, store
scss/pc/                # Primary styles (+ responsive @media)
scss/mobile/            # Mobile footer overrides
public/                 # Static assets, locales, video
```

Key entry points:

| Concern | Path |
|---------|------|
| Home layout & hero | `libs/components/layout/LayoutHome.tsx`, `HeaderFilter.tsx` |
| Inner pages layout | `libs/components/layout/LayoutBasic.tsx` |
| Navbar | `libs/components/layout/VeloraNavbar.tsx` |
| SEO | `libs/config/seo.ts`, `libs/components/common/SeoHead.tsx` |
| Auth hook | `libs/hooks/useAuth.ts` |
| URL filters | `libs/hooks/useCatalogQuery.ts` |

---

## Design & contributor notes

- **[AGENTS.md](./AGENTS.md)** — agent workflow, design rules, file map
- **[docs/DESIGN.md](./docs/DESIGN.md)** — UI spec (Nestar navbar + Kayak palette + Tourex hero)

Velora brand colors live in `scss/variables.scss` (`$velora-primary`, `$velora-accent`).

---

## License

See [LICENSE](./LICENSE) · Version history in [CHANGELOG.md](./CHANGELOG.md).
