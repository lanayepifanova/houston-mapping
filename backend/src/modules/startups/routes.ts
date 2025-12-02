import { Router } from "express";
import { createStartupHandler, listStartupFeatures } from "./controller";

export const startupsRouter = Router();

startupsRouter.get("/", listStartupFeatures);
startupsRouter.post("/", createStartupHandler);
