import { Request, Response } from "express";
import { addCommunity, getCommunityFeatures } from "./service";

export const listCommunityFeatures = async (_req: Request, res: Response) => {
  const data = await getCommunityFeatures();
  res.json({ features: data });
};

export const createCommunityHandler = async (req: Request, res: Response) => {
  const { name, website, description, tags, category, latitude, longitude, address } = req.body;

  if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "name, latitude, and longitude are required" });
  }

  const tagList = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : typeof tags === "string"
    ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const created = await addCommunity({
    name,
    website,
    description,
    tags: tagList,
    category,
    latitude,
    longitude,
    address
  });

  res.status(201).json(created);
};
