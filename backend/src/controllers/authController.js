"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleLogin = exports.handleSignup = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const tokenService_1 = require("../services/tokenService");
const handleSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword, isAdmin, subscription } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            res.status(400).json({ Error: true, errorMessage: 'All fields are required', responseCode: "400" /* globalResponseCodes.BAD_REQUEST */ });
            return;
        }
        else if (password !== confirmPassword) {
            res.status(400).json({ Error: true, errorMessage: 'Passwords do not match', responseCode: "400" /* globalResponseCodes.BAD_REQUEST */ });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ Error: true, errorMessage: "Invalid email format", responseCode: "400" /* globalResponseCodes.BAD_REQUEST */ });
            return;
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ Error: true, errorMessage: 'User already exists', responseCode: "400" /* globalResponseCodes.BAD_REQUEST */ });
            return;
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt); //decrpt password
        const newUser = new user_1.default({ name, email, password: hashedPassword, isAdmin: isAdmin || false, subscription: subscription || "free" });
        yield newUser.save();
        res.status(201).json({ Success: true, responseMessage: 'User registered successfully', responseCode: "201" /* globalResponseCodes.CREATED */, data: newUser });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ Error: true, errorMessage: "Internal server error" });
    }
});
exports.handleSignup = handleSignup;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ Error: true, errorMessage: "User does not exist!", responseCode: "401" /* globalResponseCodes.UNAUTHORIZED */ });
            return;
        }
        const correctPassword = yield bcrypt.compare(password, user.password);
        if (!correctPassword) {
            res.status(404).json({ Error: true, errorMessage: "User does not exist! or incorrect password", responseCode: "404" /* globalResponseCodes.NOT_FOUND */ });
            return;
        }
        const accessToken = (0, tokenService_1.generateAccessToken)(user._id.toString(), user.isAdmin);
        const refreshToken = (0, tokenService_1.generateRefreshToken)(user._id.toString());
        user.refreshToken = refreshToken;
        yield user.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({
            Success: true,
            responseMessage: "Login successful",
            responseCode: "200" /* globalResponseCodes.SUCCESSFUL */,
            accessToken,
            isAdmin: user.isAdmin,
            // data: user 
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: true, errorMessage: 'Internal Server Error', responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */ });
    }
});
exports.handleLogin = handleLogin;
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (user) {
            user.refreshToken = "";
            yield user.save();
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ Success: true, responseMessage: 'Logged out successfully', responseCode: "200" /* globalResponseCodes.SUCCESSFUL */, data: user });
    }
    catch (error) {
        res.status(500).json({ Error: true, errorMessage: 'Internal Server Error', responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */ });
    }
});
exports.handleLogout = handleLogout;
