import { createFirm, listFirms } from "./repo";
import { CreateFirmInput, FirmFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getFirmFeatures = async (): Promise<FirmFeature[]> => {
  const firms = await listFirms();
  return firms.map(toGeoJson);
};

export const addFirm = async (input: CreateFirmInput): Promise<FirmFeature> => {
  const firm = await createFirm(input);
  return toGeoJson(firm);
};
