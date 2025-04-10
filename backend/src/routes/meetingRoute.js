"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const meetingController_1 = require("../controllers/meetingController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateUser, meetingController_1.handleGetMeetings);
router.post('/', auth_1.authenticateUser, meetingController_1.handleCreateMeeting);
router.get('/:id', auth_1.authenticateUser, meetingController_1.handleGetMeeting);
router.put('/:id', auth_1.authenticateUser, meetingController_1.handleUpdateMeeting);
router.delete('/:id', auth_1.authenticateUser, meetingController_1.handleDeleteMeeting);
exports.default = router;
