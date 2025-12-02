import { PrismaClient } from "@prisma/client";

const startups = [
  {
    id: "startup-space-city-labs",
    name: "Space City Labs",
    website: "https://spacecitylabs.com",
    description: "Geo tools for Houston logistics and energy.",
    tags: ["geospatial", "energy", "saas"],
    stage: "Series A",
    industry: "Mapping",
    latitude: 29.7499,
    longitude: -95.3584,
    address: "EaDo, Houston, TX"
  },
  {
    id: "startup-bayou-bio",
    name: "Bayou Bio",
    website: "https://bayoubio.com",
    description: "Wet lab automation for gulf coast biomanufacturing.",
    tags: ["biotech", "automation", "seed"],
    stage: "Seed",
    industry: "Biotech",
    latitude: 29.7045,
    longitude: -95.4018,
    address: "Texas Medical Center"
  },
  {
    id: "startup-metro-mobility",
    name: "Metro Mobility",
    website: "https://metromobility.ai",
    description: "AI routing for freight along the I-45 corridor.",
    tags: ["logistics", "ai", "transport"],
    stage: "Pre-Seed",
    industry: "Logistics",
    latitude: 29.7847,
    longitude: -95.3355,
    address: "Northside, Houston, TX"
  }
];

export const seedStartups = async (prisma: PrismaClient) => {
  for (const startup of startups) {
    await prisma.startup.upsert({
      where: { id: startup.id },
      update: { ...startup, tags: JSON.stringify(startup.tags) },
      create: { ...startup, tags: JSON.stringify(startup.tags) }
    });
  }
};
