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

## Static data + build (no backend deploy needed)
- Data lives in `frontend/public/data/*.json`, generated from the seed files in `backend/src/db/seeds`.
- Refresh data before a build: `cd backend && pnpm ts-node scripts/export-static-data.ts`.
- Build the static site: `cd frontend && pnpm install && pnpm build`.
- Deploy `frontend/dist` to any static host (Netlify, GitHub Pages, Cloudflare Pages). No runtime DB or server is required.

## Legacy backend (optional for data authoring)
- The backend folder and Prisma schema remain if you want to edit data in code and re-export to JSON, but hosting now only needs the static frontend.
