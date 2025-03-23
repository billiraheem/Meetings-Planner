import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { handleGetMeetings, handleCreateMeeting, handleUpdateMeeting,
     handleDeleteMeeting, handleGetMeeting } from '../controllers/meetingController'; 
import { errorHandler } from '../middlewares/errorHandler';

const routes: Record<string, (req: IncomingMessage, res: ServerResponse, params?: any, body?: string) => void> = {
    'GET /api/meetings': (req, res, _, body) => handleGetMeetings(req, res, new URL(req.url!, `http://${req.headers.host}`).searchParams),
    'POST /api/meetings': (req, res, _, body) => handleCreateMeeting(req, res, body!),
    'GET /api/meetings/:id': (req, res, params) => handleGetMeeting(req, res, params.id),
    'PUT /api/meetings/:id': (req, res, params, body) => handleUpdateMeeting(req, res, params.id, body!),
    'DELETE /api/meetings/:id': (req, res, params) => handleDeleteMeeting(req, res, params.id),
};

export const routeHandler = (req: IncomingMessage, res: ServerResponse, body: string) => {
    const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    const dynamicRoute = Object.keys(routes).find(route => {
        const [routeMethod, routePath] = route.split(' ');
        if (routeMethod !== method) return false;

        const routeSegments = routePath.split('/');
        const requestSegments = pathname.split('/');

        if (routeSegments.length !== requestSegments.length) return false;

        return routeSegments.every((seg, i) => seg.startsWith(':') || seg === requestSegments[i]);
    });

    if (dynamicRoute) {
        const [_, routePath] = dynamicRoute.split(' ');
        const routeSegments = routePath.split('/');
        const requestSegments = pathname.split('/');

        const params: Record<string, string> = {};
        routeSegments.forEach((seg, i) => {
            if (seg.startsWith(':')) params[seg.substring(1)] = requestSegments[i];
        });

        routes[dynamicRoute](req, res, params, body);
    } else {
        errorHandler(res, 404, 'Not Found');
    }
};