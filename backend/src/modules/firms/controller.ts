import { Request, Response } from "express";
import { getFirmFeatures } from "./service";

export const listFirmFeatures = async (_req: Request, res: Response) => {
  const data = await getFirmFeatures();
  res.json({ features: data });
};
