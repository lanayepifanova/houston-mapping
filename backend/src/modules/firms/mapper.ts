import { Firm, FirmFeature } from "./types";

export const toGeoJson = (firm: Firm): FirmFeature => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [firm.location.lng, firm.location.lat]
  },
  properties: {
    id: firm.id,
    name: firm.name,
    website: firm.website,
    description: firm.description,
    tags: firm.tags,
    fundSize: firm.fundSize,
    stageFocus: firm.stageFocus,
    deletedAt: firm.deletedAt
  }
});
