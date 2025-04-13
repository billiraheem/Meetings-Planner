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
exports.refreshTokenMiddleware = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const tokenService_1 = require("../services/tokenService");
dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_TOKEN;
const REFRESH_SECRET = process.env.REFRESH_TOKEN;
const IDLE_TIMEOUT = 15 * 60 * 1000;
// track user's activity
const userLastActivity = {};
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_SECRET); //as DecodedToken;
        const user = yield user_1.default.findById(decoded.userId);
        // console.log('User object from database:', user)
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        userLastActivity[user._id.toString()] = Date.now();
        req.user = {
            userId: user._id.toString(),
            email: user.email,
            isAdmin: user.isAdmin || false,
        }; //decoded;
        // console.log('req.user object:', req.user);
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid token" });
        return;
    }
});
exports.authenticateUser = authenticateUser;
const refreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ error: "Refresh token is missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        const user = yield user_1.default.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ error: "Invalid refresh token" });
            return;
        }
        if (Date.now() - (userLastActivity[user._id.toString()] || 0) > IDLE_TIMEOUT) {
            user.refreshToken = "";
            yield user.save();
            res.status(401).json({ error: "Session expired. Please log in again." });
        }
        const newAccessToken = (0, tokenService_1.generateAccessToken)(user._id.toString(), (_a = user.isAdmin) !== null && _a !== void 0 ? _a : false);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(403).json({ error: "Invalid refresh token" });
    }
});
exports.refreshTokenMiddleware = refreshTokenMiddleware;
