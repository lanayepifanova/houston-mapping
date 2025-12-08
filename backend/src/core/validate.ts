import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodTypeAny } from "zod";
import { ValidationError } from "./errors";

export const validateBody = <T>(schema: ZodSchema<T> | ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.flatten();
      return next(new ValidationError("Invalid request body", details));
    }

    req.body = result.data;
    return next();
  };
};

export const validateQuery = <T>(schema: ZodSchema<T> | ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const details = result.error.flatten();
      return next(new ValidationError("Invalid query parameters", details));
    }

    req.query = result.data as Request["query"];
    return next();
  };
};
