import { Prisma } from "@prisma/client";
import { getPrisma } from "../../db/client";
import { NotFoundError } from "../../core/errors";
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
  const rows = await prisma.firm.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    tags: parseTags(row.tags),
    fundSize: row.fundSize ?? undefined,
    stageFocus: row.stageFocus ?? undefined,
    deletedAt: row.deletedAt?.toISOString(),
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
    deletedAt: created.deletedAt?.toISOString(),
    location: {
      lat: created.latitude,
      lng: created.longitude,
      address: created.address ?? undefined
    }
  };
};

export const deleteFirm = async (id: string): Promise<void> => {
  try {
    await prisma.firm.update({ where: { id }, data: { deletedAt: new Date() } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Firm not found");
    }
    throw err;
  }
};

export const listDeletedFirms = async (): Promise<Firm[]> => {
  const rows = await prisma.firm.findMany({
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
    fundSize: row.fundSize ?? undefined,
    stageFocus: row.stageFocus ?? undefined,
    deletedAt: row.deletedAt?.toISOString(),
    location: {
      lat: row.latitude,
      lng: row.longitude,
      address: row.address ?? undefined
    }
  }));
};

export const restoreFirm = async (id: string): Promise<Firm> => {
  try {
    const restored = await prisma.firm.update({
      where: { id },
      data: { deletedAt: null }
    });

    return {
      id: restored.id,
      name: restored.name,
      website: restored.website ?? undefined,
      description: restored.description ?? undefined,
      tags: parseTags(restored.tags),
      fundSize: restored.fundSize ?? undefined,
      stageFocus: restored.stageFocus ?? undefined,
      deletedAt: restored.deletedAt?.toISOString(),
      location: {
        lat: restored.latitude,
        lng: restored.longitude,
        address: restored.address ?? undefined
      }
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Firm not found");
    }
    throw err;
  }
};
