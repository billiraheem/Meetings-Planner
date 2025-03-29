"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteMeeting = exports.handleUpdateMeeting = exports.handleCreateMeeting = exports.handleGetMeeting = exports.handleGetMeetings = void 0;
const meetingService_1 = require("../services/meetingService");
const handleGetMeetings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const filter = req.query.filter || '';
    try {
        const meetings = yield (0, meetingService_1.getMeetings)(page, limit, filter);
        res.status(200).json({ meetings, message: "Sucessful!" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.handleGetMeetings = handleGetMeetings;
const handleGetMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const meeting = yield (0, meetingService_1.getMeeting)(id);
        if (!meeting) {
            res.status(404).json({ error: 'Meeting not found' });
        }
        ;
        res.status(200).json({ meeting, message: "Sucessful!" });
    }
    catch (error) {
        res.status(400).json({ error: "Invalid Request" });
    }
});
exports.handleGetMeeting = handleGetMeeting;
const handleCreateMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data.title || !data.startTime || !data.endTime || !data.participants) {
            res.status(400).json({ error: 'All fields are required' });
        }
        const newMeeting = yield (0, meetingService_1.createMeeting)(data);
        res.status(201).json({ meeting: newMeeting, message: "New meeting created!" });
    }
    catch (error) {
        console.error('Error in handleCreateMeeting:', error);
        res.status(400).json({ error: "Invalid Request" });
    }
});
exports.handleCreateMeeting = handleCreateMeeting;
const handleUpdateMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(400).json({ error: 'Request body is missing' });
        }
        const parsedBody = req.body;
        if (Object.keys(parsedBody).length === 0) {
            res.status(400).json({ error: 'No valid fields provided for update' });
        }
        const updatedMeeting = yield (0, meetingService_1.updateMeeting)(id, parsedBody);
        if (!updatedMeeting) {
            res.status(404).json({ error: 'Meeting not found' });
        }
        res.status(200).json({
            meeting: updatedMeeting,
            meesage: "Meeting updated successfully!"
        });
    }
    catch (error) {
        res.status(400).json({ error: "Invalid Request" });
    }
});
exports.handleUpdateMeeting = handleUpdateMeeting;
const handleDeleteMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMeeting = yield (0, meetingService_1.deleteMeeting)(id);
        if (!deletedMeeting) {
            res.status(404).json({ error: 'Meeting not found' });
        }
        ;
        res.status(200).json({ message: "Meeting deleted successfully!" });
    }
    catch (error) {
        res.status(400).json({ error: "Invalid Request" });
    }
});
exports.handleDeleteMeeting = handleDeleteMeeting;
