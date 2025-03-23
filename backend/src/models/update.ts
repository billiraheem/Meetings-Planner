import mongoose from 'mongoose';


const updateSchema = new mongoose.Schema({
    title: { type: String, default: null },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    participants: { type: [String], default: null }
});

const Update = mongoose.model('Update', updateSchema);

export default Update;