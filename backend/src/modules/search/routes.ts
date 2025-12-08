import { Router } from "express";
import { searchProvider } from "./provider";
import { validateQuery } from "../../core/validate";
import { z } from "zod";

const searchQuerySchema = z.object({
  q: z.string().trim().default(""),
  tags: z
    .preprocess((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        return value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      return [];
    }, z.array(z.string()))
    .default([]),
  limit: z
    .preprocess((value) => Number(value), z.number().int().positive().max(50))
    .default(20),
  page: z
    .preprocess((value) => Number(value), z.number().int().positive())
    .default(1)
});

export const searchRouter = Router();

searchRouter.get("/", validateQuery(searchQuerySchema), async (req, res) => {
  const { q, tags, limit, page } = req.query as unknown as { q: string; tags: string[]; limit: number; page: number };
  const results = await searchProvider({ query: q, tags, limit, page });
  res.json(results);
});
