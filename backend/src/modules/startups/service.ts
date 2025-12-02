import { createStartup, listStartups } from "./repo";
import { CreateStartupInput, StartupFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getStartupFeatures = async (): Promise<StartupFeature[]> => {
  const data = await listStartups();
  return data.map(toGeoJson);
};

export const addStartup = async (input: CreateStartupInput): Promise<StartupFeature> => {
  const startup = await createStartup(input);
  return toGeoJson(startup);
};
