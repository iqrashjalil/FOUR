import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/Auth_Middleware";
import couponController from "../controllers/Coupon-Controller";

const router = express.Router();

//!  Admin Only Routes
router
  .route("/createcoupon")
  .post(authMiddleware, adminOnly, couponController.createCoupon);
router
  .route("/getallcoupons")
  .get(authMiddleware, adminOnly, couponController.getAllCoupons);
router
  .route("/updatecoupon/:id")
  .patch(authMiddleware, adminOnly, couponController.updateCoupon);
router
  .route("/deletecoupon/:id")
  .delete(authMiddleware, adminOnly, couponController.deleteCoupon);

router
  .route("/getcoupondetails/:id")
  .get(authMiddleware, adminOnly, couponController.getCouponDetails);
//!  Admin Only Routes
router.route("/fetchCoupon").get(couponController.fetchCoupon);
export default router;
