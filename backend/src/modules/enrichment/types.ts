import { z } from "zod";

export const geocodeRequestSchema = z.object({
  address: z.string().min(3, "address required")
});

export type GeocodeRequest = z.infer<typeof geocodeRequestSchema>;

export type GeocodeResult = {
  address: string;
  lat: number;
  lng: number;
  precision: "rooftop" | "approximate";
  source: "mock";
};

export const metadataRequestSchema = z.object({
  url: z.string().url("Valid URL required")
});

export type MetadataRequest = z.infer<typeof metadataRequestSchema>;

export type MetadataResult = {
  url: string;
  allowed: boolean;
  blockedByRobots: boolean;
  title?: string;
  description?: string;
  keywords?: string[];
};
