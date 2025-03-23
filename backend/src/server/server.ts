import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import connectDB from '../config/DB';
import { corsMiddleware } from '../middlewares/CORS';
import { routeHandler } from '../routes/route';

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
        routeHandler(req, res, body);
    });
});

export { server };
