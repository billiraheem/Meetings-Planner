import { ServerResponse } from 'http';

export const errorHandler = (res: ServerResponse, statusCode: number, message: string) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: message }));
};