import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meeting, meetingAPI } from '../APIs/meetingsAPI';
import { CustomButton } from '../components/Button';
import { CustomInput } from '../components/Input';


export const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState<Meeting | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    fetchMeeting();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchMeeting = async () => {
    try {
      const data = await meetingAPI.getOne(id!);
      setMeeting(data);
      setUpdatedMeeting(data);
    } catch (error) {
      console.error('Error fetching meeting:', error);
      setMessage('Error fetching meeting');
      setMessageType('error');
    }
  };

  const handleUpdate = async () => {
    try {
      if (updatedMeeting) {
        await meetingAPI.update(id!, updatedMeeting);
        setMeeting(updatedMeeting);
        setIsEditing(false);
        setMessage('Meeting updated successfully ✏️');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
      setMessage('Failed to update meeting');
      setMessageType('error');
    }
  };

  const handleDelete = async () => {
    try {
      await meetingAPI.delete(id!);
      setMessage('Meeting deleted successfully 🗑️');
      setMessageType('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setMessage('Failed to delete meeting');
      setMessageType('error');
    }
  };


  if (!meeting) {
    return 
      <h3>Loading meeting details...</h3>;  
  }

  return (
    <div className="meeting-details">
      <h2>Meeting Details</h2>
      {message && <div className={`notification ${messageType}`}>{message}</div>}
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