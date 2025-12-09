# Houston Mapping – Rice Residency

## Setup

- Prereqs: Node 20+, pnpm (or npm), SQLite.
- Quick start from repo root: `./rice-residency-rocks` (creates `.env`s, installs deps, starts backend on `${PORT:-4000}` and frontend on 5173, then opens the app).
- Manual:
  - `cp backend/.env.example backend/.env` and set ports/db paths.
  - `cp frontend/.env.example frontend/.env` and set `VITE_API_URL` (defaults to `http://localhost:4000/api`).
  - `cd backend && pnpm prisma migrate dev` (seed with `pnpm run seed` if desired).
  - Run: backend `pnpm dev`, frontend `pnpm dev`, visit http://localhost:5173.

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
