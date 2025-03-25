import { IncomingMessage, ServerResponse } from 'http';
import { getMeetings, createMeeting, updateMeeting, deleteMeeting, getMeeting } from '../services/meetingService';
import { sendResponse } from '../middlewares/sendResponse';

export const handleGetMeetings = async (req: IncomingMessage, res: ServerResponse, query: URLSearchParams) => {
    const page = parseInt(query.get('page') || '1', 10);
    const limit = parseInt(query.get('limit') || '10', 10);
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
        if (!body) {
            return sendResponse(res, 400, { error: 'Request body is missing' });
        } 

        const data = JSON.parse(body);
        if (!data.title || !data.startTime || !data.endTime || !data.participants) {
            return sendResponse(res, 400, { error: 'All fields are required' });
        }

        const newMeeting = await createMeeting(data);
        sendResponse(res, 201, newMeeting);
    } catch (error) {
        console.error('Error in handleCreateMeeting:', error);
        sendResponse(res, 400, { error: 'Invalid request' });
    }
};

export const handleUpdateMeeting = async (req: IncomingMessage, res: ServerResponse, id: string, body: string) => {
    try {
        // debugger
        // console.log('PUT Request Received');
        // console.log('Received ID:', id);
        // console.log('Raw Body:', body);

        if (!id) {
            return sendResponse(res, 400, { error: 'Meeting ID is required' });
        }

        if (!body) {
            return sendResponse(res, 400, { error: 'Request body is missing' });
        } 

        const parsedBody = JSON.parse(body);
        if (Object.keys(parsedBody).length === 0) {
            return sendResponse(res, 400, { error: 'No valid fields provided for update' });
        }

        const updatedMeeting = await updateMeeting(id, parsedBody);
        console.log('Updated Meeting:', updatedMeeting);
        console.log(updatedMeeting)
        if (!updatedMeeting) {
            console.log('Meeting Not Found!');
            return sendResponse(res, 404, { error: 'Meeting not found' });
        }

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