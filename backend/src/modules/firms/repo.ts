import { Firm } from "./types.js";

// Placeholder in-memory data. Replace with Prisma queries.
const firms: Firm[] = [
  {
    id: "firm-1",
    name: "Bayou Capital",
    website: "https://example.com",
    description: "Early-stage VC focused on Houston founders.",
    tags: ["seed", "houston"],
    fundSize: "$50M",
    stageFocus: "Seed-Series A",
    location: { lat: 29.7604, lng: -95.3698, address: "Houston, TX" }
  }
];

export const listFirms = async (): Promise<Firm[]> => firms;
