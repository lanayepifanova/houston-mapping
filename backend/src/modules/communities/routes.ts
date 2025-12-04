import { Router } from "express";
import { createCommunityHandler, listCommunityFeatures } from "./controller";

export const communitiesRouter = Router();

communitiesRouter.get("/", listCommunityFeatures);
communitiesRouter.post("/", createCommunityHandler);
