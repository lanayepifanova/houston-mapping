import { apiDelete, apiGet, apiPost } from "./api";

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

export const fetchFirms = () => apiGet<{ features: FirmFeature[] }>("/firms");
export const fetchDeletedFirms = () => apiGet<{ features: FirmFeature[] }>("/firms/deleted");

export type CreateFirmPayload = {
  name: string;
  website?: string;
  description?: string;
  tags?: string[];
  fundSize?: string;
  stageFocus?: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export const createFirm = (payload: CreateFirmPayload) => apiPost<FirmFeature>("/firms", payload);

export const deleteFirm = (id: string) => apiDelete(`/firms/${id}`);
export const restoreFirm = (id: string) => apiPost<FirmFeature>(`/firms/${id}/restore`, {});
