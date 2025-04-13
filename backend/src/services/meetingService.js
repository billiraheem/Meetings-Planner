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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeeting = exports.updateMeeting = exports.createMeeting = exports.getMeeting = exports.getMeetings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const meeting_1 = __importDefault(require("../models/meeting"));
const getMeetings = (page, limit, filter, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    // Add userId to the filter
    const query = { userId: userId };
    // Add title search if filter is provided
    if (filter) {
        query.title = { $regex: filter, $options: 'i' };
    }
    // const query = filter ? { title: { $regex: filter, $options: 'i' } } : {};
    const meetings = yield meeting_1.default.find(query)
        .skip(skip)
        .limit(limit);
    // console.log("Skip value:", skip);
    const totalCount = yield meeting_1.default.countDocuments(query);
    return { meetings,
        totalCount,
        "totalPages": Math.ceil(totalCount / limit),
        "currentPage": page
    };
});
exports.getMeetings = getMeetings;
const getMeeting = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield meeting_1.default.findById(id);
});
exports.getMeeting = getMeeting;
const createMeeting = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating Meeting:', data);
        const meeting = new meeting_1.default(data);
        return yield meeting.save();
    }
    catch (error) {
        console.error('Error creating meeting:', error);
        throw new Error('Failed to create meeting');
    }
});
exports.createMeeting = createMeeting;
const updateMeeting = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield meeting_1.default.findByIdAndUpdate(id, { $set: filteredData }, { new: true, runValidators: true });
});
exports.updateMeeting = updateMeeting;
const deleteMeeting = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield meeting_1.default.findByIdAndDelete(id);
});
exports.deleteMeeting = deleteMeeting;
