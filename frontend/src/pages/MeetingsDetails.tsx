import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meeting, meetingAPI } from '../services/api';
import { CustomButton } from '../components/UI/Button';
import { CustomInput } from '../components/UI/Input';



export const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    fetchMeeting();
  }, []);

  const fetchMeeting = async () => {
    try {
      const data = await meetingAPI.getOne(id!);
      setMeeting(data);
      setUpdatedMeeting(data);
    } catch (error) {
      console.error('Error fetching meeting:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (updatedMeeting) {
        await meetingAPI.update(id!, updatedMeeting);
        setMeeting(updatedMeeting);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await meetingAPI.delete(id!);
      navigate('/');
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString(); // Format date and time
  // };

  if (!meeting) return <p>Loading meeting details...</p>;

  return (
    <div className="meeting-details">
      <h2>Meeting Details</h2>
      {isEditing ? (
        <div>
          <CustomInput 
            label="Title"
            value={updatedMeeting?.title || ''}
            onChange={(e) => setUpdatedMeeting({ ...updatedMeeting!, title: e.target.value })}
          />
          <CustomInput 
            label="Start Time"
            type="datetime-local"
            value={updatedMeeting?.startTime || ''}
            onChange={(e) => setUpdatedMeeting({ ...updatedMeeting!, startTime: e.target.value })}
          />
          <CustomInput 
            label="End Time"
            type="datetime-local"
            value={updatedMeeting?.endTime || ''}
            onChange={(e) => setUpdatedMeeting({ ...updatedMeeting!, endTime: e.target.value })}
          />
          <CustomInput 
            label="Participants (comma separated)"
            value={updatedMeeting?.participants.join(', ') || ''}
            onChange={(e) => setUpdatedMeeting({ ...updatedMeeting!, participants: e.target.value.split(', ') })}
          />
        </div>
      ) : (
        <div>
          <p><strong>Title:</strong> {meeting.title}</p>
          <p><strong>Start Time:</strong> {new Date(meeting.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(meeting.endTime).toLocaleString()}</p>
          <p><strong>Participants:</strong> {meeting.participants.join(', ')}</p>
        </div>
      )}

      <div className="actions">
        {isEditing ? (
          <CustomButton text="Save" icon="💾" onClick={handleUpdate} />
        ) : (
          <CustomButton text="Edit" icon="✏️" onClick={() => setIsEditing(true)} />
        )}
        <CustomButton text="Delete" icon="🗑️" onClick={handleDelete} />
        <CustomButton text="Back to Home" icon="🏠" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};