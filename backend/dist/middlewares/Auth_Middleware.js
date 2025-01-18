"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authMiddleware = void 0;
const Error_Handler_1 = require("../utils/Error-Handler");
const Error_Middleware_1 = require("./Error-Middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_Model_1 = __importDefault(require("../models/User-Model"));
exports.authMiddleware = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new Error_Handler_1.ErrorHandler("You are not logged in or can't access token", 400));
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
        return next(new Error_Handler_1.ErrorHandler("JWT Secret Key is not provided", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
    const user = await User_Model_1.default.findById(decoded._id);
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("Invalid token", 400));
    }
    req.user = user;
    next();
});
exports.adminOnly = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const role = req.user?.role;
    if (role !== "admin") {
        return next(new Error_Handler_1.ErrorHandler("You are not authorized to access this route", 403));
    }
    next();
});
