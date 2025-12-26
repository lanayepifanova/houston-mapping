export const AddCommunityForm = () => (
  <div className="rounded-xl border border-black bg-white p-4 space-y-2">
    <h2 className="text-xl font-semibold">Read-only dataset</h2>
    <p className="text-sm text-neutral-700">
      Communities are bundled into the static data. To adjust them, edit the seed files in
      <code> backend/src/db/seeds</code> or modify <code>frontend/public/data</code>, then run
      <code> cd backend && pnpm ts-node scripts/export-static-data.ts</code> before rebuilding.
    </p>
  </div>
);
