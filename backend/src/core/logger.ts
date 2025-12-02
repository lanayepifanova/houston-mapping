export type LogLevel = "info" | "warn" | "error";

export const logger = {
  info: (msg: string, meta?: unknown) => console.info(format("info", msg, meta)),
  warn: (msg: string, meta?: unknown) => console.warn(format("warn", msg, meta)),
  error: (msg: string, meta?: unknown) => console.error(format("error", msg, meta))
};

const format = (level: LogLevel, msg: string, meta?: unknown) => {
  const base = `[${level.toUpperCase()}] ${msg}`;
  if (!meta) return base;
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch (err) {
    return base;
  }
};
