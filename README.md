# Velora Web

Travel booking frontend — flights, hotels, rent-a-car, tours, agents, and community.  
Backend: Nestar GraphQL API (see `.env.example`).

## Quick start

```bash
yarn install
cp .env.example .env   # adjust API URLs if needed
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Development:** `yarn dev` (hot reload)
- **Production build:** `yarn build` then `yarn start:prod`

Default API: `http://127.0.0.1:3007/graphql`

## For AI agents / contributors

Read these before changing UI or layout:

- **[AGENTS.md](./AGENTS.md)** — workflow, design rules, file map, common mistakes
- **[docs/DESIGN.md](./docs/DESIGN.md)** — full UI spec (Nestar + Kayak + Tourex mix)

### Workflow (required)

1. One phase = one focused change
2. Tell the user: *"Bosqich tugadi. Commit qiling va keyingi bosqichga ruxsat bering"*
3. Next phase only after user commits and approves
4. Do not commit unless the user asks

## Project structure (high level)

| Area | Path |
|------|------|
| Pages | `pages/` |
| Components | `libs/components/` |
| Layouts | `libs/components/layout/` (`LayoutHome`, `LayoutBasic`, `VeloraNavbar`) |
| Home hero | `libs/components/homepage/HeaderFilter.tsx` |
| Styles | `scss/pc/`, `scss/mobile/` |
| GraphQL | `apollo/` |

## Version

See [CHANGELOG.md](./CHANGELOG.md).
