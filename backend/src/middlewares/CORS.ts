import { Request, Response, NextFunction } from "express";
// import cors from 'cors';

// export const corsMiddleware = cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// });

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");// upadte
    res.setHeader("Access-Control-Allow-Origin", "https://bills-scheduler-frontend.onrender.com");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    } else {
        next()
    }
};
