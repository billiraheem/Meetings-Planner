import { Request, Response, NextFunction } from "express";

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    } else {
        next()
    }

    // return next();
};


// import { IncomingMessage, ServerResponse } from 'http';

// export const corsMiddleware = (req: IncomingMessage, res: ServerResponse) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     if (req.method === 'OPTIONS') {
//         res.writeHead(204).end();
//         return true;
//     } 

//     return false;
// }