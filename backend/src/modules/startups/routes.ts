import { Router } from "express";
import { createStartupHandler, listStartupFeatures } from "./controller";
import { validateBody } from "../../core/validate";
import { createStartupSchema } from "./types";

export const startupsRouter = Router();

startupsRouter.get("/", listStartupFeatures);
startupsRouter.post("/", validateBody(createStartupSchema), createStartupHandler);
