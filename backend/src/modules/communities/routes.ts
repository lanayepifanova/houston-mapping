import { Router } from "express";
import { createCommunityHandler, listCommunityFeatures } from "./controller";
import { validateBody } from "../../core/validate";
import { createCommunitySchema } from "./types";

export const communitiesRouter = Router();

communitiesRouter.get("/", listCommunityFeatures);
communitiesRouter.post("/", validateBody(createCommunitySchema), createCommunityHandler);
