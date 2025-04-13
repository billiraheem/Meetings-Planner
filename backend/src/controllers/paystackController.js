"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.checkSubscriptionStatus = exports.handlePaymentCallback = exports.handleWebhook = exports.handleInitializePayment = void 0;
const dotenv = __importStar(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const paystackService_1 = require("../services/paystackService");
dotenv.config();
// Constants
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SUBSCRIPTION_AMOUNT = 100000; // NGN 1,000 (in kobo)
const SUBSCRIPTION_DURATION_DAYS = 30;
const handleInitializePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
        if (!userId || !email) {
            res.status(401).json({ Error: true, errorMessage: "Unauthorized" });
            return;
        }
        const amount = SUBSCRIPTION_AMOUNT;
        const callbackUrl = `${FRONTEND_URL}/payment-callback`;
        const payment = yield (0, paystackService_1.initializePayment)(email, amount, callbackUrl, {
            userId,
        });
        res.status(200).json({
            Success: true,
            responseMessage: "Payment initialized",
            data: payment.data,
        });
    }
    catch (error) {
        console.error("Initialize payment error:", error);
        res
            .status(500)
            .json({ Error: true, errorMessage: "Payment initialization failed" });
    }
});
exports.handleInitializePayment = handleInitializePayment;
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const secret = process.env.PAYSTACK_SECRET_KEY
        // if (!secret) {
        //   res.status(500).json({ Error: true, errorMessage: 'Server configuration error' });
        //   return;
        // }
        // const hash = crypto
        //   .createHmac('sha512', secret)
        //   .update(JSON.stringify(req.body))
        //   .digest('hex');
        const signature = req.headers["x-paystack-signature"];
        if (!signature || !(0, paystackService_1.validateWebhookSignature)(signature, req.body)) {
            console.log("Invalid Paystack signature");
            res.status(401).json({ Error: true, errorMessage: "Invalid signature" });
            return;
        }
        const event = req.body;
        console.log("Webhook event:", event);
        if (event.event === "charge.success") {
            const { reference, customer, metadata } = event.data;
            const verification = yield (0, paystackService_1.verifyPayment)(reference);
            if (verification.status && verification.data.status === "success") {
                // Find user either by email or by userId from metadata if available
                const userQuery = (metadata === null || metadata === void 0 ? void 0 : metadata.userId)
                    ? { _id: metadata.userId }
                    : { email: customer.email };
                const user = yield user_1.default.findOne(userQuery);
                if (user) {
                    user.subscription = {
                        status: "premium",
                        transactionId: reference,
                        expiresAt: new Date(Date.now() + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000), // 30 days
                    };
                    yield user.save();
                    console.log(`User ${user.email} upgraded to premium`);
                }
            }
        }
        res.status(200).send("Webhook received");
    }
    catch (error) {
        console.error("Webhook error:", error);
        console.log("Webhook error details:", error);
        res
            .status(500)
            .json({ Error: true, errorMessage: "Webhook processing failed" });
    }
});
exports.handleWebhook = handleWebhook;
const handlePaymentCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference } = req.query;
        if (!reference || typeof reference !== "string") {
            res.status(400).json({ Error: true, errorMessage: "Invalid reference" });
            return;
        }
        const verification = yield (0, paystackService_1.verifyPayment)(reference);
        if (verification.status && verification.data.status === "success") {
            // Webhook handles subscription update, so redirect to success page
            res.redirect(`${FRONTEND_URL}/payment-success`);
        }
        else {
            res.redirect(`${FRONTEND_URL}/payment-failure`);
        }
    }
    catch (error) {
        console.error("Callback error:", error);
        res.redirect(`${FRONTEND_URL}/payment-failure`);
    }
});
exports.handlePaymentCallback = handlePaymentCallback;
// New endpoint to check user subscription status
const checkSubscriptionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ Error: true, errorMessage: "Unauthorized" });
            return;
        }
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ Error: true, errorMessage: "User not found" });
            return;
        }
        // Check if user has an active premium subscription
        const hasPremium = ((_b = user.subscription) === null || _b === void 0 ? void 0 : _b.status) === "premium" &&
            user.subscription.expiresAt &&
            user.subscription.expiresAt > new Date();
        res.status(200).json({
            Success: true,
            data: {
                subscriptionStatus: ((_c = user.subscription) === null || _c === void 0 ? void 0 : _c.status) || "free",
                isPremium: hasPremium,
                expiresAt: (_d = user.subscription) === null || _d === void 0 ? void 0 : _d.expiresAt,
            },
        });
    }
    catch (error) {
        console.error("Check subscription error:", error);
        res
            .status(500)
            .json({ Error: true, errorMessage: "Failed to check subscription" });
    }
});
exports.checkSubscriptionStatus = checkSubscriptionStatus;
