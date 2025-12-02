import { Router } from "express";
import { healthRouter } from "./health.routes";
import { firmsRouter } from "../modules/firms/routes";
import { startupsRouter } from "../modules/startups/routes";
import { searchRouter } from "../modules/search/routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/firms", firmsRouter);
apiRouter.use("/startups", startupsRouter);
apiRouter.use("/search", searchRouter);
