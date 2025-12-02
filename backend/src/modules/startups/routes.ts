import { Router } from "express";
import { listStartupFeatures } from "./controller";

export const startupsRouter = Router();

startupsRouter.get("/", listStartupFeatures);
