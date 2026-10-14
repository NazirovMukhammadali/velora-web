# Velora Web

**Velora** is a full-stack travel booking platform. Travellers search and compare **flights**, **hotels**, **rental cars**, and **tour packages**, follow verified **travel agents**, share stories in the **community**, and plan trips with a built-in **Gemini-powered AI assistant**.

This repository is the web client (`velora-web`). It talks to the **Velora GraphQL API** (`velora-api`, NestJS) and stays fully browsable thanks to a curated static fallback when the API is unavailable.

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo%20Client-E10098?logo=graphql&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?logo=googlegemini&logoColor=white)

---

## Highlights

| Area | What it does |
|------|--------------|
| **Home** | Immersive hero with tabbed search (Hotel · Flights · Rent a Car), rotating backgrounds and an overlapping search card |
| **Catalogs** | `/tours`, `/hotels`, `/rentcar`, `/flights` with filters, sorting, URL-shareable queries, type-ahead suggestions and scroll-stable pagination |
| **Details & booking** | Galleries, reviews and booking panels with date validation and auth-aware flows |
| **AI assistant** | Floating robot widget that answers with live listings as cards (image, price, link), follow-up suggestion chips and an AI / FAQ indicator |
| **Agents** | Directory and profiles of verified travel experts |
| **Community** | Articles, comments, likes and Instagram-style follow / followers |
| **Auth** | JWT login and registration, safe redirects, session expiry handling, protected My Page and admin routes |
| **Admin** | Dashboard plus management of catalogs, bookings, members, articles and notices |
| **i18n** | English, Korean and Russian |
| **Responsive** | Media-query driven layouts from 360px phones to wide desktops |

---

## Tech stack

### Frontend — `velora-web`

| Concern | Technology |
|---------|------------|
| Framework | Next.js 14 (Pages Router) |
| Core library | React 18 |
| Language | TypeScript |
| State & API | Apollo Client (GraphQL), Apollo reactive variables |
| UI & styling | Material UI (MUI 5), SCSS (Sass), custom Velora design system, Phosphor Icons |
| AI assistant | Gemini AI assistant widget (floating hero UI) |
| Internationalization | next-i18next (English, Korean, Russian) |
| Feedback & dialogs | SweetAlert2 |
| Testing | Jest |

### Backend — `velora-api`

| Concern | Technology |
|---------|------------|
| Framework | NestJS (Node.js) |
| API architecture | GraphQL (code-first) and REST health check |
| Database & ODM | MongoDB, Mongoose |
| AI engine | Google Gemini 3.5 Flash-Lite (`@google/genai`) with parallel tool calls |
| Security & rate limiting | JWT authentication, `@nestjs/throttler` (global and AI assistant limits) |
| Testing | Jest (unit tests and in-memory MongoDB integration tests) |

### DevOps & tooling

| Concern | Technology |
|---------|------------|
| Package management | Yarn (`yarn.lock`) for the web client, npm (`package-lock.json`) for the API |
| Code quality | ESLint, Prettier; Husky + lint-staged pre-commit checks (API) |
| CI | GitHub Actions on the API (lint, build, unit and integration tests) |
| Operations | `/health` endpoint (API and MongoDB status), persistent uploads volume (`UPLOADS_DIR` → `/uploads`) |

---

## Architecture

```text
┌────────────────────────┐   GraphQL (Apollo)    ┌──────────────────────────┐
│  velora-web (Next.js)  │ ────────────────────▶ │  velora-api (NestJS)     │
│  pages · components    │                       │  GraphQL + REST /health  │
│  Apollo cache · i18n   │ ◀──────────────────── │  JWT · throttling        │
└───────────┬────────────┘                       └─────┬──────────────┬─────┘
            │ static fallback                          │              │
            ▼                                          ▼              ▼
   curated demo catalogs                           MongoDB      Google Gemini
   (libs/data)                                                  (AI assistant)
```

### Resilient catalog data

The catalog pages stay complete even without a running API:

1. `/tours`, `/hotels`, `/rentcar` and `/flights` query GraphQL with `errorPolicy: 'all'`.
2. When the API returns data, results are mapped by `libs/data/packageApi.ts` and `libs/data/flights.ts`.
3. When the API is empty or unreachable, the UI falls back to curated datasets in `libs/data/packages.ts` and `libs/data/flights.ts`.
4. Detail pages resolve demo IDs from the static catalog first and query the API for everything else.

Demos, reviews and local UI work therefore run without requiring an active backend service.

---

## Getting started

### Prerequisites

- Node.js 18.17+ (20 LTS recommended)
- [Yarn](https://yarnpkg.com/) 1.x
- Optional: the Velora API backend on port `3003` for live data, accounts and the AI assistant

### Install and run

```bash
git clone https://github.com/NazirovMukhammadali/velora-web.git
cd velora-web
yarn install
cp .env.example .env
yarn dev
```

Open **http://localhost:3000**.

### Environment variables

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3003
NEXT_PUBLIC_API_GRAPHQL_URL=http://127.0.0.1:3003/graphql
```

Legacy `REACT_APP_*` names are still read for backward compatibility.

### Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Development server with hot reload |
| `yarn build` | Production build |
| `yarn start:prod` | Serve the production build on port 3000 |
| `yarn lint` | ESLint |
| `yarn typecheck` | TypeScript type check |
| `yarn test` | Jest unit tests |

---

## Project structure

```text
pages/                  Next.js routes (catalogs, details, community, admin, auth)
libs/
  components/           UI: layout, homepage, catalogs, assistant, admin, community
  hooks/                useAuth, useCatalogQuery, usePackageCatalog, usePagedItems, …
  data/                 Static catalogs and API mappers
  utils/                Search, suggestions, referrer, assistant helpers
  config/               SEO and app configuration
apollo/                 Apollo client, queries, mutations, reactive store
scss/                   Design tokens (variables.scss) and page styles with responsive @media
public/                 Static assets and locales
__tests__/              Jest unit tests
```

| Concern | Entry point |
|---------|-------------|
| Home layout and hero | `libs/components/layout/LayoutHome.tsx`, `libs/components/homepage/HeaderFilter.tsx` |
| Inner page layout | `libs/components/layout/LayoutBasic.tsx` |
| Navigation | `libs/components/layout/VeloraNavbar.tsx` |
| AI assistant | `libs/components/Chat.tsx`, `libs/components/assistant/` |
| Catalog data pipeline | `libs/hooks/usePackageCatalog.ts`, `libs/hooks/useCatalogQuery.ts` |
| Design tokens | `scss/variables.scss` |

---

## Documentation

- **[docs/DESIGN.md](./docs/DESIGN.md)** — UI design system, color palette, and component architecture
- **[AGENTS.md](./AGENTS.md)** — contributor workflow, design rules and file map
- **[CHANGELOG.md](./CHANGELOG.md)** — version history

Brand colors: `$velora-primary` `#5b3df5` and `$velora-accent` `#ff6b2c` (`scss/variables.scss`).
