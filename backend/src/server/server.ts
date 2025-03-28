import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import connectDB from '../config/DB';
import { corsMiddleware } from '../middlewares/CORS';
import { routeHandler } from '../routes/meetingRoute';
import { authRouteHandler } from '../routes/authRoute';

// Connect to MongoDB
connectDB();

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (corsMiddleware(req, res)) return;

    const { method, url } = req;
    const parsedUrl = new URL(url || '', `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.searchParams;

    let body = '';
    req.on('data', chunk => (body += chunk.toString()));

    req.on('end', () => {
        const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;

        if (pathname.startsWith('/api/auth')) {
            authRouteHandler(req, res, body); // Handle authentication routes
        } else {
            routeHandler(req, res, body); // Handle meeting routes
        }
    });
});

export { server };
