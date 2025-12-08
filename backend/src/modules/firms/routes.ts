import { Router } from "express";
import { createFirmHandler, listFirmFeatures } from "./controller";
import { validateBody } from "../../core/validate";
import { createFirmSchema } from "./types";

export const firmsRouter = Router();

firmsRouter.get("/", listFirmFeatures);
firmsRouter.post("/", validateBody(createFirmSchema), createFirmHandler);
