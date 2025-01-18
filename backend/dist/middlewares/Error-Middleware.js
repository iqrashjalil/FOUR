"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    const errorMessage = err.message || "Interl Server Error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ success: false, message: errorMessage });
};
exports.errorMiddleware = errorMiddleware;
const tryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
exports.tryCatch = tryCatch;
