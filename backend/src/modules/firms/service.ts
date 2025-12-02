import { listFirms } from "./repo";
import { FirmFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getFirmFeatures = async (): Promise<FirmFeature[]> => {
  const firms = await listFirms();
  return firms.map(toGeoJson);
};
