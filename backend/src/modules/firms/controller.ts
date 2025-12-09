import { Request, Response } from "express";
import { addFirm, getDeletedFirmFeatures, getFirmFeatures, removeFirm, restoreFirmById } from "./service";
import { CreateFirmInput } from "./types";
import { ValidationError } from "../../core/errors";

export const listFirmFeatures = async (_req: Request, res: Response) => {
  const data = await getFirmFeatures();
  res.json({ features: data });
};

export const listDeletedFirmFeatures = async (_req: Request, res: Response) => {
  const data = await getDeletedFirmFeatures();
  res.json({ features: data });
};

export const createFirmHandler = async (req: Request, res: Response) => {
  const input = req.body as CreateFirmInput;
  const created = await addFirm(input);

  res.status(201).json(created);
};

export const deleteFirmHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new ValidationError("Firm id is required");
  }

  await removeFirm(id);
  res.status(204).send();
};

export const restoreFirmHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new ValidationError("Firm id is required");
  }

  const restored = await restoreFirmById(id);
  res.json(restored);
};
