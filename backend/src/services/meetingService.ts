import Meeting from '../models/meeting';

export const getMeetings = async (page: number, limit: number, filter: string) => {
    const query = filter ? { title: { $regex: filter, $options: 'i' } } : {};
    const meetings = await Meeting.find(query)
                                  .skip((page - 1) * limit)
                                  .limit(limit);
    const totalCount = await Meeting.countDocuments(query);
    return { meetings, totalCount };
};

export const getMeeting = async (id: string) => {
    return await Meeting.findById(id);
};

export const createMeeting = async (data: any) => {
    const meeting = new Meeting(data);
    return await meeting.save();
};

export const updateMeeting = async (id: string, data: any) => {
    return await Meeting.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMeeting = async (id: string) => {
    return await Meeting.findByIdAndDelete(id);
};