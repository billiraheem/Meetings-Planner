"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/signup', authController_1.handleSignup);
router.post('/login', authController_1.handleLogin);
router.post('/logout', auth_1.authenticateUser, authController_1.handleLogout);
router.post("/refresh", auth_1.refreshTokenMiddleware);
exports.default = router;
// import { IncomingMessage, ServerResponse } from 'http';
// import { handleLogin, handleSignup, handleLogout } from '../controllers/authController';
// import { authenticateUser } from "../middlewares/auth";
// interface AuthenticatedRequest extends IncomingMessage {
//     user?: any;
//   }
// const authRoutes: Record<string, (req: IncomingMessage, res: ServerResponse, body?: string) => void> = {
//     'POST /api/auth/signup': (req, res, body) => handleSignup(req, res, body!),
//     'POST /api/auth/login': (req, res, body) => handleLogin(req, res, body!),
//     'POST /api/auth/logout': (req, res) => authenticateUser(req as AuthenticatedRequest, res, 
//         () => handleLogout(req as AuthenticatedRequest, res)),
//     // 'POST /api/auth/refresh': (req, res, body) => handleRefreshToken(req, res, body!),
// };
// export const authRouteHandler = (req: IncomingMessage, res: ServerResponse, body: string) => {
//     const method = req.method;
//     const pathname = req.url || '';
//     const routeKey = `${method} ${pathname}`;
//     if (authRoutes[routeKey]) {
//         authRoutes[routeKey](req, res, body);
//     } else {
//         res.writeHead(404, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ error: 'Not Found' }));
//     }
// };
