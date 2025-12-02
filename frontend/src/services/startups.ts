import { apiGet } from "./api";
import { apiPost } from "./api";

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

export type CreateStartupPayload = {
  name: string;
  website?: string;
  description?: string;
  tags?: string[];
  stage?: string;
  industry?: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export const createStartup = (payload: CreateStartupPayload) =>
  apiPost<StartupFeature>("/startups", payload);
