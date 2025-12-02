import express from "express";
import cors from "cors";
import morgan from "morgan";
import { loadConfig } from "./config";
import { logger } from "./logger";
import { errorHandler } from "./errors";
import { apiRouter } from "../api";

const config = loadConfig();
const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Backend running on port ${config.port}`);
});
