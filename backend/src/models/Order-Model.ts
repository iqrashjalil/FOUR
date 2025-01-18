import mongoose, { Schema, Document, Model } from "mongoose";

export interface orderInterface extends Document {
  user: string;
  items: string[];
  item: string;
  quantity: number;
  totalAmount: number;
  address: string;
  phone: string;
  paymentMethod: "card" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  updatedAt: Date;
  createdAt: Date;
}

const orderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<orderInterface> = mongoose.model<orderInterface>(
  "Order",
  orderSchema
);

export default Order;
