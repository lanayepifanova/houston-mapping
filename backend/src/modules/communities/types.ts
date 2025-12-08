import { z } from "zod";

export type Community = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  tags: string[];
  category?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export type CommunityFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Omit<Community, "location">;
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

export const createCommunitySchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  description: z.string().max(1000).optional(),
  tags: tagArraySchema,
  category: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional()
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
