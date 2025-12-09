import { Startup, StartupFeature } from "./types";

export const toGeoJson = (startup: Startup): StartupFeature => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [startup.location.lng, startup.location.lat]
  },
  properties: {
    id: startup.id,
    name: startup.name,
    website: startup.website,
    description: startup.description,
    tags: startup.tags,
    stage: startup.stage,
    industry: startup.industry,
    deletedAt: startup.deletedAt
  }
});
