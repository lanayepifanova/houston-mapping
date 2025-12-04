import { createCommunity, listCommunities } from "./repo";
import { CreateCommunityInput, CommunityFeature } from "./types";
import { toGeoJson } from "./mapper";

export const getCommunityFeatures = async (): Promise<CommunityFeature[]> => {
  const data = await listCommunities();
  return data.map(toGeoJson);
};

export const addCommunity = async (input: CreateCommunityInput): Promise<CommunityFeature> => {
  const community = await createCommunity(input);
  return toGeoJson(community);
};
