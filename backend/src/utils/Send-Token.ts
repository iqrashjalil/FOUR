import { Response } from "express";
import { userInterface } from "../models/User-Model";

export const sendToken = async (
  user: userInterface,
  statusCode: number,
  res: Response
) => {
  const token = await user.generateToken();

  const cookieExpire = Number(process.env.JWT_COOKIE_EXPIRE) || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token: token,
  });
};
