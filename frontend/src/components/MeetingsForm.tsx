import { useEffect, useState } from 'react';
import { Meeting, meetingAPI } from '../APIs/meetingsAPI';
import { CustomButton } from './Button';
import { CustomInput } from './Input';

interface MeetingFormProps {
  onMeetingCreated: (newMeeting: Meeting) => void;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({ onMeetingCreated }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [participants, setParticipants] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
      if (message) {
        const timer = setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [message]);

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
      setMessage('Meeting created successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error creating meeting:', error);
      setMessage('Failed to create meeting');
      setMessageType('error');
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
      {message && <div className={`notification ${messageType}`}>{message}</div>}
    </form>
  );
};