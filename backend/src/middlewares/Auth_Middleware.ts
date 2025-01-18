import { ErrorHandler } from "../utils/Error-Handler";
import { tryCatch } from "./Error-Middleware";
import jwt from "jsonwebtoken";
import User from "../models/User-Model";

interface tokenPayload {
  _id: string;
  iat: number;
  exp: number;
}
export const authMiddleware = tryCatch(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(
      new ErrorHandler("You are not logged in or can't access token", 400)
    );
  }
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) {
    return next(new ErrorHandler("JWT Secret Key is not provided", 400));
  }
  const decoded = jwt.verify(token, jwtSecretKey) as tokenPayload;

  const user = await User.findById(decoded._id);
  if (!user) {
    return next(new ErrorHandler("Invalid token", 400));
  }
  req.user = user;
  next();
});

export const adminOnly = tryCatch(async (req, res, next) => {
  const role = req.user?.role;
  if (role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to access this route", 403)
    );
  }
  next();
});
