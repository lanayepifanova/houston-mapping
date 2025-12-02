import { getPrisma } from "../../db/client";
import { CreateStartupInput, Startup } from "./types";

const prisma = getPrisma();

const parseTags = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
};

export const listStartups = async (): Promise<Startup[]> => {
  const rows = await prisma.startup.findMany({ orderBy: { name: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    tags: parseTags(row.tags),
    stage: row.stage ?? undefined,
    industry: row.industry ?? undefined,
    location: {
      lat: row.latitude,
      lng: row.longitude,
      address: row.address ?? undefined
    }
  }));
};

export const createStartup = async (input: CreateStartupInput): Promise<Startup> => {
  const created = await prisma.startup.create({
    data: {
      name: input.name,
      website: input.website,
      description: input.description,
      tags: JSON.stringify(input.tags ?? []),
      stage: input.stage,
      industry: input.industry,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address
    }
  });

  return {
    id: created.id,
    name: created.name,
    website: created.website ?? undefined,
    description: created.description ?? undefined,
    tags: parseTags(created.tags),
    stage: created.stage ?? undefined,
    industry: created.industry ?? undefined,
    location: {
      lat: created.latitude,
      lng: created.longitude,
      address: created.address ?? undefined
    }
  };
};
