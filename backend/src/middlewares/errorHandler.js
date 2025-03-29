"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: message }));
};
exports.errorHandler = errorHandler;
