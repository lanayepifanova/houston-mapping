export const AddFirmForm = () => (
  <div className="rounded-xl border border-black bg-white p-4 space-y-2">
    <h2 className="text-xl font-semibold">Read-only dataset</h2>
    <p className="text-sm text-neutral-700">
      This static build ships with the curated seed data. To propose edits, update the seed files
      in <code>backend/src/db/seeds</code> or edit the JSON in <code>frontend/public/data</code>,
      then run <code>cd backend && pnpm ts-node scripts/export-static-data.ts</code> before
      rebuilding.
    </p>
  </div>
);
