import { Router } from "express";
import { validateBody } from "../../core/validate";
import {
  geocodeRequestSchema,
  metadataRequestSchema
} from "./types";
import { enqueueGeocode, enqueueMetadata, getJobStatus } from "./service";
import { ValidationError } from "../../core/errors";

export const enrichmentRouter = Router();

enrichmentRouter.post("/geocode", validateBody(geocodeRequestSchema), (req, res) => {
  const job = enqueueGeocode(req.body);
  res.status(202).json({ jobId: job.id, status: job.status });
});

enrichmentRouter.post("/metadata", validateBody(metadataRequestSchema), (req, res) => {
  const job = enqueueMetadata(req.body);
  res.status(202).json({ jobId: job.id, status: job.status });
});

enrichmentRouter.get("/jobs/:id", (req, res, next) => {
  const job = getJobStatus(req.params.id);
  if (!job) {
    return next(new ValidationError("Job not found", { id: req.params.id }));
  }
  res.json(job);
});
