"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Menu",
        },
    ],
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (recievedPassword) {
    return bcrypt_1.default.compare(recievedPassword, this.password);
};
userSchema.methods.generateToken = async function () {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const jwtExpire = process.env.JWT_EXPIRES_IN;
    const token = jsonwebtoken_1.default.sign({ _id: this._id }, jwtSecretKey, {
        expiresIn: jwtExpire,
    });
    return token;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
