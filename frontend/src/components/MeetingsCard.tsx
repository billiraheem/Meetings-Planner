import { Meeting, meetingAPI } from '../services/api';
import { useState } from 'react';
import { CustomButton } from './UI/Button';
import { CustomInput } from './UI/Input';
import { useNavigate } from 'react-router-dom';

interface Props {
  meeting: Meeting;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export const MeetingCard = ({ meeting, onDelete, onEdit }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState<Meeting>({ ...meeting });
  const navigate = useNavigate(); // Initialize useNavigate


  const handleUpdate = async () => {
    try {
      await meetingAPI.update(meeting.id, updatedMeeting);
      setIsEditing(false);
      onEdit(); // Refresh the meeting list after update
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Format date and time
  };

  const handleCardClick = () => {
    navigate(`/meeting/${meeting.id}`); // Navigate to MeetingDetails
  };

  return (
    <div className="meeting-card">
      {isEditing ? (
        <div> 
            <CustomInput 
                value={updatedMeeting.title} 
                onChange={(e) => setUpdatedMeeting({ ...updatedMeeting, title: e.target.value })} 
                placeholder="Title" 
            />
            <CustomInput 
                type="datetime-local" 
                value={updatedMeeting.startTime} 
                onChange={(e) => setUpdatedMeeting({ ...updatedMeeting, startTime: e.target.value })} 
                placeholder="Start Time" 
            />
            <CustomInput 
                type="datetime-local" 
                value={updatedMeeting.endTime} 
                onChange={(e) => setUpdatedMeeting({ ...updatedMeeting, endTime: e.target.value })} 
                placeholder="End Time" 
            />
            <CustomInput 
                value={updatedMeeting.participants.join(', ')} 
                onChange={(e) => setUpdatedMeeting({ ...updatedMeeting, participants: e.target.value.split(', ') })} 
                placeholder="Participants (comma-separated)" 
            />
        </div> 
      ) : (
        <div> 
            <h3>{meeting.title}</h3>
            <p>🕒 {formatDate(meeting.startTime)} - {formatDate(meeting.endTime)}</p>
            <p>👥 {meeting.participants.join(', ')}</p>
        </div>
      )}
      <p>🕒 {meeting.startTime} - {meeting.endTime}</p>

      <div className="menu-container">
        <CustomButton 
            className="menu-button"
            icon='⋮'
            onClick={() => setShowMenu(!showMenu)} 
        />
        {showMenu && (
            <div className="menu-drop">
                {isEditing ? (
                    <CustomButton 
                        className='save-btn'
                        text='Save'
                        icon='💾'
                        onClick={handleUpdate}
                    />
                ): (
                    <CustomButton 
                    className='update-btn'
                    text='Edit'
                    icon= '✏️'
                    onClick={() => setIsEditing(true)}
                    />
                )}
                
                <CustomButton 
                    className='delete-btn'
                    text='Delete'
                    icon = '🗑️'
                    onClick={() => onDelete(meeting.id)}
                />
            </div>
        )}
      </div>
    </div>
  );
};

{/* <button onClick={() => setShowMenu(!showMenu)}>⋮</button> */}
{/* <button onClick={() => onDelete(meeting.id)}>🗑 Delete</button> */}
{/* <button onClick={() => console.log('Edit')}>✏ Edit</button> */}