import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import connectDB from '../config/DB';
import { handleGetMeetings, handleCreateMeeting, handleUpdateMeeting, handleDeleteMeeting, handleGetMeeting } from '../controllers/meetingController'; 
import { corsMiddleware } from '../middlewares/CORS';
import { errorHandler } from '../middlewares/errorHandler';

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

    await new Promise(resolve => req.on('end', resolve));

    if (pathname === '/api/meetings' ) {
        switch(method) {
            case 'GET':
                handleGetMeetings(req, res, query);
                break;
            case 'POST':
                handleCreateMeeting(req, res, body);
                break;
            default:
                errorHandler(res, 405, 'Method Not Allowed');
        }
    } else if (pathname.startsWith('/api/meetings')) {
        const id = pathname.split('/')[3];
        switch(method) {
            case 'GET':
                handleGetMeeting(req, res, id);
                break;
            case 'PUT':
                handleUpdateMeeting(req, res, id, body);
                break;
            case 'DELETE':
                handleDeleteMeeting(req, res, id);
                break;
            default: 
            errorHandler(res, 405, 'Method Not Allowed');
        }
    } else {
        errorHandler(res, 404, 'Not Found');
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
