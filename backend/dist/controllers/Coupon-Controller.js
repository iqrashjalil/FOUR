"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_Middleware_1 = require("../middlewares/Error-Middleware");
const Coupon_Model_1 = __importDefault(require("../models/Coupon-Model"));
const Error_Handler_1 = require("../utils/Error-Handler");
// Creat Coupon (Admin Only)
const createCoupon = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { code, discount, expiryDate } = req.body;
    if (!code || !discount || !expiryDate) {
        return next(new Error_Handler_1.ErrorHandler("All Fields Required", 400));
    }
    const couponExist = await Coupon_Model_1.default.findOne({ code });
    if (couponExist) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Code Already Exists", 400));
    }
    const createdCoupon = await Coupon_Model_1.default.create({
        code,
        discount,
        expiryDate,
    });
    res.status(201).json({
        success: true,
        message: `Coupon Code with coupon code: ${createdCoupon.code} created`,
    });
});
// Get All Coupons (Admin Only)
const getAllCoupons = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const getAllCoupons = await Coupon_Model_1.default.find()
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
    const totalDocuments = await Coupon_Model_1.default.countDocuments();
    res.status(200).json({
        success: true,
        coupons: getAllCoupons,
        pagination: {
            totalDocuments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocuments / parseInt(limit)),
        },
    });
});
// Get Single Coupon
const fetchCoupon = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { code } = req.query;
    const coupon = await Coupon_Model_1.default.findOne({ code });
    if (!coupon) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Not Found", 400));
    }
    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Expired", 400));
    }
    if (coupon.active === false) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Inactive", 400));
    }
    res.status(200).json({ success: true, coupon: coupon });
});
// Update Coupon (Admin Only)
const updateCoupon = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const { code } = req.body;
    const couponExist = await Coupon_Model_1.default.findOne({ code });
    const coupon = await Coupon_Model_1.default.findById(id);
    if (coupon?.code === code) {
        const updatedCoupon = await Coupon_Model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
    }
    else if (couponExist) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Code Already Exists", 400));
    }
    else {
        const updatedCoupon = await Coupon_Model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
    }
    res
        .status(200)
        .json({ success: true, message: "Coupon Updated Successfully" });
});
// Delete Coupon (Admin Only)
const deleteCoupon = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const deletedCoupon = await Coupon_Model_1.default.findByIdAndDelete(id);
    if (!deletedCoupon) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Not Found", 404));
    }
    res.status(200).json({
        success: true,
        message: `Coupon ${deletedCoupon.code} Deleted Successfully`,
    });
});
// Get Coupon Details (Admin Only)
const getCouponDetails = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon_Model_1.default.findById(id);
    if (!coupon) {
        return next(new Error_Handler_1.ErrorHandler("Coupon Not Found", 404));
    }
    res.status(200).json({ success: true, coupon: coupon });
});
exports.default = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    fetchCoupon,
    getCouponDetails,
};
