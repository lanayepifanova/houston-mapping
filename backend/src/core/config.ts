import dotenv from "dotenv";

dotenv.config();

export type AppConfig = {
  port: number;
  databaseUrl: string;
  corsOrigin: string | string[];
};

export const loadConfig = (): AppConfig => {
  const port = Number(process.env.PORT || 4000);
  const databaseUrl = process.env.DATABASE_URL || "file:./data/dev.db";
  const corsOrigin = process.env.CORS_ORIGIN || "*";

  return { port, databaseUrl, corsOrigin };
};
