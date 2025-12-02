import { Request, Response } from "express";
import { addFirm, getFirmFeatures } from "./service";

export const listFirmFeatures = async (_req: Request, res: Response) => {
  const data = await getFirmFeatures();
  res.json({ features: data });
};

export const createFirmHandler = async (req: Request, res: Response) => {
  const { name, website, description, tags, fundSize, stageFocus, latitude, longitude, address } = req.body;
  if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "name, latitude, and longitude are required" });
  }

  const tagList = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : typeof tags === "string"
    ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const created = await addFirm({
    name,
    website,
    description,
    tags: tagList,
    fundSize,
    stageFocus,
    latitude,
    longitude,
    address
  });

  res.status(201).json(created);
};
