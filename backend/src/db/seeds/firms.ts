import { PrismaClient } from "@prisma/client";

const firms = [
  {
    id: "firm-bayou-capital",
    name: "Bayou Capital",
    website: "https://bayou.capital",
    description: "Early-stage VC focused on Houston founders and Gulf Coast energy transition.",
    tags: ["seed", "houston", "energy"],
    fundSize: "$75M",
    stageFocus: "Pre-seed to Series A",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Downtown Houston, TX"
  },
  {
    id: "firm-space-city-ventures",
    name: "Space City Ventures",
    website: "https://spacecity.vc",
    description: "Backs aerospace, defense, and dual-use tech from Houston.",
    tags: ["aerospace", "defense", "series-a"],
    fundSize: "$120M",
    stageFocus: "Seed to Series B",
    latitude: 29.5502,
    longitude: -95.097,
    address: "Houston Spaceport"
  },
  {
    id: "firm-med-center-partners",
    name: "Med Center Partners",
    website: "https://medcenter.partners",
    description: "Life sciences and digital health focused fund near TMC.",
    tags: ["health", "biotech", "digital-health"],
    fundSize: "$60M",
    stageFocus: "Seed to Series A",
    latitude: 29.7114,
    longitude: -95.4018,
    address: "Texas Medical Center"
  }
];

export const seedFirms = async (prisma: PrismaClient) => {
  for (const firm of firms) {
    await prisma.firm.upsert({
      where: { id: firm.id },
      update: { ...firm, tags: JSON.stringify(firm.tags) },
      create: { ...firm, tags: JSON.stringify(firm.tags) }
    });
  }
};
