import { PrismaClient } from "@prisma/client";
import { seedFirms } from "./firms";
import { seedCommunities } from "./communities";
import { seedStartups } from "./startups";

const prisma = new PrismaClient();

export const seed = async () => {
  await seedFirms(prisma);
  await seedCommunities(prisma);
  await seedStartups(prisma);
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
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
