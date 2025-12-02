import { listStartups } from "./repo";
import { StartupFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getStartupFeatures = async (): Promise<StartupFeature[]> => {
  const data = await listStartups();
  return data.map(toGeoJson);
};
