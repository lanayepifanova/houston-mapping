import { Request, Response } from "express";
import { getStartupFeatures } from "./service";

export const listStartupFeatures = async (_req: Request, res: Response) => {
  const data = await getStartupFeatures();
  res.json({ features: data });
};
