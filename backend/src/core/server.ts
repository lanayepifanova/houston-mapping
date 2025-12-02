import express from "express";
import cors from "cors";
import morgan from "morgan";
import { loadConfig } from "./config";
import { logger } from "./logger";
import { errorHandler } from "./errors";
import { apiRouter } from "../api";

const config = loadConfig();
const app = express();

const corsOrigins = Array.isArray(config.corsOrigin)
  ? config.corsOrigin
  : String(config.corsOrigin).split(",").map((o) => o.trim());

app.use(cors({ origin: corsOrigins }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Backend running on port ${config.port}`);
});
