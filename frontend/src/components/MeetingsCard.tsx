import { Meeting, meetingAPI } from '../APIs/meetingsAPI';
import { useState } from 'react';
import { CustomButton } from './Button';
import { CustomInput } from './Input';
import { useNavigate } from 'react-router-dom';

interface MeetingCardProps {
  meeting: Meeting;
  onDelete: (id: string) => void;
  onEdit: (updatedMeeting: Meeting) => void;
}

export const MeetingCard = ({ meeting, onDelete, onEdit }: MeetingCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState<Meeting>({ ...meeting });
  const navigate = useNavigate(); 


  const handleUpdate = async () => {
    try {
      await meetingAPI.update(meeting._id, updatedMeeting);
      setIsEditing(false);
      setShowMenu(false)
      onEdit(updatedMeeting); // Refresh the meeting list after update
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  return (
    <div className="meeting-card" >
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
        <div >
          <h3 onClick={() => navigate(`/meeting/${meeting._id}`)} style={{ cursor: 'pointer', color: 'white' }}>
            {meeting.title}
          </h3>
          <p>🕒 {new Date(meeting.startTime).toLocaleString()} - {new Date(meeting.endTime).toLocaleString()}</p>
        </div>
      )}
      
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
                    onClick={() => onDelete(meeting._id)}
                  
                />
            </div>
        )}
      </div>
    </div>
  );
};