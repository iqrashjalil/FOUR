"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_Model_1 = __importDefault(require("../models/User-Model"));
const Error_Middleware_1 = require("../middlewares/Error-Middleware");
const Error_Handler_1 = require("../utils/Error-Handler");
const Send_Token_1 = require("../utils/Send-Token");
const Menu_Model_1 = __importDefault(require("../models/Menu-Model"));
// Register
const register = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new Error_Handler_1.ErrorHandler("All fields Are Required", 400));
    }
    const userExist = await User_Model_1.default.findOne({ email });
    if (userExist) {
        return next(new Error_Handler_1.ErrorHandler("User Already Exists", 400));
    }
    const userCreated = await User_Model_1.default.create({
        name,
        email,
        password,
    });
    res.status(201).json({ success: true, message: "User Created Successfully" });
});
// Log In
const login = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new Error_Handler_1.ErrorHandler("All Fields Are Required", 400));
    }
    const user = await User_Model_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("Invalid Credentials", 401));
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    (0, Send_Token_1.sendToken)(user, 200, res);
});
// Logout
const logout = (0, Error_Middleware_1.tryCatch)(async (req, res) => {
    // Set the cookie to null and set an expired date to clear it
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logged Out Successfully" });
});
// Get User
const getUser = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const id = req.user?._id;
    const user = await User_Model_1.default.findById(id)
        .select("-password")
        .populate("favourites");
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("User Not Found", 404));
    }
    res.status(200).json({ success: true, user: user });
});
// Update the logged in user profile
const updateProfile = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { name, email, phone, address } = req.body;
    const id = req.user?._id;
    const user = await User_Model_1.default.findById(id);
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("User Not Found", 404));
    }
    if (email && email !== user.email) {
        const checkEmail = await User_Model_1.default.findOne({ email });
        if (checkEmail) {
            return next(new Error_Handler_1.ErrorHandler("Email Already Exists", 400));
        }
    }
    if (phone && phone !== user.phone) {
        const checkPhone = await User_Model_1.default.findOne({ phone });
        if (checkPhone) {
            return next(new Error_Handler_1.ErrorHandler("Phone Number Already Exists", 400));
        }
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    const updatedUser = await user.save();
    res
        .status(200)
        .json({ success: true, message: "Profile Updated Successfully" });
});
// Get All Users (Admin Only)
const getAllUsers = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const getAllUsers = await User_Model_1.default.find()
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
    const totalDocuments = await User_Model_1.default.countDocuments();
    res.status(200).json({
        success: true,
        users: getAllUsers,
        pagination: {
            totalDocuments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocuments / parseInt(limit)),
        },
    });
});
// Get User By ID (Admin Only)
const getUserById = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User_Model_1.default.findById(userId);
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("User Not Found", 404));
    }
    res.status(200).json({ success: true, user });
});
// Update User (Admin Only)
const updateUser = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const userId = req.params.id;
    const { name, email, phone, address, role } = req.body;
    const user = await User_Model_1.default.findById(userId);
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("User Not Found", 404));
    }
    if (email && email !== user.email) {
        const checkEmail = await User_Model_1.default.findOne({ email });
        if (checkEmail) {
            return next(new Error_Handler_1.ErrorHandler("Email Already Exists", 400));
        }
    }
    if (phone && phone !== user.phone) {
        const checkPhone = await User_Model_1.default.findOne({ phone });
        if (checkPhone) {
            return next(new Error_Handler_1.ErrorHandler("Phone Number Already Exists", 400));
        }
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.address = address || user.address;
    const updatedUser = await user.save();
    res.status(200).json({ success: true, user: updatedUser });
});
// Delete User (Admin Only)
const deleteUser = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User_Model_1.default.findByIdAndDelete(userId);
    if (!user) {
        return next(new Error_Handler_1.ErrorHandler("User Not Found", 404));
    }
    res.status(200).json({ success: true, message: "User Deleted Successfully" });
});
// Add Menu Item to favourites
const addMenuItemToFavourites = (0, Error_Middleware_1.tryCatch)(async (req, res, next) => {
    const userId = req.user?._id;
    const itemId = req.params.id;
    const user = await User_Model_1.default.findById(userId);
    const menuItem = await Menu_Model_1.default.findById(itemId);
    if (!menuItem) {
        return next(new Error_Handler_1.ErrorHandler("Menu Item Not Found", 404));
    }
    if (user?.favourites.includes(itemId)) {
        user.favourites = user.favourites.filter((favId) => favId.toString() !== itemId);
        await user.save();
        return res
            .status(200)
            .json({ success: true, message: "Item Removed From Favourites" });
    }
    user?.favourites.push(itemId);
    await user?.save();
    res.status(200).json({ success: true, message: "Item Added To Favourites" });
});
exports.default = {
    register,
    login,
    getUser,
    logout,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    addMenuItemToFavourites,
};
