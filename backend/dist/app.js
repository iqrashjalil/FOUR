"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./src/.env" });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_Routes_1 = __importDefault(require("./routes/User-Routes"));
const Menu_Routes_1 = __importDefault(require("./routes/Menu-Routes"));
const Order_Routes_1 = __importDefault(require("./routes/Order-Routes"));
const Coupon_Routes_1 = __importDefault(require("./routes/Coupon-Routes"));
const Error_Middleware_1 = require("./middlewares/Error-Middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT;
const options = {
    origin: "https://four-flame.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(options));
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/user", User_Routes_1.default);
app.use("/api/menu", Menu_Routes_1.default);
app.use("/api/order", Order_Routes_1.default);
app.use("/api/coupon", Coupon_Routes_1.default);
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_COMPASS);
        console.log("Database is Connected");
    }
    catch (error) {
        console.error("Error Message", error);
        process.exit(1);
    }
};
connectDB();
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
app.use(Error_Middleware_1.errorMiddleware);
