import axios from "axios";
import * as dotenv from "dotenv";
import crypto from 'crypto';

dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

interface InitializeTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
    };
    metadata: any;
  };
}

export const initializePayment = async (
  email: string,
  amount: number, // In kobo (NGN * 100)
  callbackUrl: string,
  metadata?: any
): Promise<InitializeTransactionResponse> => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        callback_url: callbackUrl,
        metadata
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Initialize payment error:", error);
    throw new Error("Failed to initialize payment");
  }
};

export const verifyPayment = async (reference: string): Promise<VerifyTransactionResponse>  => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw new Error("Failed to verify payment");
  }
};

export const validateWebhookSignature = (signature: string, requestBody: any): boolean => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET || '')
    .update(JSON.stringify(requestBody))
    .digest('hex');
  
  return hash === signature;
};