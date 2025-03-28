import { IncomingMessage, ServerResponse } from 'http';
import * as bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/tokenService';
// import { sendVerificationEmail } from '../services/emailService';
import jwt from "jsonwebtoken";
// import { parseRequestBody } from '../utils/helpers';

export const handleSignup = async (req: IncomingMessage, res: ServerResponse, body: string) => {
  try {
    console.log("Signup request received with body:", body);

    if (!body) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Request body is missing" }));
    }

    const { name, email, password } = JSON.parse(body);
    console.log("Parsed Data:", { name, email, password });

    if (!name || !email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "All fields are required" }));
    } 

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'User already exists' }));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Passedword:", hashedPassword)
    // const verificationToken = generateAccessToken(email);
    const newUser = new User({ name, email, password: hashedPassword, isVerified: true }); //verificationToken
    await newUser.save();
    console.log("New User:", newUser)
    // await sendVerificationEmail(email, verificationToken);
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User registered' }));
  } catch (error) {
    console.error("Signup Error:", error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Server error' }));
  }
};

export const handleLogin = async (req: IncomingMessage, res: ServerResponse, body: string) => {
    try {
        const { email, password } = JSON.parse(body);
        console.log("Parsed body:", { email, password })
        const user = await User.findOne({ email });
        console.log("User:", user)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid credentials' }));
            return;
        }

        // if (!user.isVerified) {
        //     res.writeHead(403, { 'Content-Type': 'application/json' });
        //     res.end(JSON.stringify({ error: 'Email not verified' }));
        //     return;
        // }

        console.log("Generating access token for:", user._id.toString());
        const accessToken = generateAccessToken(user._id.toString())
        console.log("Generating refresh token for:", user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        console.log("accessToken:", accessToken)
        console.log("refreshToken:", refreshToken)

        user.refreshToken = refreshToken;
        await user.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accessToken, refreshToken }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

export const handleLogout = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    // Extract refresh token from request
    const refreshToken  = req.headers["refresh-token"] as string ;
    //req.headers;

    if (!refreshToken) {
      res.writeHead(400, 'Token issue');
      return res.end(JSON.stringify({error: "No refresh token provided"}))
    }

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.writeHead(403, 'Token issue');
      return res.end(JSON.stringify({error: "Invalid refresh token"}))
    }

    // Remove refresh token from the user
    user.refreshToken = "";
    await user.save();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Logged out successfully" }));
  } catch (error) {
      console.error("Logout Error:", error);
      res.writeHead(500, 'Token problems' );
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
    // try {
    //     const user = await User.findOneAndUpdate(
    //         { _id: (req as any).user.userId },
    //         { refreshToken: null }
    //     );

    //     res.writeHead(200, { "Content-Type": "application/json" });
    //     res.end(JSON.stringify({ message: "Logged out successfully" }));
    // } catch (error) {
    //     res.writeHead(500, { "Content-Type": "application/json" });
    //     res.end(JSON.stringify({ message: "Server error" }));
    // }
};

// export const handleRefreshToken = async (req: IncomingMessage, res: ServerResponse, body: string) => {
//     try {
//         const { refreshToken } = JSON.parse(body);
//         if (!refreshToken) throw new Error('No token provided');

//         const decoded = verifyRefreshToken(refreshToken); //as { userId: string };
//         const accessToken = generateAccessToken(decoded.userId)

//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ accessToken }));
//     } catch (error) {
//         res.writeHead(403, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ error: 'Invalid token' }));
//     }
// };