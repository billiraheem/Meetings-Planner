import { ServerResponse } from "http";

// Helper function to send response
export const sendResponse = (res: ServerResponse, statusCode: number, data: any) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};