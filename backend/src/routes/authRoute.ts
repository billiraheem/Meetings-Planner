import express from 'express';
import { handleLogin, handleSignup, handleLogout } from '../controllers/authController';
import { authenticateUser, refreshTokenMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/logout', authenticateUser, handleLogout);
router.post("/refresh", refreshTokenMiddleware);

export default router;
