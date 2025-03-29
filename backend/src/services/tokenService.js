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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenExpiry = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_TOKEN;
const REFRESH_SECRET = process.env.REFRESH_TOKEN;
const REFRESH_EXPIRY = '7d';
const generateAccessToken = (userId, isAdmin) => {
    try {
        return jwt.sign({ userId, isAdmin }, ACCESS_SECRET, { expiresIn: "15m" });
    }
    catch (error) {
        console.error("Error generating access token:", error);
        return null;
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    try {
        return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
    }
    catch (error) {
        console.error("Error generating refresh token:", error);
        return null;
    }
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
const getRefreshTokenExpiry = () => {
    return REFRESH_EXPIRY;
};
exports.getRefreshTokenExpiry = getRefreshTokenExpiry;
