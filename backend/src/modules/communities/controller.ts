import { Request, Response } from "express";
import { addCommunity, getCommunityFeatures } from "./service";
import { CreateCommunityInput } from "./types";

export const listCommunityFeatures = async (_req: Request, res: Response) => {
  const data = await getCommunityFeatures();
  res.json({ features: data });
};

export const createCommunityHandler = async (req: Request, res: Response) => {
  const input = req.body as CreateCommunityInput;
  const created = await addCommunity(input);

  res.status(201).json(created);
};
