import { Router } from "express";
import { searchProvider } from "./provider";

export const searchRouter = Router();

searchRouter.get("/", async (req, res) => {
  const query = String(req.query.q || "");
  const tags = req.query.tags ? String(req.query.tags).split(",") : undefined;
  const results = await searchProvider({ query, tags });
  res.json(results);
});
