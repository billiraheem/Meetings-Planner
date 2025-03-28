"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleLogin = exports.handleSignup = void 0;
var bcrypt = require("bcryptjs");
var user_1 = require("../models/user");
var tokenService_1 = require("../services/tokenService");
// import { parseRequestBody } from '../utils/helpers';
var handleSignup = function (req, res, body) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, existingUser, hashedPassword, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log("Signup request received with body:", body);
                if (!body) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return [2 /*return*/, res.end(JSON.stringify({ message: "Request body is missing" }))];
                }
                _a = JSON.parse(body), name_1 = _a.name, email = _a.email, password = _a.password;
                console.log("Parsed Data:", { name: name_1, email: email, password: password });
                if (!name_1 || !email || !password) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return [2 /*return*/, res.end(JSON.stringify({ message: "All fields are required" }))];
                }
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return [2 /*return*/, res.end(JSON.stringify({ error: 'User already exists' }))];
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                console.log("Passedword:", hashedPassword);
                newUser = new user_1.default({ name: name_1, email: email, password: hashedPassword, isVerified: true });
                return [4 /*yield*/, newUser.save()];
            case 3:
                _b.sent();
                console.log("New User:", newUser);
                // await sendVerificationEmail(email, verificationToken);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return [2 /*return*/, res.end(JSON.stringify({ message: 'User registered' }))];
            case 4:
                error_1 = _b.sent();
                console.error("Signup Error:", error_1);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return [2 /*return*/, res.end(JSON.stringify({ error: 'Server error' }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.handleSignup = handleSignup;
var handleLogin = function (req, res, body) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _b, accessToken, refreshToken, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = JSON.parse(body), email = _a.email, password = _a.password;
                console.log("Parsed body:", { email: email, password: password });
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                user = _c.sent();
                console.log("User:", user);
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 2:
                _b = !(_c.sent());
                _c.label = 3;
            case 3:
                if (_b) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    return [2 /*return*/];
                }
                // if (!user.isVerified) {
                //     res.writeHead(403, { 'Content-Type': 'application/json' });
                //     res.end(JSON.stringify({ error: 'Email not verified' }));
                //     return;
                // }
                console.log("Generating access token for:", user._id.toString());
                accessToken = (0, tokenService_1.generateAccessToken)(user._id.toString());
                console.log("Generating refresh token for:", user._id.toString());
                refreshToken = (0, tokenService_1.generateRefreshToken)(user._id.toString());
                console.log("accessToken:", accessToken);
                console.log("refreshToken:", refreshToken);
                user.refreshToken = refreshToken;
                return [4 /*yield*/, user.save()];
            case 4:
                _c.sent();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }));
                return [3 /*break*/, 6];
            case 5:
                error_2 = _c.sent();
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.handleLogin = handleLogin;
var handleLogout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                refreshToken = req.headers["refresh-token"];
                //req.headers;
                if (!refreshToken) {
                    res.writeHead(400, 'Token issue');
                    return [2 /*return*/, res.end(JSON.stringify({ error: "No refresh token provided" }))];
                }
                return [4 /*yield*/, user_1.default.findOne({ refreshToken: refreshToken })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.writeHead(403, 'Token issue');
                    return [2 /*return*/, res.end(JSON.stringify({ error: "Invalid refresh token" }))];
                }
                // Remove refresh token from the user
                user.refreshToken = "";
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Logged out successfully" }));
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Logout Error:", error_3);
                res.writeHead(500, 'Token problems');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handleLogout = handleLogout;
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
