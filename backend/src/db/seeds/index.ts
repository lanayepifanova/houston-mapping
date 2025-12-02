// Placeholder seed entrypoint. Replace with per-module seed scripts.
export const seed = async () => {
  // No-op for now.
};

if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
