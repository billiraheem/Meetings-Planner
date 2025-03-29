import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/tokenService';
import { error } from 'console';

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, isAdmin } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({ error: 'All fields are required' });
    } 
    else if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match' });
    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email format" });
      }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //decrpt password
    
    const newUser = new User({ name, email, password: hashedPassword, isAdmin: isAdmin || false }); 
    await newUser.save();

    res.status(201).json({ newUser, message: 'User registered successfully' })
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user: any = await User.findOne({ email });        
      if (!user) {
        res.status(401).json({ error: "User does not exist!" })
      }
      const correctPassword = await bcrypt.compare(password, user.password)
      if (!correctPassword) {
        res.status(401).json({ error: "User does not exist!" })
      }

      const accessToken = generateAccessToken(user._id.toString(), user.isAdmin)
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshToken = refreshToken as string;
      await user.save();

      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' })

      res.status(200).json({ 
        accessToken,
        message: "Login successful",
        isAdmin: user.isAdmin
      });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};