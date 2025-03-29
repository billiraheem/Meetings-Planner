import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'; 

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN!;
const REFRESH_EXPIRY = '7d';

export const generateAccessToken = (userId: string, isAdmin: boolean) => {
  try {
  return jwt.sign({ userId, isAdmin }, ACCESS_SECRET, { expiresIn: "15m" });
} catch (error) {
  console.error("Error generating access token:", error);
  return null;
}};

export const generateRefreshToken = (userId: string) => {
  try {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
  } catch (error) {
    console.error("Error generating refresh token:", error);
    return null;
  }
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

export const getRefreshTokenExpiry = () => {
  return REFRESH_EXPIRY;
};