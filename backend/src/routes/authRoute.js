"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouteHandler = void 0;
var authController_1 = require("../controllers/authController");
var auth_1 = require("../middlewares/auth");
var authRoutes = {
    'POST /api/auth/signup': function (req, res, body) { return (0, authController_1.handleSignup)(req, res, body); },
    'POST /api/auth/login': function (req, res, body) { return (0, authController_1.handleLogin)(req, res, body); },
    'POST /api/auth/logout': function (req, res) { return (0, auth_1.authenticateUser)(req, res, function () { return (0, authController_1.handleLogout)(req, res); }); },
    // 'POST /api/auth/refresh': (req, res, body) => handleRefreshToken(req, res, body!),
};
var authRouteHandler = function (req, res, body) {
    var method = req.method;
    var pathname = req.url || '';
    var routeKey = "".concat(method, " ").concat(pathname);
    if (authRoutes[routeKey]) {
        authRoutes[routeKey](req, res, body);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};
exports.authRouteHandler = authRouteHandler;
// import { IncomingMessage, ServerResponse } from 'http';
// import { registerUser } from '../controllers/authController';
// export const authRoutes = async (req: IncomingMessage, res: ServerResponse) => {
//   if (req.method === 'POST' && req.url === '/api/auth/register') {
//     let body = '';
//     req.on('data', (chunk) => (body += chunk));
//     req.on('end', () => registerUser(req, res, body));
//   } else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     return res.end(JSON.stringify({ error: 'Route not found' }));
//   }
// };
