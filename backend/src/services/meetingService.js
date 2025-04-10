"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeeting = exports.updateMeeting = exports.createMeeting = exports.getMeeting = exports.getMeetings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const meeting_1 = __importDefault(require("../models/meeting"));
const getMeetings = async (page, limit, filter) => {
    const skip = (page - 1) * limit;
    const query = filter ? { title: { $regex: filter, $options: 'i' } } : {};
    const meetings = await meeting_1.default.find(query)
        .skip(skip)
        .limit(limit);
    console.log("Skip value:", skip);
    const totalCount = await meeting_1.default.countDocuments(query);
    return { meetings,
        totalCount,
        "totalPages": Math.ceil(totalCount / limit),
        "currentPage": page
    };
};
exports.getMeetings = getMeetings;
const getMeeting = async (id) => {
    return await meeting_1.default.findById(id);
};
exports.getMeeting = getMeeting;
const createMeeting = async (data) => {
    try {
        console.log('Creating Meeting:', data);
        const meeting = new meeting_1.default(data);
        return await meeting.save();
    }
    catch (error) {
        console.error('Error creating meeting:', error);
        throw new Error('Failed to create meeting');
    }
};
exports.createMeeting = createMeeting;
const updateMeeting = async (id, data) => {
    debugger;
    console.log(id, data);
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Meeting ID');
    }
    const allowedFields = ['title', 'startTime', 'endTime', 'participants'];
    // Filter out unwanted fields & ensure only valid fields are updated
    const filteredData = {};
    for (const key of Object.keys(data)) {
        if (allowedFields.includes(key) && data[key] !== undefined) {
            filteredData[key] = data[key];
        }
    }
    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields provided for update.');
    }
    return await meeting_1.default.findByIdAndUpdate(id, { $set: filteredData }, { new: true, runValidators: true });
};
exports.updateMeeting = updateMeeting;
const deleteMeeting = async (id) => {
    return await meeting_1.default.findByIdAndDelete(id);
};
exports.deleteMeeting = deleteMeeting;
