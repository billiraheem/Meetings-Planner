import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
    title: String,
    startTime: Date,
    endTime: Date,
    participants: [String]
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;