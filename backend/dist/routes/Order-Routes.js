"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_Controller_1 = __importDefault(require("../controllers/Order-Controller"));
const Auth_Middleware_1 = require("../middlewares/Auth_Middleware");
const router = express_1.default.Router();
router.route("/createorder").post(Order_Controller_1.default.createOrder);
router.route("/get/singleorder/:id").get(Order_Controller_1.default.getSingleOrder);
router.route("/update/cancelorder/:id").patch(Order_Controller_1.default.cancelOrder);
router
    .route("/get/userorders")
    .get(Auth_Middleware_1.authMiddleware, Order_Controller_1.default.getUserOrders);
//! Admin Only Routes
router
    .route("/updateorder/:id")
    .patch(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Order_Controller_1.default.updateOrder);
router
    .route("/get/allorders")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Order_Controller_1.default.getAllOrders);
router
    .route("/get/monthlysales")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Order_Controller_1.default.getMonthlySales);
//! Admin Only Routes
exports.default = router;
