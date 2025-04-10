import { Request, response, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/tokenService';
import { error } from 'console';
import { globalResponseCodes } from '../services/responseCode';

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, isAdmin } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({ Error: true, errorMessage: 'All fields are required', responseCode: globalResponseCodes.BAD_REQUEST });
      return;
    } 
    else if (password !== confirmPassword) {
      res.status(400).json({ Error: true, errorMessage: 'Passwords do not match', responseCode: globalResponseCodes.BAD_REQUEST });
      return;
    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ Error: true, errorMessage: "Invalid email format", responseCode: globalResponseCodes.BAD_REQUEST });
        return;
      }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ Error: true, errorMessage: 'User already exists', responseCode: globalResponseCodes.BAD_REQUEST });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //decrpt password
    
    const newUser = new User({ name, email, password: hashedPassword, isAdmin: isAdmin || false }); 
    await newUser.save();

    res.status(201).json({ Success: true, responseMessage: 'User registered successfully', responseCode: globalResponseCodes.CREATED, data: newUser })
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ Error: true, errorMessage: "Internal server error" });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user: any = await User.findOne({ email });        
      if (!user) {
        res.status(401).json({ Error: true, errorMessage: "User does not exist!", responseCode: globalResponseCodes.UNAUTHORIZED })
        return;
      }
      const correctPassword = await bcrypt.compare(password, user.password)
      if (!correctPassword) {
        res.status(404).json({ Error: true, errorMessage: "User does not exist! or incorrect password", responseCode: globalResponseCodes.NOT_FOUND })
        return;
      }

      const accessToken = generateAccessToken(user._id.toString(), user.isAdmin)
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshToken = refreshToken as string;
      await user.save();

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' })

      res.status(200).json({
        Success: true, 
        responseMessage: "Login successful",
        responseCode: globalResponseCodes.SUCCESSFUL,
        accessToken,
        isAdmin: user.isAdmin,
        // data: user 
      });
    } catch (error) {
        console.log(error)
        res.status(500).json({ Error: true, errorMessage: 'Internal Server Error', responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST });
    }
};

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        user.refreshToken = "";
        await user.save();
    }

    res.clearCookie('refreshToken');
    res.status(200).json({ Success: true, responseMessage: 'Logged out successfully', responseCode: globalResponseCodes.SUCCESSFUL, data: user });
  } catch (error) {
    res.status(500).json({ Error: true, errorMessage: 'Internal Server Error', responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST });
  }
};