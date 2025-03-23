"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var updateSchema = new mongoose_1.default.Schema({
    title: { type: String, default: null },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    participants: { type: [String], default: null }
});
var Update = mongoose_1.default.model('Update', updateSchema);
exports.default = Update;
