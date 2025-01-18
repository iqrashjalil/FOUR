import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface userInterface extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin" | "user";
  address?: string;
  favourites: string[];
  generateToken: () => string;
  comparePassword: (recievedPassword: string) => Promise<boolean>;
  updatedAt: Date;
  createdAt: Date;
}

const userSchema: Schema<userInterface> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    address: {
      type: String,
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre<userInterface>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  recievedPassword: string
): Promise<boolean> {
  return bcrypt.compare(recievedPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const jwtSecretKey = process.env.JWT_SECRET_KEY!;
  const jwtExpire = process.env.JWT_EXPIRES_IN!;

  const token = jwt.sign({ _id: this._id }, jwtSecretKey, {
    expiresIn: jwtExpire,
  });
  return token;
};

const User: Model<userInterface> = mongoose.model<userInterface>(
  "User",
  userSchema
);

export default User;
