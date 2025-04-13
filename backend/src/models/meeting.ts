import mongoose, { Schema } from 'mongoose';

export interface Meeting extends Document {
    title: string;
    startTime: Date;
    endTime: Date;
    participants: string[];
    userId?: mongoose.Types.ObjectId;
}

const meetingSchema = new Schema<Meeting>({
    title: String,
    startTime: Date,
    endTime: Date,
    participants: [String],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});

const Meeting = mongoose.model<Meeting>('Meeting', meetingSchema);

export default Meeting;

