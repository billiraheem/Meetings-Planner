"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const CORS_1 = require("../backend/src/middlewares/CORS");
const authRoute_1 = __importDefault(require("../backend/src/routes/authRoute"));
const meetingRoute_1 = __importDefault(require("../backend/src/routes/meetingRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
// import cors from 'cors';
const app = (0, express_1.default)();
// Apply Middleware
app.use(CORS_1.corsMiddleware);
app.use(body_parser_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
// Special handling for Paystack webhook which needs raw body
// app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
// Routes
app.use('/api/auth', authRoute_1.default);
app.use('/api/meetings', meetingRoute_1.default);
// app.use('/api/payments', paystackRoutes)
exports.default = app;
// import { server } from "./src/server/server";
// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
