"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const CORS_1 = require("../middlewares/CORS");
const authRoute_1 = __importDefault(require("../routes/authRoute"));
const meetingRoute_1 = __importDefault(require("../routes/meetingRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Apply Middleware
app.use(CORS_1.corsMiddleware);
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', authRoute_1.default);
app.use('/api/meetings', meetingRoute_1.default);
exports.default = app;
// import { createServer, IncomingMessage, ServerResponse } from 'http';
// import { URL } from 'url';
// import connectDB from '../config/DB';
// import { corsMiddleware } from '../middlewares/CORS';
// import { routeHandler } from '../routes/meetingRoute';
// import { authRouteHandler } from '../routes/authRoute';
// // Connect to MongoDB
// connectDB();
// const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
//     if (corsMiddleware(req, res)) return;
//     const { method, url } = req;
//     const parsedUrl = new URL(url || '', `http://${req.headers.host}`);
//     const pathname = parsedUrl.pathname;
//     const query = parsedUrl.searchParams;
//     let body = '';
//     req.on('data', chunk => (body += chunk.toString()));
//     req.on('end', () => {
//         const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
//         const pathname = parsedUrl.pathname;
//         if (pathname.startsWith('/api/auth')) {
//             authRouteHandler(req, res, body); // Handle authentication routes
//         } else {
//             routeHandler(req, res, body); // Handle meeting routes
//         }
//     });
// });
// export { server };
