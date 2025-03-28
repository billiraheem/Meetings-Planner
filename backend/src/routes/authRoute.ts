import { IncomingMessage, ServerResponse } from 'http';
import { handleLogin, handleSignup, handleLogout } from '../controllers/authController';
import { authenticateUser } from "../middlewares/auth";

interface AuthenticatedRequest extends IncomingMessage {
    user?: any;
  }

const authRoutes: Record<string, (req: IncomingMessage, res: ServerResponse, body?: string) => void> = {
    'POST /api/auth/signup': (req, res, body) => handleSignup(req, res, body!),
    'POST /api/auth/login': (req, res, body) => handleLogin(req, res, body!),
    'POST /api/auth/logout': (req, res) => authenticateUser(req as AuthenticatedRequest, res, 
        () => handleLogout(req as AuthenticatedRequest, res)),
    // 'POST /api/auth/refresh': (req, res, body) => handleRefreshToken(req, res, body!),
};

export const authRouteHandler = (req: IncomingMessage, res: ServerResponse, body: string) => {
    const method = req.method;
    const pathname = req.url || '';

    const routeKey = `${method} ${pathname}`;
    if (authRoutes[routeKey]) {
        authRoutes[routeKey](req, res, body);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};

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
