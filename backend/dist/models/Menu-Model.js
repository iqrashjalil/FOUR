"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menuSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please add a name to the menu item"],
    },
    description: {
        type: String,
        required: [true, "Please add a description to the menu item"],
    },
    price: {
        type: Number,
        required: [true, "Please add a price to the menu item"],
    },
    category: {
        type: String,
        required: [true, "Please add a category to the menu item"],
    },
    image: {
        type: String,
        required: [true, "Please add an image to the menu item"],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const Menu = mongoose_1.default.model("Menu", menuSchema);
exports.default = Menu;
