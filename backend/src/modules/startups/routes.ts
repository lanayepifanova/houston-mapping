import { Router } from "express";
import {
  createStartupHandler,
  deleteStartupHandler,
  listDeletedStartupFeatures,
  listStartupFeatures,
  restoreStartupHandler
} from "./controller";
import { validateBody } from "../../core/validate";
import { createStartupSchema } from "./types";

export const startupsRouter = Router();

startupsRouter.get("/", listStartupFeatures);
startupsRouter.get("/deleted", listDeletedStartupFeatures);
startupsRouter.post("/", validateBody(createStartupSchema), createStartupHandler);
startupsRouter.post("/:id/restore", restoreStartupHandler);
startupsRouter.delete("/:id", deleteStartupHandler);
