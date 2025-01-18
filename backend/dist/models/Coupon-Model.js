"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
});
const Coupon = (0, mongoose_1.model)("Coupon", couponSchema);
exports.default = Coupon;
