import { ObjectId } from "mongoose";
import mongoose, { Schema } from 'mongoose';

export interface User extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean,
    refreshToken?: string;
};

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    refreshToken: { type: String },
});

const User = mongoose.model<User>('Users', userSchema);

export default User;