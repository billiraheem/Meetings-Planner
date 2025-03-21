"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var meetingSchema = new mongoose_1.default.Schema({
    title: String,
    startTime: Date,
    endTime: Date,
    participants: [String]
});
var Meeting = mongoose_1.default.model('Meeting', meetingSchema);
exports.default = Meeting;
