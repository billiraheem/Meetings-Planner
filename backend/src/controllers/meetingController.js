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
const emailService_1 = require("../services/emailService");
const handleGetMeetings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const filter = req.query.filter || "";
    // Get user ID from authenticated request
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({
            Error: true,
            errorMessage: "Unauthorized",
            responseCode: "401" /* globalResponseCodes.UNAUTHORIZED */,
        });
        return;
    }
    try {
        const { meetings, totalPages } = yield (0, meetingService_1.getMeetings)(page, limit, filter, userId);
        res.status(200).json({
            Success: true,
            responseMessage: "Sucessful!",
            responseCode: "200" /* globalResponseCodes.SUCCESSFUL */,
            data: meetings,
            totalPages,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: true,
            errorMessage: "Internal Server Error",
            responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */,
        });
    }
});
exports.handleGetMeetings = handleGetMeetings;
const handleGetMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const meeting = yield (0, meetingService_1.getMeeting)(id);
        if (!meeting) {
            res.status(404).json({
                Error: true,
                errorMessage: "Meeting not found",
                responseCode: "404" /* globalResponseCodes.NOT_FOUND */,
            });
            return;
        }
        res.status(200).json({
            Success: true,
            responseMessage: "Sucessful!",
            responseCode: "200" /* globalResponseCodes.SUCCESSFUL */,
            data: meeting,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: true,
            errorMessage: "Internal Server Error",
            responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */,
        });
    }
});
exports.handleGetMeeting = handleGetMeeting;
const handleCreateMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
        // console.log("req.user:", { userId, email });
        if (!userId || !email) {
            res.status(401).json({ Error: true, errorMessage: "Unauthorized", responseCode: "401" /* globalResponseCodes.UNAUTHORIZED */ });
            return;
        }
        const data = req.body;
        if (!data.title || !data.startTime || !data.endTime || !data.participants) {
            res.status(400).json({
                Error: true,
                errorMessage: "All fields are required",
                responseCode: "400" /* globalResponseCodes.BAD_REQUEST */,
            });
            return;
        }
        // Add the userId to the meeting data
        data.userId = userId;
        // console.log("Request:",req)
        const newMeeting = yield (0, meetingService_1.createMeeting)(data);
        // console.log('New meeting created:', newMeeting);
        // Debug: Check what user data we have
        // console.log('User data in create meeting:', req.user);
        // Get user email from the updated req.user object
        // const userEmail = req.user?.email;
        // console.log(req.user)
        // if (!userEmail) {
        //   res
        //     .status(401)
        //     .json({ Error: true, errorMessage: "User email not found" });
        //   return;
        // }
        // Send creation email
        yield (0, emailService_1.sendMeetingCreatedEmail)(email, newMeeting);
        // Schedule reminder 10 minutes before
        (0, emailService_1.scheduleMeetingReminder)(email, newMeeting);
        res.status(201).json({
            Success: true,
            responseMessage: "New meeting created!",
            responseCode: "201" /* globalResponseCodes.CREATED */,
            data: newMeeting,
        });
    }
    catch (error) {
        console.error("Error in handleCreateMeeting:", error);
        res.status(500).json({
            Error: true,
            errorMessage: "Meeting not created",
            responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */,
        });
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
            res.status(400).json({
                Error: true,
                errorMessage: "Meeting ID required",
                responseCode: "400" /* globalResponseCodes.BAD_REQUEST */,
            });
            return;
        }
        if (!req.body) {
            res.status(400).json({
                Error: true,
                errorMessage: "Request body is missing",
                responseCode: "400" /* globalResponseCodes.BAD_REQUEST */,
            });
            return;
        }
        const parsedBody = req.body;
        if (Object.keys(parsedBody).length === 0) {
            res.status(400).json({
                Error: true,
                errorMessage: "No valid fields provided for update",
                responseCode: "400" /* globalResponseCodes.BAD_REQUEST */,
            });
            return;
        }
        const updatedMeeting = yield (0, meetingService_1.updateMeeting)(id, parsedBody);
        if (!updatedMeeting) {
            res.status(404).json({
                Error: true,
                errorMessage: "Meeting not found",
                responseCode: "404" /* globalResponseCodes.NOT_FOUND */,
            });
            return;
        }
        res.status(200).json({
            Success: true,
            responseMessage: "Meeting updated successfully!",
            responseCode: "200" /* globalResponseCodes.SUCCESSFUL */,
            data: updatedMeeting,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: true,
            errorMessage: "Meeting not updated",
            responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */,
        });
    }
});
exports.handleUpdateMeeting = handleUpdateMeeting;
const handleDeleteMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMeeting = yield (0, meetingService_1.deleteMeeting)(id);
        if (!deletedMeeting) {
            res.status(404).json({
                Error: true,
                errorMessage: "Meeting not found",
                responseCode: "404" /* globalResponseCodes.NOT_FOUND */,
            });
            return;
        }
        res.status(200).json({
            Success: true,
            responseMessage: "Meeting deleted successfully!",
            responseCode: "200" /* globalResponseCodes.SUCCESSFUL */,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: true,
            errorMessage: "Meeting not deleted",
            responseCode: "500" /* globalResponseCodes.INTERNAL_SERVER_REQUEST */,
        });
    }
});
exports.handleDeleteMeeting = handleDeleteMeeting;
