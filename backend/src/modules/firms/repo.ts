import { getPrisma } from "../../db/client";
import { CreateFirmInput, Firm } from "./types";

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

export const listFirms = async (): Promise<Firm[]> => {
  const rows = await prisma.firm.findMany({ orderBy: { name: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    tags: parseTags(row.tags),
    fundSize: row.fundSize ?? undefined,
    stageFocus: row.stageFocus ?? undefined,
    location: {
      lat: row.latitude,
      lng: row.longitude,
      address: row.address ?? undefined
    }
  }));
};

export const createFirm = async (input: CreateFirmInput): Promise<Firm> => {
  const created = await prisma.firm.create({
    data: {
      name: input.name,
      website: input.website,
      description: input.description,
      tags: JSON.stringify(input.tags ?? []),
      fundSize: input.fundSize,
      stageFocus: input.stageFocus,
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
    fundSize: created.fundSize ?? undefined,
    stageFocus: created.stageFocus ?? undefined,
    location: {
      lat: created.latitude,
      lng: created.longitude,
      address: created.address ?? undefined
    }
  };
};
