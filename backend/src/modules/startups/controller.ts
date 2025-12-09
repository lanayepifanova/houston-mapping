import { Request, Response } from "express";
import {
  addStartup,
  getDeletedStartupFeatures,
  getStartupFeatures,
  removeStartup,
  restoreStartupById
} from "./service";
import { CreateStartupInput } from "./types";
import { ValidationError } from "../../core/errors";

export const listStartupFeatures = async (_req: Request, res: Response) => {
  const data = await getStartupFeatures();
  res.json({ features: data });
};

export const listDeletedStartupFeatures = async (_req: Request, res: Response) => {
  const data = await getDeletedStartupFeatures();
  res.json({ features: data });
};

export const createStartupHandler = async (req: Request, res: Response) => {
  const input = req.body as CreateStartupInput;
  const created = await addStartup(input);

  res.status(201).json(created);
};

export const deleteStartupHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new ValidationError("Startup id is required");
  }

  await removeStartup(id);
  res.status(204).send();
};

export const restoreStartupHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new ValidationError("Startup id is required");
  }

  const restored = await restoreStartupById(id);
  res.json(restored);
};
