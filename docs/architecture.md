# Architecture – Houston Mapping

## Goals
- Map Houston VC firms and startups with fast search, tagging, and a Leaflet-based map.
- Keep modules small (<200 lines per file) so AI tools and sandboxes remain responsive.
- Be network-optional: app runs fully on local SQLite; external APIs are pluggable.

## Static mode
- Current deployments are static-only. Data is exported from the seed files into `frontend/public/data/*.json`
  via `cd backend && pnpm ts-node scripts/export-static-data.ts`, then served as part of the frontend build.
- The backend codebase and Prisma schema remain for data authoring but are not required in production.

## Principles
- Feature slices: each domain (firms, startups, search) owns routes, validation, services, and types.
- Thin HTTP layer: controllers translate HTTP <> service calls; no heavy logic in routers.
- Data contracts: shared DTOs and Prisma types keep frontend/backed in sync.
- Isolation: providers for third-party APIs live behind interfaces to allow offline mocks.
- Deterministic dev: seeds and fixtures live in `backend/src/db/seeds` for quick resets.

## Repository layout (detailed)
```
backend/
  src/
    core/
      server.ts        # Express bootstrap, middleware wiring
      config.ts        # Env parsing, ports, database paths
      logger.ts        # Minimal logger abstraction
      errors.ts        # Typed errors + error handler middleware
    api/
      index.ts         # Root router composing feature routers
      health.routes.ts # Health/liveness
    modules/
      firms/
        routes.ts      # Express router for firms
        controller.ts  # HTTP-level logic
        service.ts     # Business rules and queries
        repo.ts        # Prisma queries for firms
        types.ts       # DTOs and validators (zod/typebox)
        mapper.ts      # Map DB rows -> API DTO -> GeoJSON
      startups/        # Same shape as firms
      search/
        routes.ts      # `/search` endpoint placeholder
        provider.ts    # OpenAI adapter (later)
        cache.ts       # SQLite-backed cache (optional)
    db/
      client.ts        # Prisma client factory
      seeds/           # Seed data split by feature
  prisma/
    schema.prisma      # Models + SQLite datasource
frontend/
  src/
    app/               # Layout, router, providers
    features/
      map/             # Leaflet map, markers, popovers
      firms/           # List/detail views for firms
      startups/        # List/detail views for startups
      search/          # Smart search UI and filters
    services/
      api.ts           # Fetch wrapper with base URL + retry
      firms.ts         # Typed queries/mutations
      startups.ts
      search.ts
    hooks/             # Shared hooks (useDebounce, useGeoLocation)
    styles/            # Tailwind config, tokens, global.css
    components/        # Reusable UI atoms
docs/
  architecture.md      # This file
```

## Backend design
- Express + TypeScript: `server.ts` wires middleware (JSON parser, CORS, request logging, error handler) and attaches the root router.
- Validation: prefer `zod` or `@sinclair/typebox` to validate request bodies and query params per route. Keep schemas adjacent to controllers.
- Services: hold business rules (e.g., dedupe tags, geocoding checks, filtering). Services receive typed inputs and call repositories.
- Repositories: Prisma queries only; no HTTP or business logic.
- Errors: use typed errors (e.g., `NotFoundError`, `ValidationError`) with a single error handler middleware to map to status codes.
- GeoJSON output: map DB rows to `{ type: "Feature", geometry, properties }` to keep map rendering simple.
- Search module: start as a local filter (name/tags). When OpenAI is enabled, swap `provider.ts` to call the API and store embeddings in SQLite.

### Request lifecycle
`Router -> Controller -> Validation -> Service -> Repository (Prisma) -> DTO mapper -> Response`
- Keep each step focused; if a file nears 200 lines, extract helpers or split routers by resource.

### Data model (initial draft)
- `Firm`: `id`, `name`, `website`, `description`, `tags[]`, `fund_size`, `stage_focus`, `location { lat, lng, address }`.
- `Startup`: `id`, `name`, `website`, `description`, `tags[]`, `stage`, `industry`, `location { lat, lng, address }`.
- `Tag` (optional table): reusable labels to normalize filters.
- Store coordinates as decimals in Prisma; project to GeoJSON in mappers.

## Frontend design
- Vite + React + TypeScript + Tailwind. Use functional components with hooks; avoid monolith pages.
- State management: React Query for server data (caching, retries) and local component state for filters and map interaction.
- Routing: `app/router.tsx` maps views (Map, Firms list, Startups list, Search).
- Map feature: Leaflet map component reads GeoJSON arrays; markers show popovers with quick actions (open website, copy address).
- Styling: Tailwind utilities plus small design tokens (colors, spacing) to keep consistency without heavy CSS files.
- Accessibility: keyboard focus for map controls, ARIA labels on search/filter inputs.

## Data flow
- Backend exposes REST endpoints: `/api/health`, `/api/firms`, `/api/startups`, `/api/search`.
- Frontend services call these endpoints via a thin `api.ts` wrapper with base URL and timeout.
- Map component consumes `/firms` and `/startups` GeoJSON to render markers; lists use the same data to stay in sync.

## Sandbox-friendly practices
- No file >200 lines; split routers and components early.
- No network calls without explicit provider modules; default search stays local.
- SQLite DB lives under `backend/data/` to avoid permission issues; path comes from env.
- Avoid global installs; use local `pnpm` scripts. Keep `node_modules` out of commits.
- Deterministic seeds allow offline population and fast resets for AI/autonomous agents.

## Testing
- Unit tests per module (`__tests__` adjacent to code); mock Prisma in repo tests.
- Integration tests spin up the Express app with an in-memory SQLite DB (Prisma supports `file:memory:?cache=shared`).
- Frontend tests with Vitest + React Testing Library; add map smoke tests to ensure Leaflet renders markers.

## Extensibility roadmap
- Add OpenAI embeddings in `search/provider.ts`; store vectors in SQLite or upgrade to Postgres if needed.
- Add geocoding provider behind `location/provider.ts` to enrich addresses (optional).
- Add role-based admin routes to manage entries securely.
