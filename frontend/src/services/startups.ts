import { apiDelete, apiGet, apiPost } from "./api";

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

export const fetchStartups = () => apiGet<{ features: StartupFeature[] }>("/startups");
export const fetchDeletedStartups = () => apiGet<{ features: StartupFeature[] }>("/startups/deleted");

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

export const deleteStartup = (id: string) => apiDelete(`/startups/${id}`);
export const restoreStartup = (id: string) => apiPost<StartupFeature>(`/startups/${id}/restore`, {});
