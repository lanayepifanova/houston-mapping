import { Router } from "express";
import {
  createFirmHandler,
  deleteFirmHandler,
  listDeletedFirmFeatures,
  listFirmFeatures,
  restoreFirmHandler
} from "./controller";
import { validateBody } from "../../core/validate";
import { createFirmSchema } from "./types";

export const firmsRouter = Router();

firmsRouter.get("/", listFirmFeatures);
firmsRouter.get("/deleted", listDeletedFirmFeatures);
firmsRouter.post("/", validateBody(createFirmSchema), createFirmHandler);
firmsRouter.post("/:id/restore", restoreFirmHandler);
firmsRouter.delete("/:id", deleteFirmHandler);
