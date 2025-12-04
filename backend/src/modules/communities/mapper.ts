import { Community, CommunityFeature } from "./types";

export const toGeoJson = (community: Community): CommunityFeature => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [community.location.lng, community.location.lat]
  },
  properties: {
    id: community.id,
    name: community.name,
    website: community.website,
    description: community.description,
    tags: community.tags,
    category: community.category
  }
});
