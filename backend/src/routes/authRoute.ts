import express from 'express';
import { handleLogin, handleSignup, handleLogout } from '../controllers/authController';
import { authenticateUser, refreshTokenMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/auth/signup', handleSignup);
router.post('/auth/login', handleLogin);
router.post('/auth/logout', authenticateUser, handleLogout);
router.post("/auth/refresh", refreshTokenMiddleware);

export default router;
