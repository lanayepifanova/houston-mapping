import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../core/errors";
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
  const rows = await prisma.startup.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    tags: parseTags(row.tags),
    stage: row.stage ?? undefined,
    industry: row.industry ?? undefined,
    deletedAt: row.deletedAt?.toISOString(),
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
    deletedAt: created.deletedAt?.toISOString(),
    location: {
      lat: created.latitude,
      lng: created.longitude,
      address: created.address ?? undefined
    }
  };
};

export const deleteStartup = async (id: string): Promise<void> => {
  try {
    await prisma.startup.update({ where: { id }, data: { deletedAt: new Date() } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Startup not found");
    }
    throw err;
  }
};

export const listDeletedStartups = async (): Promise<Startup[]> => {
  const rows = await prisma.startup.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: "desc" },
    take: 20
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    tags: parseTags(row.tags),
    stage: row.stage ?? undefined,
    industry: row.industry ?? undefined,
    deletedAt: row.deletedAt?.toISOString(),
    location: {
      lat: row.latitude,
      lng: row.longitude,
      address: row.address ?? undefined
    }
  }));
};

export const restoreStartup = async (id: string): Promise<Startup> => {
  try {
    const restored = await prisma.startup.update({ where: { id }, data: { deletedAt: null } });

    return {
      id: restored.id,
      name: restored.name,
      website: restored.website ?? undefined,
      description: restored.description ?? undefined,
      tags: parseTags(restored.tags),
      stage: restored.stage ?? undefined,
      industry: restored.industry ?? undefined,
      deletedAt: restored.deletedAt?.toISOString(),
      location: {
        lat: restored.latitude,
        lng: restored.longitude,
        address: restored.address ?? undefined
      }
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Startup not found");
    }
    throw err;
  }
};
