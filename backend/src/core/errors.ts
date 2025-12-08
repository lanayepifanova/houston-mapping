import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request", details?: unknown) {
    super(message, 400, details);
  }
}

// Express error handler
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details
    });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ error: message });
};
