import { apiGet } from "./api";

export type FeatureCollection<T> = {
  type: string;
  features: T[];
};

export type FirmFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: string;
    name: string;
    website?: string;
    description?: string;
    tags: string[];
    fundSize?: string;
    stageFocus?: string;
    deletedAt?: string;
  };
};

export const fetchFirms = () => apiGet<FeatureCollection<FirmFeature>>("firms");
