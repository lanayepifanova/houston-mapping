import { apiGet } from "./api";

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
  };
};

export const fetchStartups = () => apiGet<{ features: StartupFeature[] }>("/startups");
