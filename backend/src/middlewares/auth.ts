// import { IncomingMessage, ServerResponse } from 'http';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv'; 
import User from '../models/user';
import { generateAccessToken } from '../services/tokenService';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN!;
const IDLE_TIMEOUT = 15 * 60 * 1000;

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    isAdmin: boolean;
  }
}

// track user's activity
const userLastActivity: Record<string, number> = {};

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction)=> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." })
    return;
  }

  try {
    const decoded: any = jwt.verify(token, ACCESS_SECRET) //as DecodedToken;
    const user = await User.findById(decoded.userId);
    
    // console.log('User object from database:', user)

    if (!user) {
      res.status(404).json({ error: "User not found" })
      return ;
    }

    userLastActivity[user._id.toString()] = Date.now();
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
    }; //decoded;
    // console.log('req.user object:', req.user);

    next();
  } catch (error) {
      res.status(403).json({ error: "Invalid token" })
      return ;
  }
};

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token is missing" });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ error: "Invalid refresh token" })
       return;
    }

    if (Date.now() - (userLastActivity[user._id.toString()] || 0) > IDLE_TIMEOUT) {
      user.refreshToken = "";
      await user.save();
      res.status(401).json({ error: "Session expired. Please log in again." });
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.isAdmin ?? false);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
      res.status(403).json({ error: "Invalid refresh token" });
  }
};