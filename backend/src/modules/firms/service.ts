import { createFirm, deleteFirm, listDeletedFirms, listFirms, restoreFirm } from "./repo";
import { CreateFirmInput, FirmFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getFirmFeatures = async (): Promise<FirmFeature[]> => {
  const firms = await listFirms();
  return firms.map(toGeoJson);
};

export const getDeletedFirmFeatures = async (): Promise<FirmFeature[]> => {
  const firms = await listDeletedFirms();
  return firms.map(toGeoJson);
};

export const addFirm = async (input: CreateFirmInput): Promise<FirmFeature> => {
  const firm = await createFirm(input);
  return toGeoJson(firm);
};

export const removeFirm = async (id: string): Promise<void> => {
  await deleteFirm(id);
};

export const restoreFirmById = async (id: string): Promise<FirmFeature> => {
  const firm = await restoreFirm(id);
  return toGeoJson(firm);
};
