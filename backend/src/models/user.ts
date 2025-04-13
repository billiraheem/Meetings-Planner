import { ObjectId } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface Subscription {
  status: "free" | "premium";
  transactionId?: string;
  expiresAt?: Date;
}
export interface User extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  subscription?: Subscription;
  isAdmin?: boolean;
  refreshToken?: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  refreshToken: { type: String },
  subscription: {
    status: { type: String, enum: ["free", "premium"], default: "free" },
    transactionId: { type: String },
    expiresAt: { type: Date },
  },
});

const User = mongoose.model<User>("Users", userSchema);

export default User;
