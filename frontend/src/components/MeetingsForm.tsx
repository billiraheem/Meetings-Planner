import { useState } from 'react';
import { Meeting, meetingAPI } from '../services/api';
import { CustomButton } from './UI/Button';
import { CustomInput } from './UI/Input';

interface MeetingFormProps {
  onMeetingCreated: (newMeeting: Meeting) => void;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({ onMeetingCreated }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [participants, setParticipants] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMeeting = await meetingAPI.create({
        title,
        startTime,
        endTime,
        participants: participants.split(',').map((p) => p.trim()),
      });
      onMeetingCreated(newMeeting);
      setTitle('');
      setStartTime('');
      setEndTime('');
      setParticipants('');
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="meeting-form">
      <CustomInput label="Title" 
      type="text" value={title} 
      onChange={(e) => setTitle(e.target.value)} required 
      />
      <CustomInput label="Start Time" 
      type="datetime-local" value={startTime} 
      onChange={(e) => setStartTime(e.target.value)} required 
      />
      <CustomInput label="End Time" 
      type="datetime-local" value={endTime} 
      onChange={(e) => setEndTime(e.target.value)} required 
      />
      <CustomInput label="Participants (comma separated)" 
      type="text" value={participants} 
      onChange={(e) => setParticipants(e.target.value)} required />
      <CustomButton text="Create Meeting" type="submit" className="primary-btn" />
    </form>
  );
};