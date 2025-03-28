"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var ACCESS_SECRET = process.env.ACCESS_TOKEN;
var REFRESH_SECRET = process.env.REFRESH_TOKEN;
// console.log("ACCESS_SECRET:", ACCESS_SECRET);
// console.log("REFRESH_SECRET:", REFRESH_SECRET);
// if (!ACCESS_SECRET || !REFRESH_SECRET) {
//   console.error("Error: Missing secret keys in .env file!");
// }
var generateAccessToken = function (userId) {
    try {
        var token = jwt.sign({ userId: userId }, ACCESS_SECRET, { expiresIn: "15m" });
        console.log("Generated Access Token:", token); // Log generated token
        return token;
    }
    catch (error) {
        console.error("Error generating access token:", error);
        return null;
    }
};
exports.generateAccessToken = generateAccessToken;
var generateRefreshToken = function (userId) {
    try {
        var token = jwt.sign({ userId: userId }, REFRESH_SECRET, { expiresIn: "7d" });
        console.log("Generated Refresh Token:", token);
        return token;
    }
    catch (error) {
        console.error("Error generating refresh token:", error);
        return null;
    }
};
exports.generateRefreshToken = generateRefreshToken;
var verifyAccessToken = function (token) {
    return jwt.verify(token, ACCESS_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
var verifyRefreshToken = function (token) {
    return jwt.verify(token, REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
