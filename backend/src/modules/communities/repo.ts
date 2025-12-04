import { getPrisma } from "../../db/client";
import { Community, CreateCommunityInput } from "./types";

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

export const listCommunities = async (): Promise<Community[]> => {
  const rows = await prisma.community.findMany({ orderBy: { name: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    tags: parseTags(row.tags),
    category: row.category ?? undefined,
    location: {
      lat: row.latitude,
      lng: row.longitude,
      address: row.address ?? undefined
    }
  }));
};

export const createCommunity = async (input: CreateCommunityInput): Promise<Community> => {
  const created = await prisma.community.create({
    data: {
      name: input.name,
      website: input.website,
      description: input.description,
      tags: JSON.stringify(input.tags ?? []),
      category: input.category,
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
    category: created.category ?? undefined,
    location: {
      lat: created.latitude,
      lng: created.longitude,
      address: created.address ?? undefined
    }
  };
};
