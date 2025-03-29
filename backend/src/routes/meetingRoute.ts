import express from 'express';
import { handleGetMeetings, handleCreateMeeting, handleUpdateMeeting, handleDeleteMeeting, handleGetMeeting } from '../controllers/meetingController';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticateUser, handleGetMeetings);
router.post('/', authenticateUser, handleCreateMeeting);
router.get('/:id', authenticateUser, handleGetMeeting);
router.put('/:id', authenticateUser, handleUpdateMeeting);
router.delete('/:id', authenticateUser, handleDeleteMeeting);

export default router;



// import { IncomingMessage, ServerResponse } from 'http';
// import { URL } from 'url';
// import { handleGetMeetings, handleCreateMeeting, handleUpdateMeeting,
//      handleDeleteMeeting, handleGetMeeting } from '../controllers/meetingController'; 
// import { errorHandler } from '../middlewares/errorHandler';
// import { authenticateUser } from '../middlewares/auth';

// interface AuthenticatedRequest extends Request {
//     user?: any;
// }

// const routes: Record<string, (req: Request, res: Response, params?: any, body?: string) => void> = {
//     'GET /api/meetings': (req, res, _, body) => authenticateUser(req as AuthenticatedRequest, res, 
//         () => handleGetMeetings(req as AuthenticatedRequest, res, new URL(req.url!, `http://${req.headers.host}`).searchParams)),
//     'POST /api/meetings': (req, res, _, body) => authenticateUser(req as AuthenticatedRequest, res, 
//         () => handleCreateMeeting(req as AuthenticatedRequest, res, body!)),
//     'GET /api/meetings/:id': (req, res, params) => authenticateUser(req as AuthenticatedRequest, res, 
//         () => handleGetMeeting(req as AuthenticatedRequest, res, params.id)),
//     'PUT /api/meetings/:id': (req, res, params, body) => authenticateUser(req as AuthenticatedRequest, res, 
//         () => handleUpdateMeeting(req as AuthenticatedRequest, res, params.id, body!)),
//     'DELETE /api/meetings/:id': (req, res, params) => authenticateUser(req as AuthenticatedRequest, res, 
//         () => handleDeleteMeeting(req as AuthenticatedRequest, res, params.id)),
//     // 'GET /api/meetings': (req, res, _, body) => authenticateUser(req, res, () => handleGetMeetings(req, res, new URL(req.url!, `http://${req.headers.host}`).searchParams)),
//     // 'POST /api/meetings': (req, res, _, body) => authenticateUser(req, res, () => handleCreateMeeting(req, res, body!)),
//     // 'GET /api/meetings/:id': (req, res, params) => authenticateUser(req, res, () => handleGetMeeting(req, res, params.id)),
//     // 'PUT /api/meetings/:id': (req, res, params, body) => authenticateUser(req, res, () => handleUpdateMeeting(req, res, params.id, body!)),
//     // 'DELETE /api/meetings/:id': (req, res, params) => authenticateUser(req, res, () => handleDeleteMeeting(req, res, params.id)),
// };

// export const routeHandler = (req: IncomingMessage, res: ServerResponse, body: string) => {
//     const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
//     const pathname = parsedUrl.pathname;
//     const method = req.method;

//     const dynamicRoute = Object.keys(routes).find(route => {
//         const [routeMethod, routePath] = route.split(' ');
//         if (routeMethod !== method) return false;

//         const routeSegments = routePath.split('/');
//         const requestSegments = pathname.split('/');

//         if (routeSegments.length !== requestSegments.length) return false;

//         return routeSegments.every((seg, i) => seg.startsWith(':') || seg === requestSegments[i]);
//     });

//     if (dynamicRoute) {
//         const [_, routePath] = dynamicRoute.split(' ');
//         const routeSegments = routePath.split('/');
//         const requestSegments = pathname.split('/');

//         const params: Record<string, string> = {};
//         routeSegments.forEach((seg, i) => {
//             if (seg.startsWith(':')) params[seg.substring(1)] = requestSegments[i];
//         });

//         routes[dynamicRoute](req, res, params, body);
//     } else {
//         errorHandler(res, 404, 'Not Found');
//     }
// };