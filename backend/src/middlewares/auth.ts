import { IncomingMessage, ServerResponse } from 'http';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'; 

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN!;
console.log("Loaded ACCESS_TOKEN_SECRET:", ACCESS_SECRET);

interface AuthenticatedRequest extends IncomingMessage {
  user?: any;
}

export const authenticateUser = (req: AuthenticatedRequest, res: ServerResponse, next: () => void) => {
  const authHeader = req.headers.authorization;
  console.log("Received Authorization Header:", authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Unauthorized' }));
  }

  const token = authHeader.split(' ')[1];
  console.log("Received Token:", token);
  try {
    console.log("Using ACCESS_TOKEN_SECRET:", ACCESS_SECRET);
    const decoded = jwt.verify(token, ACCESS_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Invalid Token' }));
  }
};