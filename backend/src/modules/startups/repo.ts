import { Startup } from "./types.js";

const startups: Startup[] = [
  {
    id: "startup-1",
    name: "Space City Labs",
    website: "https://example.org",
    description: "Geo tools for Houston industries.",
    tags: ["geospatial", "series-a"],
    stage: "Series A",
    industry: "Mapping",
    location: { lat: 29.7499, lng: -95.3584, address: "Houston, TX" }
  }
];

export const listStartups = async (): Promise<Startup[]> => startups;
