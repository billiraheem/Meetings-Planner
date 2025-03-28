"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var ACCESS_SECRET = process.env.ACCESS_TOKEN;
console.log("Loaded ACCESS_TOKEN_SECRET:", ACCESS_SECRET);
var authenticateUser = function (req, res, next) {
    var authHeader = req.headers.authorization;
    console.log("Received Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
    var token = authHeader.split(' ')[1];
    console.log("Received Token:", token);
    try {
        console.log("Using ACCESS_TOKEN_SECRET:", ACCESS_SECRET);
        var decoded = jwt.verify(token, ACCESS_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid Token' }));
    }
};
exports.authenticateUser = authenticateUser;
