import { Router } from "express";
import { listFirmFeatures } from "./controller";

export const firmsRouter = Router();

firmsRouter.get("/", listFirmFeatures);
