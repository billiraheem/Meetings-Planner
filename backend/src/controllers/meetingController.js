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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteMeeting = exports.handleUpdateMeeting = exports.handleCreateMeeting = exports.handleGetMeeting = exports.handleGetMeetings = void 0;
var meetingService_1 = require("../services/meetingService");
var sendResponse_1 = require("../middlewares/sendResponse");
var handleGetMeetings = function (req, res, query) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, filter, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(query.get('page') || '1', 10);
                limit = parseInt(query.get('limit') || '10', 10);
                filter = query.get('filter') || '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, meetingService_1.getMeetings)(page, limit, filter)];
            case 2:
                result = _a.sent();
                (0, sendResponse_1.sendResponse)(res, 200, result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                (0, sendResponse_1.sendResponse)(res, 500, { error: 'Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handleGetMeetings = handleGetMeetings;
var handleGetMeeting = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var meeting, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, meetingService_1.getMeeting)(id)];
            case 1:
                meeting = _a.sent();
                if (!meeting) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 404, { error: 'Meeting not found' })];
                }
                ;
                (0, sendResponse_1.sendResponse)(res, 200, meeting);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Invalid request' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.handleGetMeeting = handleGetMeeting;
var handleCreateMeeting = function (req, res, body) { return __awaiter(void 0, void 0, void 0, function () {
    var data, newMeeting, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!body) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 400, { error: 'Request body is missing' })];
                }
                data = JSON.parse(body);
                if (!data.title || !data.startTime || !data.endTime || !data.participants) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 400, { error: 'All fields are required' })];
                }
                return [4 /*yield*/, (0, meetingService_1.createMeeting)(data)];
            case 1:
                newMeeting = _a.sent();
                (0, sendResponse_1.sendResponse)(res, 201, newMeeting);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error in handleCreateMeeting:', error_3);
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Invalid request' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.handleCreateMeeting = handleCreateMeeting;
var handleUpdateMeeting = function (req, res, id, body) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedBody, updatedMeeting, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // debugger
                // console.log('PUT Request Received');
                // console.log('Received ID:', id);
                // console.log('Raw Body:', body);
                if (!id) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 400, { error: 'Meeting ID is required' })];
                }
                if (!body) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 400, { error: 'Request body is missing' })];
                }
                parsedBody = JSON.parse(body);
                if (Object.keys(parsedBody).length === 0) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 400, { error: 'No valid fields provided for update' })];
                }
                return [4 /*yield*/, (0, meetingService_1.updateMeeting)(id, parsedBody)];
            case 1:
                updatedMeeting = _a.sent();
                console.log('Updated Meeting:', updatedMeeting);
                console.log(updatedMeeting);
                if (!updatedMeeting) {
                    console.log('Meeting Not Found!');
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 404, { error: 'Meeting not found' })];
                }
                (0, sendResponse_1.sendResponse)(res, 200, updatedMeeting);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Invalid request' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.handleUpdateMeeting = handleUpdateMeeting;
var handleDeleteMeeting = function (req, res, id) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedMeeting, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, meetingService_1.deleteMeeting)(id)];
            case 1:
                deletedMeeting = _a.sent();
                if (!deletedMeeting) {
                    return [2 /*return*/, (0, sendResponse_1.sendResponse)(res, 404, { error: 'Meeting not found' })];
                }
                ;
                (0, sendResponse_1.sendResponse)(res, 204, null);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Invalid request' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.handleDeleteMeeting = handleDeleteMeeting;
