# Houston Mapping
  
  1. Build locally

  - cd backend && pnpm ts-node scripts/export-static-data.ts (refresh JSON)
  - cd frontend && pnpm install && pnpm build
  - Output: frontend/dist/

  2. Deploy

  - Netlify: drag-drop frontend/dist in the UI, or netlify deploy --prod
    --dir=frontend/dist if you use the CLI.
  - Cloudflare Pages: new project → “Direct upload” → upload frontend/dist (or connect
    the repo and set build command cd backend && pnpm ts-node scripts/export-static-
    data.ts && cd ../frontend && pnpm install && pnpm build, output dir frontend/
    dist).
  - GitHub Pages: push frontend/dist to a gh-pages branch or use a GitHub Action that
    builds then uploads frontend/dist as the Pages artifact. If using Pages under
    a subpath, set vite.config.ts base: "/your-subpath/" so /data/*.json resolves
    correctly.

  That’s it—no server/DB required.
