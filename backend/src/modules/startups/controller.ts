import { Request, Response } from "express";
import { addStartup, getStartupFeatures } from "./service";
import { CreateStartupInput } from "./types";

export const listStartupFeatures = async (_req: Request, res: Response) => {
  const data = await getStartupFeatures();
  res.json({ features: data });
};

export const createStartupHandler = async (req: Request, res: Response) => {
  const input = req.body as CreateStartupInput;
  const created = await addStartup(input);

  res.status(201).json(created);
};
