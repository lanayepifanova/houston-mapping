import { Request, Response } from "express";
import { addStartup, getStartupFeatures } from "./service";

export const listStartupFeatures = async (_req: Request, res: Response) => {
  const data = await getStartupFeatures();
  res.json({ features: data });
};

export const createStartupHandler = async (req: Request, res: Response) => {
  const { name, website, description, tags, stage, industry, latitude, longitude, address } = req.body;

  if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "name, latitude, and longitude are required" });
  }

  const tagList = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : typeof tags === "string"
    ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const created = await addStartup({
    name,
    website,
    description,
    tags: tagList,
    stage,
    industry,
    latitude,
    longitude,
    address
  });

  res.status(201).json(created);
};
