import { z } from "zod";

export type Firm = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  fundSize?: string;
  stageFocus?: string;
  deletedAt?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type FirmFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Omit<Firm, "location">;
};

const tagArraySchema = z
  .preprocess((value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return [];
  }, z.array(z.string().min(1)).max(30))
  .default([]);

export const createFirmSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  description: z.string().max(1000).optional(),
  tags: tagArraySchema,
  fundSize: z.string().optional(),
  stageFocus: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional()
});

export type CreateFirmInput = z.infer<typeof createFirmSchema>;
