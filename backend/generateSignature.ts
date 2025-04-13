import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.PAYSTACK_SECRET_KEY;
if (!secret) {
  console.log("wrong key")
  process.exit(1)
}
const body = JSON.stringify({
  event: 'charge.success',
  data: {
    reference: "x3cfn41yxy",
    amount: 100000,
    customer: { email: 'balikisraheem2002@gmail.com' },
    status: 'success',
    metadata: {
      userId: "67fab5d367a5e1e71c31c0e2"
    }
  }
});

const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
console.log('Signature:', hash);