import mongoose, { Schema } from 'mongoose';

export interface Meeting extends Document {
    title: string;
    startTime: Date;
    endTime: Date;
    participants: string[];
}

const meetingSchema = new Schema<Meeting>({
    title: String,
    startTime: Date,
    endTime: Date,
    participants: [String]
});

const Meeting = mongoose.model<Meeting>('Meeting', meetingSchema);

export default Meeting;

