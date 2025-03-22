import React from 'react';
import { MeetingForm } from '../components/MeetingsForm';
import { useNavigate } from 'react-router-dom';

export const MeetingCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="meeting-create">
      <h2>Create New Meeting</h2>
      <MeetingForm onMeetingCreated={() => navigate('/')} />
    </div>
  );
};