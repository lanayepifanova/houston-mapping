import { apiGet } from "./api";
import type { FeatureCollection } from "./firms";

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

export const fetchCommunities = () => apiGet<FeatureCollection<CommunityFeature>>("communities");
