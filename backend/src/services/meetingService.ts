import mongoose from 'mongoose';
import Meeting from '../models/meeting';

export const getMeetings = async (page: number, limit: number, filter: string, userId: string) => {
    const skip = (page - 1) * limit;

    // Add userId to the filter
    const query: any = { userId: userId };

    // Add title search if filter is provided
    if (filter) {
        query.title = { $regex: filter, $options: 'i' };
    }

    // const query = filter ? { title: { $regex: filter, $options: 'i' } } : {};
    const meetings = await Meeting.find(query)
                                  .skip(skip)
                                  .limit(limit);
    // console.log("Skip value:", skip);
    const totalCount = await Meeting.countDocuments(query);
    return { meetings, 
        totalCount,
        "totalPages": Math.ceil(totalCount / limit),
        "currentPage": page 
    };
};

export const getMeeting = async (id: string) => {
    return await Meeting.findById(id);
};

export const createMeeting = async (data: any) => {
    try {
        console.log('Creating Meeting:', data);
        const meeting = new Meeting(data);
        return await meeting.save();
    } catch (error) {
        console.error('Error creating meeting:', error);
        throw new Error('Failed to create meeting');
    }
};

export const updateMeeting = async (id: string, data: Partial<Record<string, any>>) => {
    debugger
    console.log(id, data)

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Meeting ID');
    }

    const allowedFields = ['title', 'startTime', 'endTime', 'participants'];

    // Filter out unwanted fields & ensure only valid fields are updated
    const filteredData: Record<string, any> = {};
    for (const key of Object.keys(data)) {
        if (allowedFields.includes(key) && data[key] !== undefined) {
            filteredData[key] = data[key];
        }
    }

    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields provided for update.');
    }

    return await Meeting.findByIdAndUpdate(id, { $set: filteredData }, { new: true, runValidators: true });
};

export const deleteMeeting = async (id: string) => {
    return await Meeting.findByIdAndDelete(id);
};