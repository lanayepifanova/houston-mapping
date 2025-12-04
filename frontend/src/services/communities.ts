import { apiGet, apiPost } from "./api";

export type CommunityFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: string;
    name: string;
    website?: string;
    description?: string;
    tags: string[];
    category?: string;
  };
};

export const fetchCommunities = () => apiGet<{ features: CommunityFeature[] }>("/communities");

export type CreateCommunityPayload = {
  name: string;
  website?: string;
  description?: string;
  tags?: string[];
  category?: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export const createCommunity = (payload: CreateCommunityPayload) =>
  apiPost<CommunityFeature>("/communities", payload);
