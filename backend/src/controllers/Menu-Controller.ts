import { tryCatch } from "../middlewares/Error-Middleware";
import Menu, { menuInterface } from "../models/Menu-Model";
import { ErrorHandler } from "../utils/Error-Handler";
import { rm } from "fs";
interface CategorizedItems {
  [key: string]: menuInterface[];
}
// Add New Menu Item (Admin Only)
const addMenuItem = tryCatch(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const image = req.file;

  if (!image) {
    return next(new ErrorHandler("Image Required", 400));
  }
  if (!name || !description || !price || !category) {
    rm(image?.path, () => {
      console.log("Image Deleted");
    });
    return next(new ErrorHandler("All Fields Required", 400));
  }
  const createdItem = await Menu.create({
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
const updateMenuItem = tryCatch(async (req, res, next) => {
  const itemId = req.params.id;
  const { name, description, price, category } = req.body;
  const image = req.file;

  const updatedItem = await Menu.findByIdAndUpdate(itemId, {
    name,
    description,
    price,
    category,
    image: image?.path,
  });
  if (!updatedItem) {
    return next(new ErrorHandler("Menu Item Not Found", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "Menu Item Updated Successfully" });
});

// Delete Menu Item (Admin Only)
const deleteMenuItem = tryCatch(async (req, res, next) => {
  const itemId = req.params.id;
  const deletedItem = await Menu.findByIdAndDelete(itemId);

  if (!deletedItem) {
    return next(new ErrorHandler("Menu Item Not Found", 404));
  }
  rm(deletedItem.image, () => {
    console.log("Image Deleted");
  });
  res
    .status(200)
    .json({ success: true, message: "Menu Item Deleted Successfully" });
});

// Get Single Menu Item
const getSingleMenuItem = tryCatch(async (req, res, next) => {
  const itemId = req.params.id;
  const menuItem = await Menu.findById(itemId);
  if (!menuItem) {
    return next(new ErrorHandler("Menu Item Not Found", 404));
  }
  res.status(200).json({ success: true, menuItem });
});

// Get Menu Items By Filters
const getAllMenuItems = tryCatch(async (req, res, next) => {
  const menuItems = await Menu.find();

  const categorizedItems: CategorizedItems = menuItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as CategorizedItems);

  res.status(200).json({ success: true, allItems: categorizedItems });
});

const getFullMenu = tryCatch(async (req, res, next) => {
  const { page, limit } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const menuItems = await Menu.find()
    .skip(skip)
    .limit(parseInt(limit as string));

  const totalDocuments = await Menu.countDocuments();
  res.status(200).json({
    success: true,
    fullMenu: menuItems,
    pagination: {
      totalDocuments,
      currentPage: parseInt(page as string),
      totalPages: Math.ceil(totalDocuments / parseInt(limit as string)),
    },
  });
});

export default {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getSingleMenuItem,
  getAllMenuItems,
  getFullMenu,
};
