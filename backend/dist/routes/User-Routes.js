"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_Controller_1 = __importDefault(require("../controllers/User-Controller"));
const Auth_Middleware_1 = require("../middlewares/Auth_Middleware");
const router = express_1.default.Router();
router.route("/register").post(User_Controller_1.default.register);
router.route("/login").post(User_Controller_1.default.login);
router.route("/logout").post(User_Controller_1.default.logout);
router.route("/getuser").get(Auth_Middleware_1.authMiddleware, User_Controller_1.default.getUser);
router
    .route("/updateprofile")
    .patch(Auth_Middleware_1.authMiddleware, User_Controller_1.default.updateProfile);
router
    .route("/additemtofavourites/:id")
    .post(Auth_Middleware_1.authMiddleware, User_Controller_1.default.addMenuItemToFavourites);
//!   Admin Only Routes
router
    .route("/getallusers")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, User_Controller_1.default.getAllUsers);
router
    .route("/getsingleuser/:id")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, User_Controller_1.default.getUserById);
router
    .route("/updatesingleuser/:id")
    .patch(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, User_Controller_1.default.updateUser);
router
    .route("/deleteuser/:id")
    .delete(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, User_Controller_1.default.deleteUser);
//!   Admin Only Routes
exports.default = router;
