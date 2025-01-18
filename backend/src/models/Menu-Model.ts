import mongoose, { Model, Document, Schema } from "mongoose";

export interface menuInterface extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema: Schema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Menu: Model<menuInterface> = mongoose.model<menuInterface>(
  "Menu",
  menuSchema
);

export default Menu;
