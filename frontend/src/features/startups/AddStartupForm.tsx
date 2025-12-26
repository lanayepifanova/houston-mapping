export const AddStartupForm = () => (
  <div className="rounded-xl border border-black bg-white p-4 space-y-2">
    <h2 className="text-xl font-semibold">Read-only dataset</h2>
    <p className="text-sm text-neutral-700">
      The hosted site is static. To add or edit startups, update the seeds in
      <code> backend/src/db/seeds</code> or tweak the JSON under <code>frontend/public/data</code>,
      then run <code>cd backend && pnpm ts-node scripts/export-static-data.ts</code> before the next
      build.
    </p>
  </div>
);
