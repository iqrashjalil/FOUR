import { Document, Model, model, Schema } from "mongoose";

export interface couponInterface extends Document {
  code: string;
  discount: number;
  expiryDate: Date;
  active: boolean;
}

const couponSchema: Schema = new Schema({
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

const Coupon: Model<couponInterface> = model<couponInterface>(
  "Coupon",
  couponSchema
);

export default Coupon;
