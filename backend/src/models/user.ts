import { ObjectId } from "mongoose";
import mongoose, { Schema } from 'mongoose';

export interface User extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken?: string;
    refreshToken?: string;
};

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    // name: String,
    // email: String,
    // password: String,
    // isVerified: Boolean,
    // verificationToken: String,
    // refreshToken: String,
});

const User = mongoose.model<User>('Users', userSchema);

export default User;