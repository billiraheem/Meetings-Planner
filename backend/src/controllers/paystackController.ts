import { Request, Response } from "express";
import crypto from "crypto";
import * as dotenv from "dotenv";
import User from "../models/user";
import { AuthenticatedRequest } from "../middlewares/auth";
import {
  initializePayment,
  validateWebhookSignature,
  verifyPayment,
} from "../services/paystackService";

dotenv.config();

// Constants
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SUBSCRIPTION_AMOUNT = 100000; // NGN 1,000 (in kobo)
const SUBSCRIPTION_DURATION_DAYS = 30;

export const handleInitializePayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const email = req.user?.email;
    if (!userId || !email) {
      res.status(401).json({ Error: true, errorMessage: "Unauthorized" });
      return;
    }

    const amount = SUBSCRIPTION_AMOUNT;
    const callbackUrl = `${FRONTEND_URL}/payment-callback`;

    const payment = await initializePayment(email, amount, callbackUrl, {
      userId,
    });
    res.status(200).json({
      Success: true,
      responseMessage: "Payment initialized",
      data: payment.data,
    });
  } catch (error) {
    console.error("Initialize payment error:", error);
    res
      .status(500)
      .json({ Error: true, errorMessage: "Payment initialization failed" });
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const signature = req.headers["x-paystack-signature"] as string;
    if (!signature || !validateWebhookSignature(signature, req.body)) {
      console.log("Invalid Paystack signature");
      res.status(401).json({ Error: true, errorMessage: "Invalid signature" });
      return;
    }

    const event = req.body;
    console.log("Webhook event:", event);

    if (event.event === "charge.success") {
      const { reference, customer, metadata } = event.data;
      const verification = await verifyPayment(reference);

      if (verification.status && verification.data.status === "success") {
        // Find user either by email or by userId from metadata if available
        const userQuery = metadata?.userId
          ? { _id: metadata.userId }
          : { email: customer.email };

        const user = await User.findOne(userQuery);
        if (user) {
          user.subscription = {
            status: "premium",
            transactionId: reference,
            expiresAt: new Date(
              Date.now() + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000
            ), // 30 days
          };
          await user.save();
          console.log(`User ${user.email} upgraded to premium`);
        }
      }
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook error:", error);
    console.log("Webhook error details:", error);
    res
      .status(500)
      .json({ Error: true, errorMessage: "Webhook processing failed" });
  }
};

export const handlePaymentCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reference } = req.query;
    if (!reference || typeof reference !== "string") {
      res.status(400).json({ Error: true, errorMessage: "Invalid reference" });
      return;
    }

    const verification = await verifyPayment(reference);
    if (verification.status && verification.data.status === "success") {
      // Webhook handles subscription update, so redirect to success page
      res.redirect(`${FRONTEND_URL}/payment-success`);
    } else {
      res.redirect(`${FRONTEND_URL}/payment-failure`);
    }
  } catch (error) {
    console.error("Callback error:", error);
    res.redirect(`${FRONTEND_URL}/payment-failure`);
  }
};

// New endpoint to check user subscription status
export const checkSubscriptionStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ Error: true, errorMessage: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ Error: true, errorMessage: "User not found" });
      return;
    }

    // Check if user has an active premium subscription
    const hasPremium =
      user.subscription?.status === "premium" &&
      user.subscription.expiresAt &&
      user.subscription.expiresAt > new Date();

    res.status(200).json({
      Success: true,
      data: {
        subscriptionStatus: user.subscription?.status || "free",
        isPremium: hasPremium,
        expiresAt: user.subscription?.expiresAt,
      },
    });
  } catch (error) {
    console.error("Check subscription error:", error);
    res
      .status(500)
      .json({ Error: true, errorMessage: "Failed to check subscription" });
  }
};
