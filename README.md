# Houston Mapping – Rice Residency

Map Houston venture capital firms and startups for the Rice Residency hacker house. The stack is intentionally modular so AI development tools and sandboxed environments can work safely (small files, clear boundaries, no giant binaries).

- Backend: Node.js, Express, TypeScript
- Database/ORM: SQLite (local) + Prisma
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Maps: Leaflet
- Planned: OpenAI API for smart search and auto-tagging

## Repository layout

```
backend/
  src/
    api/          # Route registration per feature (kept small)
    modules/      # Feature slices: firms, startups, health, search
    core/         # Server bootstrap, middleware, config
    db/           # Prisma client + seeds
  prisma/
    schema.prisma # Data model (split if it grows)
frontend/
  src/
    app/          # App shell, router, layout
    features/     # Firms, startups, map, search components
    services/     # API clients, hooks
    styles/       # Tailwind config, design tokens
docs/
  architecture.md
```

## Getting started

1) Prereqs: Node 20+, pnpm (or npm), SQLite available locally.
2) Install deps:
 - `cd backend && pnpm install`
 - `cd ../frontend && pnpm install`
3) One-command local dev (recommended):
   - From repo root: `chmod +x dev.sh` (first time), then `./dev.sh`
   - Script does: ensure `.env` files exist (copies examples if missing), installs deps, starts backend and frontend, opens http://localhost:5173
4) Manual setup (if you prefer):
   - Environment:
     - Copy `backend/.env.example` to `.env` and set ports/db paths.
     - Copy `frontend/.env.example` to `.env` and set `VITE_API_URL` (defaults to backend at `http://localhost:4000/api`).
     - OpenAI keys are optional until smart search ships.
   - Database:
     - `cd backend && pnpm prisma migrate dev`
     - Seed starter data: `pnpm run seed` (optional).
   - Run:
     - Backend: `pnpm dev` (Express with TS watch).
     - Frontend: `pnpm dev` (Vite + React + Tailwind).
     - Visit http://localhost:5173

## Conventions

- Keep files under 200 lines; split helpers/services early.
- Favor feature slices: each module owns its routes, validation, service, and types.
- No secret data checked in; use `.env`. SQLite files stay in `backend/data/`.
- Write typed contracts: shared DTOs in `backend/src/modules/*/types.ts`.
- API schema stays simple: REST endpoints for firms/startups; search endpoint can proxy OpenAI later.

## Testing and linting

- Backend: `pnpm test` (Jest/Vitest) and `pnpm lint`.
- Frontend: `pnpm test` and `pnpm lint`.
- Formatting: `pnpm format` (Prettier + ESLint).

## Maps and data model

- Leaflet renders base map with markers for firms and startups.
- Each entity: name, category (vc/startup), tags, website, location (lat/lng), description, stage/fund size.
- Server returns GeoJSON-friendly payloads to keep the frontend mapping simple.

## Smart search (planned)

- Add `/search` endpoint calling OpenAI embeddings/metadata once keys exist.
- Keep provider isolated in `backend/src/modules/search/provider.ts` to avoid sandbox/network surprises.
- Cache responses locally (SQLite table) to minimize repeated calls.

## Deployment notes

- Target small containers: backend and frontend can be built separately.
- SQLite for local; swap to Postgres in production by updating Prisma schema and env.
- Avoid hard-coded absolute paths so sandboxes and CI agents stay happy.
