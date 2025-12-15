import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { firmSeedData } from "../src/db/seeds/firms";
import { startupSeedData } from "../src/db/seeds/startups";
import { communitySeedData } from "../src/db/seeds/communities";

type Feature<T> = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: T;
};

type SearchIndexItem = {
  id: string;
  kind: "firm" | "startup" | "community";
  name: string;
  description?: string;
  website?: string;
  tags: string[];
  stage?: string;
  category?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

const rootDir = path.resolve(__dirname, "..", "..");
const outputDir = path.resolve(rootDir, "frontend", "public", "data");

const toFeature = <T extends { id: string; name: string; website?: string; description?: string; tags: string[]; latitude: number; longitude: number }>(
  item: T,
  extra: Record<string, unknown> = {}
): Feature<Record<string, unknown>> => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [item.longitude, item.latitude]
  },
  properties: {
    id: item.id,
    name: item.name,
    website: item.website,
    description: item.description,
    tags: item.tags,
    ...extra
  }
});

const writeJson = async (fileName: string, data: unknown) => {
  const filePath = path.join(outputDir, fileName);
  await mkdir(outputDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2));
  return filePath;
};

const buildSearchIndex = (): SearchIndexItem[] => {
  const firms = firmSeedData.map((firm) => ({
    id: firm.id,
    kind: "firm" as const,
    name: firm.name,
    description: firm.description,
    website: firm.website,
    tags: firm.tags,
    stage: firm.stageFocus,
    location: { lat: firm.latitude, lng: firm.longitude, address: firm.address }
  }));

  const startups = startupSeedData.map((startup) => ({
    id: startup.id,
    kind: "startup" as const,
    name: startup.name,
    description: startup.description,
    website: startup.website,
    tags: startup.tags,
    stage: startup.stage,
    location: { lat: startup.latitude, lng: startup.longitude, address: startup.address }
  }));

  const communities = communitySeedData.map((community) => ({
    id: community.id,
    kind: "community" as const,
    name: community.name,
    description: community.description,
    website: community.website,
    tags: community.tags,
    category: community.category,
    location: { lat: community.latitude, lng: community.longitude, address: community.address }
  }));

  return [...firms, ...startups, ...communities];
};

const run = async () => {
  const firmFeatures = firmSeedData.map((firm) =>
    toFeature(firm, { fundSize: firm.fundSize, stageFocus: firm.stageFocus, deletedAt: null })
  );
  const startupFeatures = startupSeedData.map((startup) =>
    toFeature(startup, { stage: startup.stage, industry: startup.industry, deletedAt: null })
  );
  const communityFeatures = communitySeedData.map((community) =>
    toFeature(community, { category: community.category })
  );

  await writeJson("firms.json", { type: "FeatureCollection", features: firmFeatures });
  await writeJson("startups.json", { type: "FeatureCollection", features: startupFeatures });
  await writeJson("communities.json", { type: "FeatureCollection", features: communityFeatures });
  await writeJson("search-index.json", { items: buildSearchIndex() });
};

run()
  .then(() => {
    console.log(`Static data exported to ${outputDir}`);
  })
  .catch((err) => {
    console.error("Failed to export static data", err);
    process.exit(1);
  });
