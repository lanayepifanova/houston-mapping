# Houston Mapping – Rice Residency

## Setup
- Quick start
  - cd houston-mapping
    - ./rice-residency-rocks

- Manual
  - cd houston-mapping
    - cd backend && pnpm dev
  - cd houston-mapping
    - cd frontend && pnpm dev

## Repo layout

```
backend/
  src/        # api, modules, core, db
  prisma/     # schema.prisma
frontend/
  src/        # app, features, services, styles
docs/
  architecture.md
dev.sh, rice-residency-rocks  # dev wrapper scripts
```

## Tools

- Backend: Node.js, Express, TypeScript.
- Database/ORM: SQLite + Prisma.
- Frontend: React, Vite, TypeScript, Tailwind CSS.
- Mapping: Leaflet.

## Render deploy notes
- Lockfiles are generated with pnpm 10 (lockfileVersion 9); make sure Render installs the matching pnpm version so the lockfiles are honored.
- Add a persistent disk to the backend service and set `DATABASE_URL=file:/var/data/prod.db` (Render mounts disks at `/var/data`; `/data` is read-only during builds and will throw the Prisma SQLite parent directory error).
- Backend service: set `Root Directory` to `backend`, `Build Command` to `corepack enable && corepack prepare pnpm@10.24.0 --activate && pnpm install --frozen-lockfile && pnpm run build`, and `Start Command` to `pnpm prisma migrate deploy && pnpm start` so migrations run after the disk is mounted.
- Frontend static site: set `Root Directory` to `frontend`, `Build Command` to `corepack enable && corepack prepare pnpm@10.24.0 --activate && pnpm install --frozen-lockfile && pnpm run build`, and `Publish Directory` to `dist`.
