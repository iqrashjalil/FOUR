"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_Middleware_1 = require("../middlewares/Error-Middleware");
const Menu_Model_1 = __importDefault(require("../models/Menu-Model"));
const Error_Handler_1 = require("../utils/Error-Handler");
const fs_1 = require("fs");
// Add New Menu Item (Admin Only)
const addMenuItem = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { name, description, price, category } = req.body;
    const image = req.file;
    if (!image) {
        return next(new Error_Handler_1.ErrorHandler("Image Required", 400));
    }
    if (!name || !description || !price || !category) {
        (0, fs_1.rm)(image?.path, () => {
            console.log("Image Deleted");
        });
        return next(new Error_Handler_1.ErrorHandler("All Fields Required", 400));
    }
    const createdItem = await Menu_Model_1.default.create({
        name,
        description,
        price,
        category,
        image: image?.path,
    });
    res
        .status(201)
        .json({ success: true, message: "Menu Item Added Successfully" });
});
// Update Menu Item (Admin Only)
const updateMenuItem = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const itemId = req.params.id;
    const { name, description, price, category } = req.body;
    const image = req.file;
    const updatedItem = await Menu_Model_1.default.findByIdAndUpdate(itemId, {
        name,
        description,
        price,
        category,
        image: image?.path,
    });
    if (!updatedItem) {
        return next(new Error_Handler_1.ErrorHandler("Menu Item Not Found", 404));
    }
    res
        .status(200)
        .json({ success: true, message: "Menu Item Updated Successfully" });
});
// Delete Menu Item (Admin Only)
const deleteMenuItem = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const itemId = req.params.id;
    const deletedItem = await Menu_Model_1.default.findByIdAndDelete(itemId);
    if (!deletedItem) {
        return next(new Error_Handler_1.ErrorHandler("Menu Item Not Found", 404));
    }
    (0, fs_1.rm)(deletedItem.image, () => {
        console.log("Image Deleted");
    });
    res
        .status(200)
        .json({ success: true, message: "Menu Item Deleted Successfully" });
});
// Get Single Menu Item
const getSingleMenuItem = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const itemId = req.params.id;
    const menuItem = await Menu_Model_1.default.findById(itemId);
    if (!menuItem) {
        return next(new Error_Handler_1.ErrorHandler("Menu Item Not Found", 404));
    }
    res.status(200).json({ success: true, menuItem });
});
// Get Menu Items By Filters
const getAllMenuItems = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const menuItems = await Menu_Model_1.default.find();
    const categorizedItems = menuItems.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
    res.status(200).json({ success: true, allItems: categorizedItems });
});
const getFullMenu = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const menuItems = await Menu_Model_1.default.find()
        .skip(skip)
        .limit(parseInt(limit));
    const totalDocuments = await Menu_Model_1.default.countDocuments();
    res.status(200).json({
        success: true,
        fullMenu: menuItems,
        pagination: {
            totalDocuments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocuments / parseInt(limit)),
        },
    });
});
exports.default = {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getSingleMenuItem,
    getAllMenuItems,
    getFullMenu,
};
