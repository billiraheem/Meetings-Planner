import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomButton } from '../components/Button';
// import { CustomInput } from '../components/Input';
import { meetingAPI } from '../APIs/api';
import { Meeting } from '../types/index';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { Navbar } from '../components/NavBar';

export const MeetingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMeeting();
    }
  }, [id]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const response = await meetingAPI.getMeeting(id!);
      setMeeting(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.errorMessage || 'Failed to fetch meeting details');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/meeting/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        const response = await meetingAPI.deleteMeeting(id!);
        toast.success(response.data.responseMessage ||'Meeting deleted successfully');
        navigate('/home');
      } catch (error: any) {
        toast.error(error.response?.data?.errorMessage || 'Failed to delete meeting');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading meeting details...</div>;
  }

  if (!meeting) {
    return <div className="error">Meeting not found</div>;
  }

  return (
    <div className="meeting-details-container">
      <div className="details-header">
        <button onClick={handleGoBack} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        {/* <h1>Meeting Details</h1> */}
      </div>

      <div className="meeting-content">
        <div className="meeting-info">
          <h1 className="meeting-title">{meeting.title}</h1>
          
          <div className="info-sections">
            <div className="section">
              <h3 className="section-title">Date and Time</h3>
              <div className="info-item">
                <span className="info-label">Date:</span>
                <span className="info-value">{formatDate(meeting.startTime)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Start Time:</span>
                <span className="info-value">{formatTime(meeting.startTime)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">End Time:</span>
                <span className="info-value">{formatTime(meeting.endTime)}</span>
              </div>
            </div>
            
            <div className="participants-section">
              <h3 className="section-title">Participants</h3>
              <ol className="participants-list">
                {meeting.participants.map((participant, index) => (
                  <li key={index}>{participant}</li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="actions-section">
            <CustomButton onClick={handleEdit} className="edit-button">
              Edit Meeting
            </CustomButton>
            <CustomButton onClick={handleDelete} className="delete-button">
              Delete Meeting
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};


{/* <div className="meeting-details">
        <h2>{meeting.title}</h2>
        
        <div className="details-section">
          <h3>Date and Time</h3>
          <p>
            <strong>Date:</strong> {formatDate(meeting.startTime)}
          </p>
          <p>
            <strong>Start Time:</strong> {formatTime(meeting.startTime)}
          </p>
          <p>
            <strong>End Time:</strong> {formatTime(meeting.endTime)}
          </p>
        </div>

        <div className="details-section">
          <h3>Participants</h3>
          <ol className="participants-list">
            {meeting.participants.map((participant, index) => (
              <li key={index}>{participant}</li>
            ))}
          </ol>
        </div>

        <div className="details-actions">
          <CustomButton onClick={handleEdit} className="edit-button">
             Edit Meeting
          </CustomButton>
          <CustomButton onClick={handleDelete} className="delete-button">
             Delete Meeting
          </CustomButton>
        </div>
      </div> */}

{/* <FontAwesomeIcon icon={faEdit} />
<FontAwesomeIcon icon={faTrash} /> */}


// const { id } = useParams<{ id: string }>();
//   console.log("id:", id)
//   const [meeting, setMeeting] = useState<Meeting | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', participants: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMeeting = async () => {
//       const response = await getMeeting(id!);
//       setMeeting(response.data.data);
//       console.log(response.data.data)
//       setFormData({
//         title: response?.data?.data?.title,
//         startTime: response.data.data.startTime,
//         endTime: response?.data?.data.endTime,
//         participants: response?.data?.data.participants?.join(', '),
//       });
//     };
//     fetchMeeting();
//   }, [id]);

//   const handleUpdate = async () => {
//     try {
//       const response = await updateMeeting(id!, {
//         title: formData.title,
//         startTime: new Date(formData.startTime),
//         endTime: new Date(formData.endTime),
//         participants: formData.participants.split(',').map((p) => p.trim()),
//       });
//       setIsEditing(false);
//       toast.success(response.data.responseMessage);
//       navigate('/home');
//     } catch (error: any) {
//       toast.error(error.response?.data?.errorMessage || 'Failed to update meeting');
//     }
//   };

//   if (!meeting) return <div>Loading...</div>;

//   return (
//     <div className='meeting-deets'>
//       <Navbar />
      
//       <div className='deets'>
//       <h1 className='deets-title'>Meeting Details</h1>
//         {isEditing ? (
//           <div className='editing'>
//             <CustomInput
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               placeholder="Title"
//             />
//             <CustomInput
//               value={formData.startTime}
//               onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
//               type="datetime-local"
//             />
//             <CustomInput
//               value={formData.endTime}
//               onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
//               type="datetime-local"
//             />
//             <CustomInput
//               value={formData.participants}
//               onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
//               placeholder="Participants (comma-separated)"
//             />
//             <CustomButton className='edit' onClick={handleUpdate}>Update</CustomButton>
//           </div>
//         ) : (
//           <div className='meeting-card2'>
//             <h2>{meeting.title}</h2>
//             <p>
//               <FontAwesomeIcon icon={faClock} />  {/* People icon */}
//               Start: {new Date(meeting.startTime).toLocaleString()}
//             </p>
//             <p>
//               <FontAwesomeIcon icon={faClock} />  {/* People icon */}
//               End: {new Date(meeting.endTime).toLocaleString()}
//             </p>
//             <p>
//               <FontAwesomeIcon icon={faUsers} />  {/* People icon */}
//               Participants: {meeting?.participants?.join(', ')}
//             </p>
//             <CustomButton className='edit' onClick={() => setIsEditing(true)}>Edit</CustomButton>
//           </div>
//         )}
//       </div>
//     </div>
//   );