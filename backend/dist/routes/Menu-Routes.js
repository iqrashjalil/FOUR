"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_Middleware_1 = require("../middlewares/Auth_Middleware");
const Menu_Controller_1 = __importDefault(require("../controllers/Menu-Controller"));
const Multer_1 = require("../middlewares/Multer");
const router = express_1.default.Router();
//! Admin Onlu Routes
router
    .route("/addmenuitem")
    .post(Auth_Middleware_1.authMiddleware, Multer_1.singleUpload, Auth_Middleware_1.adminOnly, Menu_Controller_1.default.addMenuItem);
router
    .route("/updatemenuitem/:id")
    .patch(Auth_Middleware_1.authMiddleware, Multer_1.singleUpload, Auth_Middleware_1.adminOnly, Menu_Controller_1.default.updateMenuItem);
router
    .route("/deletemenuitem/:id")
    .delete(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Menu_Controller_1.default.deleteMenuItem);
router
    .route("/getfullmenu")
    .get(Auth_Middleware_1.authMiddleware, Auth_Middleware_1.adminOnly, Menu_Controller_1.default.getFullMenu);
//! Admin Onlu Routes
router.route("/getsinglemenuitem/:id").get(Menu_Controller_1.default.getSingleMenuItem);
router.route("/getallmenuitems").get(Menu_Controller_1.default.getAllMenuItems);
exports.default = router;
