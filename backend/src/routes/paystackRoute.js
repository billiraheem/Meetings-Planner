"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const paystackController_1 = require("../controllers/paystackController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/initialize', auth_1.authenticateUser, paystackController_1.handleInitializePayment);
router.post('/webhook', express_2.default.raw({ type: 'application/json' }), paystackController_1.handleWebhook);
router.get('/callback', paystackController_1.handlePaymentCallback);
router.get('/subscription-status', auth_1.authenticateUser, paystackController_1.checkSubscriptionStatus);
exports.default = router;
