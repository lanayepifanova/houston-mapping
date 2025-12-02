import { apiGet } from "./api";

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
  };
};

export const fetchFirms = () => apiGet<{ features: FirmFeature[] }>("/firms");
