import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/User-Routes";
import menuRoutes from "./routes/Menu-Routes";
import orderRoutes from "./routes/Order-Routes";
import couponRoutes from "./routes/Coupon-Routes";
import { errorMiddleware } from "./middlewares/Error-Middleware";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
const app = express();
const port = process.env.PORT;
const options = {
  origin: "https://four-flame.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(options));
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_COMPASS!);
    console.log("Database is Connected");
  } catch (error) {
    console.error("Error Message", error);
    process.exit(1);
  }
};
connectDB();
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

app.use(errorMiddleware);
