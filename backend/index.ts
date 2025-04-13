import express from 'express';
import bodyParser from 'body-parser';
import { corsMiddleware } from '../backend/src/middlewares/CORS';
import authRoutes from '../backend/src/routes/authRoute';
import meetingRoutes from '../backend/src/routes/meetingRoute';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import paystackRoutes from '../backend/src/routes/paystackRoute';
// import cors from 'cors';

const app = express();                  

// Apply Middleware
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(helmet())
app.use(cookieParser());

// Special handling for Paystack webhook which needs raw body
// app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
// app.use('/api/payments', paystackRoutes)

export default app;


// import { server } from "./src/server/server";

// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));