import express from "express";
import userController from "../controllers/User-Controller";
import { adminOnly, authMiddleware } from "../middlewares/Auth_Middleware";
const router = express.Router();

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.route("/getuser").get(authMiddleware, userController.getUser);
router
  .route("/updateprofile")
  .patch(authMiddleware, userController.updateProfile);

router
  .route("/additemtofavourites/:id")
  .post(authMiddleware, userController.addMenuItemToFavourites);
//!   Admin Only Routes
router
  .route("/getallusers")
  .get(authMiddleware, adminOnly, userController.getAllUsers);
router
  .route("/getsingleuser/:id")
  .get(authMiddleware, adminOnly, userController.getUserById);
router
  .route("/updatesingleuser/:id")
  .patch(authMiddleware, adminOnly, userController.updateUser);
router
  .route("/deleteuser/:id")
  .delete(authMiddleware, adminOnly, userController.deleteUser);
//!   Admin Only Routes

export default router;
