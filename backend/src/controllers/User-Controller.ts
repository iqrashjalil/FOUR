import { Request, Response, NextFunction } from "express";
import User from "../models/User-Model";
import { tryCatch } from "../middlewares/Error-Middleware";
import { ErrorHandler } from "../utils/Error-Handler";
import { controllerType } from "../utils/Features";
import { sendToken } from "../utils/Send-Token";
import Menu from "../models/Menu-Model";

// Register

const register = tryCatch(async (req, res, next): Promise<any> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields Are Required", 400));
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User Already Exists", 400));
  }
  const userCreated = await User.create({
    name,
    email,
    password,
  });
  res.status(201).json({ success: true, message: "User Created Successfully" });
});

// Log In

const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All Fields Are Required", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  sendToken(user, 200, res);
});

// Logout

const logout = tryCatch(async (req, res) => {
  // Set the cookie to null and set an expired date to clear it
  res.cookie("token", "", { expires: new Date(0) });

  res.status(200).json({ success: true, message: "Logged Out Successfully" });
});

// Get User

const getUser = tryCatch(async (req, res, next) => {
  const id = req.user?._id;

  const user = await User.findById(id)
    .select("-password")
    .populate("favourites");
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json({ success: true, user: user });
});

// Update the logged in user profile
const updateProfile = tryCatch(async (req, res, next) => {
  const { name, email, phone, address } = req.body;
  const id = req.user?._id;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  if (email && email !== user.email) {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return next(new ErrorHandler("Email Already Exists", 400));
    }
  }

  if (phone && phone !== user.phone) {
    const checkPhone = await User.findOne({ phone });
    if (checkPhone) {
      return next(new ErrorHandler("Phone Number Already Exists", 400));
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

const getAllUsers = tryCatch(async (req, res, next) => {
  const { page, limit } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const getAllUsers = await User.find()
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string));
  const totalDocuments = await User.countDocuments();
  res.status(200).json({
    success: true,
    users: getAllUsers,
    pagination: {
      totalDocuments,
      currentPage: parseInt(page as string),
      totalPages: Math.ceil(totalDocuments / parseInt(limit as string)),
    },
  });
});

// Get User By ID (Admin Only)
const getUserById = tryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json({ success: true, user });
});

// Update User (Admin Only)
const updateUser = tryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, phone, address, role } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  if (email && email !== user.email) {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return next(new ErrorHandler("Email Already Exists", 400));
    }
  }

  if (phone && phone !== user.phone) {
    const checkPhone = await User.findOne({ phone });
    if (checkPhone) {
      return next(new ErrorHandler("Phone Number Already Exists", 400));
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

const deleteUser = tryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json({ success: true, message: "User Deleted Successfully" });
});

// Add Menu Item to favourites
const addMenuItemToFavourites = tryCatch(async (req, res, next) => {
  const userId = req.user?._id;
  const itemId = req.params.id;
  const user = await User.findById(userId);
  const menuItem = await Menu.findById(itemId);
  if (!menuItem) {
    return next(new ErrorHandler("Menu Item Not Found", 404));
  }
  if (user?.favourites.includes(itemId)) {
    user.favourites = user.favourites.filter(
      (favId) => favId.toString() !== itemId
    );
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Item Removed From Favourites" });
  }
  user?.favourites.push(itemId);
  await user?.save();
  res.status(200).json({ success: true, message: "Item Added To Favourites" });
});

export default {
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
