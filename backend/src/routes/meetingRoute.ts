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
