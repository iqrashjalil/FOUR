import { NextFunction, Request, Response } from "express";
import { userInterface } from "../models/User-Model";
export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

declare module "express-serve-static-core" {
  interface Request {
    user?: userInterface;
  }
}
