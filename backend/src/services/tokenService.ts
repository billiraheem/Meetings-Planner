import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'; 

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN!;

// console.log("ACCESS_SECRET:", ACCESS_SECRET);
// console.log("REFRESH_SECRET:", REFRESH_SECRET);
// if (!ACCESS_SECRET || !REFRESH_SECRET) {
//   console.error("Error: Missing secret keys in .env file!");
// }

export const generateAccessToken = (userId: string) => {
  try {
  const token = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
  console.log("Generated Access Token:", token);  // Log generated token
  return token;
} catch (error) {
  console.error("Error generating access token:", error);
  return null;
}};

export const generateRefreshToken = (userId: string) => {
  try {
    const token = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
    console.log("Generated Refresh Token:", token);
    return token;
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