import { Request, Response } from 'express';
import { getMeetings, createMeeting, updateMeeting, deleteMeeting, getMeeting } from '../services/meetingService';
import { sendResponse } from '../middlewares/sendResponse';

export const handleGetMeetings = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const filter = req.query.filter as string || '';

    try {
        const meetings = await getMeetings(page, limit, filter);
        res.status(200).json({ meetings, message: "Sucessful!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const handleGetMeeting = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const meeting = await getMeeting(id);
        if (!meeting) {
            res.status(404).json({ error: 'Meeting not found' })
        };
        res.status(200).json({ meeting, message: "Sucessful!" });
    } catch (error) {
        res.status(400).json({ error: "Invalid Request" });
    }
};

export const handleCreateMeeting = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data.title || !data.startTime || !data.endTime || !data.participants) {
            res.status(400).json({ error: 'All fields are required' });
        }

        const newMeeting = await createMeeting(data);
        res.status(201).json({ meeting: newMeeting, message: "New meeting created!" });
    } catch (error) {
        console.error('Error in handleCreateMeeting:', error);
        res.status(400).json({ error: "Invalid Request" });
    }
};

export const handleUpdateMeeting = async (req: Request, res: Response) => {
    try {
        // debugger
        // console.log('PUT Request Received');
        // console.log('Received ID:', id);
        // console.log('Raw Body:', body);

        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "Meeting ID required" });
        }

        if (!req.body) {
            res.status(400).json({ error: 'Request body is missing' })
        } 

        const parsedBody = req.body;
        if (Object.keys(parsedBody).length === 0) {
            res.status(400).json({ error: 'No valid fields provided for update' });
        }

        const updatedMeeting = await updateMeeting(id, parsedBody);
        if (!updatedMeeting) {
            res.status(404).json({ error: 'Meeting not found' });
        }

        res.status(200).json({
            meeting: updatedMeeting,
            meesage: "Meeting updated successfully!"
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid Request" });
    }
};

export const handleDeleteMeeting = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedMeeting = await deleteMeeting(id);
        if (!deletedMeeting) {
            res.status(404).json({ error: 'Meeting not found' });
        };
        res.status(200).json({ message: "Meeting deleted successfully!"});
    } catch (error) {
        res.status(400).json({ error: "Invalid Request" });
    }
};