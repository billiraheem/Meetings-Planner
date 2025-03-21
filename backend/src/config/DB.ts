import mongoose from 'mongoose';
import * as dotenv from 'dotenv'; 

// import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;