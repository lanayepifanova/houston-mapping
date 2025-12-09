import { createStartup, deleteStartup, listDeletedStartups, listStartups, restoreStartup } from "./repo";
import { CreateStartupInput, StartupFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getStartupFeatures = async (): Promise<StartupFeature[]> => {
  const data = await listStartups();
  return data.map(toGeoJson);
};

export const getDeletedStartupFeatures = async (): Promise<StartupFeature[]> => {
  const data = await listDeletedStartups();
  return data.map(toGeoJson);
};

export const addStartup = async (input: CreateStartupInput): Promise<StartupFeature> => {
  const startup = await createStartup(input);
  return toGeoJson(startup);
};

export const removeStartup = async (id: string): Promise<void> => {
  await deleteStartup(id);
};

export const restoreStartupById = async (id: string): Promise<StartupFeature> => {
  const startup = await restoreStartup(id);
  return toGeoJson(startup);
};
