import { Router } from "express";
import { createFirmHandler, listFirmFeatures } from "./controller";

export const firmsRouter = Router();

firmsRouter.get("/", listFirmFeatures);
firmsRouter.post("/", createFirmHandler);
