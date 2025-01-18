"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
const sendToken = async (user, statusCode, res) => {
    const token = await user.generateToken();
    const cookieExpire = Number(process.env.JWT_COOKIE_EXPIRE) || 7;
    const options = {
        expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token: token,
    });
};
exports.sendToken = sendToken;
