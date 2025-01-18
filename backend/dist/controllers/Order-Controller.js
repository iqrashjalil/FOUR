"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_Middleware_1 = require("../middlewares/Error-Middleware");
const Coupon_Model_1 = __importDefault(require("../models/Coupon-Model"));
const Menu_Model_1 = __importDefault(require("../models/Menu-Model"));
const Order_Model_1 = __importDefault(require("../models/Order-Model"));
const Error_Handler_1 = require("../utils/Error-Handler");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
});
const createOrder = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { paymentMethod, items, address, phone, _id, coupon } = req.body;
    console.log(req.body);
    if (!address) {
        return next(new Error_Handler_1.ErrorHandler("Address is Required", 400));
    }
    if (!phone) {
        return next(new Error_Handler_1.ErrorHandler("Phone Number is Required", 400));
    }
    const couponCode = await Coupon_Model_1.default.findOne({ code: coupon, active: true });
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
        const orderItem = await Menu_Model_1.default.findById(item.item);
        if (!orderItem) {
            return next(new Error_Handler_1.ErrorHandler("Menu Item Not Found", 404));
        }
        orderItems.push({
            item: orderItem._id,
            quantity: item.quantity,
            price: orderItem.price,
        });
        totalAmount += orderItem.price * item.quantity;
    }
    // Apply coupon discount if available
    if (couponCode) {
        totalAmount = totalAmount - (totalAmount * couponCode.discount) / 100;
    }
    // Handle different payment methods
    if (paymentMethod === "card") {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
                currency: "pkr", // Change according to your currency
                payment_method: req.body.paymentMethodId,
                confirmation_method: "manual",
                confirm: true,
                return_url: "https://your-website.com/order-confirmation",
            });
            // If payment is successful, create order
            if (paymentIntent.status === "succeeded") {
                const order = await Order_Model_1.default.create({
                    totalAmount,
                    paymentMethod,
                    items: orderItems,
                    phone,
                    address,
                    user: _id,
                    paymentStatus: "paid",
                    paymentIntentId: paymentIntent.id,
                });
                return res.status(201).json({
                    success: true,
                    message: "Order Placed! We Will be there in just a while",
                });
            }
            else {
                return next(new Error_Handler_1.ErrorHandler("Payment Failed", 400));
            }
        }
        catch (error) {
            return next(new Error_Handler_1.ErrorHandler("Error Occcured try Again!", 400));
        }
    }
    else if (paymentMethod === "cod") {
        const order = await Order_Model_1.default.create({
            totalAmount,
            paymentMethod,
            items: orderItems,
            phone,
            address,
            user: _id,
            paymentStatus: "pending",
        });
        return res.status(201).json({
            success: true,
            message: "Order Placed! We Will be there in just a whileOrder",
        });
    }
    else {
        return next(new Error_Handler_1.ErrorHandler("Invalid Payment Method", 400));
    }
});
// Get Single Order
const getSingleOrder = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order_Model_1.default.findById(orderId)
        .populate("user", "name")
        .populate("items.item");
    if (!order) {
        return next(new Error_Handler_1.ErrorHandler("Order Not Found", 404));
    }
    res.status(200).json({ success: true, order });
});
// Cancel Order
const cancelOrder = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order_Model_1.default.findById(orderId);
    if (!order) {
        return next(new Error_Handler_1.ErrorHandler("Order Not Found", 404));
    }
    if (order.status === "pending" || order.status === "processing") {
        order.status = "cancelled";
        await order.save();
    }
    else if (order.status === "cancelled") {
        return next(new Error_Handler_1.ErrorHandler("Order is Already Cancelled", 404));
    }
    else {
        return next(new Error_Handler_1.ErrorHandler("Order is Already Shipped", 404));
    }
    res.status(200).json({ success: true, message: "Order Cancelled" });
});
// Update Order Status (Admin Only)
const updateOrder = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const orderId = req.params.id;
    const { status, paymentStatus } = req.body;
    console.log(req.body);
    const order = await Order_Model_1.default.findById(orderId);
    if (!order) {
        return next(new Error_Handler_1.ErrorHandler("Order Not Found", 404));
    }
    if (status && order.status === "processing" && status === "pending") {
        return next(new Error_Handler_1.ErrorHandler("Cannot change status from 'processing' to 'pending'", 400));
    }
    if (status &&
        order.status === "shipped" &&
        (status === "pending" || status === "processing")) {
        return next(new Error_Handler_1.ErrorHandler("Cannot change status from 'shipped' to 'pending' or 'processing'", 400));
    }
    if (status && order.status === "delivered" && status !== "delivered") {
        return next(new Error_Handler_1.ErrorHandler("Cannot change status from 'delivered' to any other status", 400));
    }
    if (status && order.status === "shipped" && status === "cancelled") {
        return next(new Error_Handler_1.ErrorHandler("Cannot Cancelled Right Now", 400));
    }
    if (status && order.status === "cancelled") {
        return next(new Error_Handler_1.ErrorHandler("Cannot change status from 'cancelled'", 400));
    }
    if (paymentStatus &&
        order.paymentStatus === "paid" &&
        (paymentStatus === "pending" || paymentStatus === "failed")) {
        return next(new Error_Handler_1.ErrorHandler("Cannot change Payment Status from 'paid' to 'pending' or 'failed'", 400));
    }
    if (paymentStatus &&
        order.paymentStatus === "failed" &&
        (paymentStatus === "pending" || paymentStatus === "paid")) {
        return next(new Error_Handler_1.ErrorHandler("Cannot change Payment Status from 'failed' to 'pending' or 'paid'", 400));
    }
    if (status) {
        order.status = status;
    }
    else if (paymentStatus) {
        order.paymentStatus = paymentStatus;
    }
    else if (status && paymentStatus) {
        order.status = status;
        order.paymentStatus = paymentStatus;
    }
    await order.save();
    res.status(200).json({
        success: true,
        message: `Status Updated To ${status ? status : ""} ${paymentStatus ? paymentStatus : ""}`,
    });
});
// Get All Orders (Admin Only)
const getAllOrders = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order_Model_1.default.find()
        .populate("user items")
        .populate({ path: "items.item" })
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
    const totalDocuments = await Order_Model_1.default.countDocuments();
    const pendingOrders = await Order_Model_1.default.find({ status: "pending" });
    res.status(200).json({
        success: true,
        orders,
        pendingOrders: pendingOrders.length,
        pagination: {
            totalDocuments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocuments / parseInt(limit)),
        },
    });
});
// Get User Orders
const getUserOrders = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const userId = req.user?._id;
    const orders = await Order_Model_1.default.find({ user: userId });
    res.status(200).json({ success: true, orders });
});
// Monthly Sales Data
const getMonthlySales = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const currentDate = new Date();
    const oneYearEarlier = new Date();
    oneYearEarlier.setFullYear(currentDate.getFullYear() - 1);
    // Fetch sales data using aggregation
    const salesData = await Order_Model_1.default.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                createdAt: { $gte: oneYearEarlier, $lt: currentDate },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                totalSales: { $sum: "$totalAmount" },
            },
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 },
        },
    ]);
    // Initialize an array for the past 12 months of sales, set to 0 initially
    const monthlySales = Array(12).fill(0);
    // Map sales data to the correct month index
    salesData.forEach((data) => {
        const yearDifference = currentDate.getFullYear() - data._id.year;
        // Ensure that the month is correctly mapped
        if (yearDifference === 0 && data._id.month <= currentDate.getMonth() + 1) {
            // If it's within the current year and the month is before or the current month
            const monthIndex = data._id.month - 1; // Convert 1-based to 0-based month index
            monthlySales[monthIndex] = data.totalSales;
        }
        else if (yearDifference === 1 && data._id.month === 12) {
            // If it's from last year, only take December data
            const monthIndex = 11; // December
            monthlySales[monthIndex] = data.totalSales;
        }
    });
    // Adjust the order of months, so the data is in the correct order (from January to December)
    const result = [];
    for (let i = 0; i < 12; i++) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        const sales = monthlySales[monthIndex];
        result.push(sales);
    }
    // Reverse the result array so that the most recent month appears last
    result.reverse();
    res.status(200).json({
        success: true,
        monthlySales: result, // Raw data array with total sales for each month
    });
});
exports.default = {
    createOrder,
    getSingleOrder,
    cancelOrder,
    updateOrder,
    getAllOrders,
    getUserOrders,
    getMonthlySales,
};
