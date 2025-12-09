# Houston Mapping – Rice Residency

## Setup
- Quick start
  - cd houston-mapping
  - ./rice-residency-rocks

- Manual:.
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
