import { IncomingMessage, ServerResponse } from 'http';
import { getMeetings, createMeeting, updateMeeting, deleteMeeting, getMeeting } from '../services/meetingService';

export const handleGetMeetings = async (req: IncomingMessage, res: ServerResponse, query: URLSearchParams) => {
    const page = parseInt(query.get('page_number') || '1', 10);
    const limit = parseInt(query.get('page_size') || '10', 10);
    const filter = query.get('filter') || '';

    try {
        const result = await getMeetings(page, limit, filter);
        sendResponse(res, 200, result);
    } catch (error) {
        sendResponse(res, 500, { error: 'Server Error' });
    }
};

export const handleGetMeeting = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    try {
        const meeting = await getMeeting(id);
        if (!meeting) {
            return sendResponse(res, 404, { error: 'Meeting not found' })
        };
        sendResponse(res, 200, meeting)
    } catch (error) {
        sendResponse(res, 400, { error: 'Invalid request' });
    }
};

export const handleCreateMeeting = async (req: IncomingMessage, res: ServerResponse, body: string) => {
    try {
        const data = JSON.parse(body);
        const newMeeting = await createMeeting(data);
        sendResponse(res, 201, newMeeting);
    } catch (error) {
        sendResponse(res, 400, { error: 'Invalid request' });
    }
};

export const handleUpdateMeeting = async (req: IncomingMessage, res: ServerResponse, id: string, body: string) => {
    try {
        debugger
        const updatedMeeting = await updateMeeting(id, JSON.parse(body));
        console.log(updatedMeeting)
        // if (!updatedMeeting) {
            // return sendResponse(res, 404, { error: 'Meeting not found' })
        // };
        sendResponse(res, 200, updatedMeeting);
    } catch (error) {
        sendResponse(res, 400, { error: 'Invalid request' });
    }
};

export const handleDeleteMeeting = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    try {
        const deletedMeeting = await deleteMeeting(id);
        if (!deletedMeeting) {
            return sendResponse(res, 404, { error: 'Meeting not found' })
        };
        sendResponse(res, 204, null);
    } catch (error) {
        sendResponse(res, 400, { error: 'Invalid request' });
    }
};

// Helper function to send response
const sendResponse = (res: ServerResponse, statusCode: number, data: any) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};