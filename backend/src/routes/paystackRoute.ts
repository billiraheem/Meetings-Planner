import { Router } from 'express';
import express from 'express';
import { handleInitializePayment, handleWebhook, handlePaymentCallback, checkSubscriptionStatus } from '../controllers/paystackController';
import { authenticateUser } from '../middlewares/auth';

const router = Router();

router.post('/initialize', authenticateUser, handleInitializePayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/callback', handlePaymentCallback);
router.get('/subscription-status', authenticateUser, checkSubscriptionStatus);

export default router;