"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_Middleware_1 = require("../middlewares/Auth_Middleware");
const Coupon_Controller_1 = __importDefault(require("../controllers/Coupon-Controller"));
const router = express_1.default.Router();
//!  Admin Only Routes
router
    .route("/createcoupon")
    .post(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Coupon_Controller_1.default.createCoupon);
router
    .route("/getallcoupons")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Coupon_Controller_1.default.getAllCoupons);
router
    .route("/updatecoupon/:id")
    .patch(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Coupon_Controller_1.default.updateCoupon);
router
    .route("/deletecoupon/:id")
    .delete(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Coupon_Controller_1.default.deleteCoupon);
router
    .route("/getcoupondetails/:id")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Coupon_Controller_1.default.getCouponDetails);
//!  Admin Only Routes
router.route("/fetchCoupon").get(Coupon_Controller_1.default.fetchCoupon);
exports.default = router;
