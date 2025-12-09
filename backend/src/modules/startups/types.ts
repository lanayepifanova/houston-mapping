import { z } from "zod";

export type Startup = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  stage?: string;
  industry?: string;
  deletedAt?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type StartupFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Omit<Startup, "location">;
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

export const createStartupSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  description: z.string().max(1000).optional(),
  tags: tagArraySchema,
  stage: z.string().optional(),
  industry: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional()
});

export type CreateStartupInput = z.infer<typeof createStartupSchema>;
