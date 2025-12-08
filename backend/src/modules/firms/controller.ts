import { Request, Response } from "express";
import { addFirm, getFirmFeatures } from "./service";
import { CreateFirmInput } from "./types";

export const listFirmFeatures = async (_req: Request, res: Response) => {
  const data = await getFirmFeatures();
  res.json({ features: data });
};

export const createFirmHandler = async (req: Request, res: Response) => {
  const input = req.body as CreateFirmInput;
  const created = await addFirm(input);

  res.status(201).json(created);
};
