import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/Error-Handler";
import { controllerType } from "../utils/Features";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorMessage = err.message || "Interl Server Error";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: errorMessage });
};

export const tryCatch =
  (func: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
