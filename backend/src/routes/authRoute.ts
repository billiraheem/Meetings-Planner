import express from 'express';
import { handleLogin, handleSignup, handleLogout } from '../controllers/authController';
import { authenticateUser, refreshTokenMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/logout', authenticateUser, handleLogout);
router.post("/refresh", refreshTokenMiddleware);

export default router;


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