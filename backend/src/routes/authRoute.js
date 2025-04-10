"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/auth/signup', authController_1.handleSignup);
router.post('/auth/login', authController_1.handleLogin);
router.post('/auth/logout', auth_1.authenticateUser, authController_1.handleLogout);
router.post("/auth/refresh", auth_1.refreshTokenMiddleware);
exports.default = router;
