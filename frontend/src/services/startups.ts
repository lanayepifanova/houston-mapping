import { apiGet } from "./api";
import type { FeatureCollection } from "./firms";

export type StartupFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: string;
    name: string;
    website?: string;
    description?: string;
    tags: string[];
    stage?: string;
    industry?: string;
    deletedAt?: string;
  };
};

export const fetchStartups = () => apiGet<FeatureCollection<StartupFeature>>("startups");
