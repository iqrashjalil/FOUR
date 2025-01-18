import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/Auth_Middleware";
import menuController from "../controllers/Menu-Controller";
import { singleUpload } from "../middlewares/Multer";
const router = express.Router();

//! Admin Onlu Routes
router
  .route("/addmenuitem")
  .post(authMiddleware, singleUpload, adminOnly, menuController.addMenuItem);
router
  .route("/updatemenuitem/:id")
  .patch(
    authMiddleware,
    singleUpload,
    adminOnly,
    menuController.updateMenuItem
  );
router
  .route("/deletemenuitem/:id")
  .delete(authMiddleware, adminOnly, menuController.deleteMenuItem);
router
  .route("/getfullmenu")
  .get(authMiddleware, adminOnly, menuController.getFullMenu);
//! Admin Onlu Routes
router.route("/getsinglemenuitem/:id").get(menuController.getSingleMenuItem);
router.route("/getallmenuitems").get(menuController.getAllMenuItems);

export default router;
