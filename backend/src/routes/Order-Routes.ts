import express from "express";
import orderController from "../controllers/Order-Controller";
import { adminOnly, authMiddleware } from "../middlewares/Auth_Middleware";
const router = express.Router();

router.route("/createorder").post(orderController.createOrder);
router.route("/get/singleorder/:id").get(orderController.getSingleOrder);
router.route("/update/cancelorder/:id").patch(orderController.cancelOrder);

router
  .route("/get/userorders")
  .get(authMiddleware, orderController.getUserOrders);
//! Admin Only Routes
router
  .route("/updateorder/:id")
  .patch(authMiddleware, adminOnly, orderController.updateOrder);
router
  .route("/get/allorders")
  .get(authMiddleware, adminOnly, orderController.getAllOrders);
router
  .route("/get/monthlysales")
  .get(authMiddleware, adminOnly, orderController.getMonthlySales);
//! Admin Only Routes
export default router;
