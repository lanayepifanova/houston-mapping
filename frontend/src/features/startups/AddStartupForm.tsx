export const AddStartupForm = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
    <h2 className="text-xl font-semibold">Read-only dataset</h2>
    <p className="text-sm text-slate-600">
      The hosted site is static. To add or edit startups, update the seeds in
      <code> backend/src/db/seeds</code> or tweak the JSON under <code>frontend/public/data</code>,
      then run <code>cd backend && pnpm ts-node scripts/export-static-data.ts</code> before the next
      build.
    </p>
  </div>
);
