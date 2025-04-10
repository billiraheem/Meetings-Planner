import React, { useState, useEffect } from 'react';
import { Pagination } from '../components/Pagination';
import { meetingAPI } from '../APIs/api';
import { Meeting } from '../types/index';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { Navbar } from '../components/NavBar';
import { CustomButton } from '../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  // const location = useLocation();
  const [loading, setLoading] = useState(true);
  // const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  // const [currentYear] = useState(new Date().getFullYear());
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const location = useLocation()

  useEffect(() => {
    fetchMeetings();
  }, [currentPage]);

  // Refetch when returning from create page with refresh state
  useEffect(() => {
    if (location.state?.refresh) {
      fetchMeetings();
      // Clear the state to prevent infinite refetching
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingAPI.getMeetings(currentPage, 5);
      console.log("Response:",response)
      // Sort meetings by date (closest to farthest)
      const sortedMeetings = response.data.data.sort((a: Meeting, b: Meeting) => {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
      console.log("Sorted:", sortedMeetings)

      // Filter meetings by current month
      // const filteredMeetings = sortedMeetings.filter((meeting: Meeting) => {
      //   const meetingDate = new Date(meeting.startTime);
      //   return meetingDate.getMonth() + 1 === currentMonth &&
      //     meetingDate.getFullYear() === currentYear;
      // });

      setMeetings(sortedMeetings);
      setTotalPages(response.data.totalPages);
      console.log('All meetings from API:', response.data.data.meetings);
      // console.log('Filtered meetings:', filteredMeetings);
    } catch (error: any) {
      toast.error(error.response?.data?.errorMessage || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = () => {
    navigate('/meeting/new');
  };

  const handleEditMeeting = (id: string) => {
    navigate(`/meeting/edit/${id}`);
    setMenuOpen(null);
  };

  const handleViewMeeting = (id: string) => {
    navigate(`/meeting/${id}`);
    setMenuOpen(null);
  };

  // const handleDeleteMeeting = async (id: string) => {
  //   try {
  //     const response = await meetingAPI.deleteMeeting(id);
  //     toast.success(response.data.data.responseMessage || 'Meeting deleted successfully');
  //     navigate('/home')
  //     // fetchMeetings();
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.errorMessage || 'Failed to delete meeting');
  //   }
  //   setMenuOpen(null);
  // };

  const toggleMenu = (id: string) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
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

  // const changeMonth = (increment: number) => {
  //   let newMonth = currentMonth + increment;
  //   if (newMonth < 1) {
  //     newMonth = 12;
  //   } else if (newMonth > 12) {
  //     newMonth = 1;
  //   }
  //   setCurrentMonth(newMonth);
  // };

  // const getMonthName = (month: number) => {
  //   return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
  // };

  // <FontAwesomeIcon icon={faTrash} />
  // <FontAwesomeIcon icon={faEdit} />

  return (
    <div className="home-container">
      <div className="create-meeting-button-container">
      <CustomButton
          onClick={handleCreateMeeting}
          className="create-meeting-button"
        >
          + New Meeting
        </CustomButton>
      </div>

      {/* <FontAwesomeIcon icon={faPlus} /> */}

      {/* <div className="month-selector">
        <button onClick={() => changeMonth(-1)} className="month-nav-button">
          &lt;
        </button>
        <h2>{getMonthName(currentMonth)} {currentYear}</h2>
        <button onClick={() => changeMonth(1)} className="month-nav-button">
          &gt;
        </button>
      </div> */}

      <div className="meetings-table-container">
        {loading ? (
          <div className="loading">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="no-meetings">
            <p>No meetings scheduled.</p>
          </div>
        ) : (
          <table className="meetings-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Participants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting._id} onClick={() => handleViewMeeting(meeting._id)}>
                  <td>{meeting.title}</td>
                  <td>{formatDate(meeting.startTime)}</td>
                  <td>{formatTime(meeting.startTime)}</td>
                  <td>{formatTime(meeting.endTime)}</td>
                  <td>{meeting.participants.join(', ')}</td>
                  <td className="actions-cell">
                    <div className="menu-container">
                      <button
                        className="menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(meeting._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisV}  />
                      </button>
                      {menuOpen === meeting._id && (
                        <div className="dropdown-menu">
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleViewMeeting(meeting._id);
                          }}>
                            View
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleEditMeeting(meeting._id);
                          }}>
                             Edit
                          </button>
                          {/* <button onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMeeting(meeting._id);
                          }}>
                             Delete
                          </button> */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
        
      </div>

      
    </div>
  );
};


// const fetchMeetings = async () => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       navigate('/');
//       return;
//     }

//     const response = await getMeetings(currentPage, 5);
//     console.log(response)
//     const meetingsData = response.data.data.meetings;
//     setMeetings(meetingsData);
//     setTotalPages(response.data.data.totalPages);
//   } catch (error: any) {
//     toast.error(error.response?.data?.errorMessage || 'Failed to fetch meetings');
//     console.error('Fetch meetings failed:', error.message);
//     console.error('Error details:', error.response?.data || error);
//     navigate('/');
//   }
// };

// useEffect(() => {
//   fetchMeetings();
// }, [currentPage]);

// // Refetch when returning from create page with refresh state
// useEffect(() => {
//   if (location.state?.refresh) {
//     fetchMeetings();
//     // Clear the state to prevent infinite refetching
//     navigate(location.pathname, { replace: true, state: {} });
//   }
// }, [location.state]);

// console.log(meetings)

// return (
//   <div className='home'>
//     <Navbar />
//     <div>
//       <CustomButton className='add-meeting-btn' onClick={() => navigate('/create-meeting')}>
//         {/* <FontAwesomeIcon icon={faPlus}/>  */}
//         + New Meeting
//       </CustomButton>
//     </div>

//     <h1>Your Meetings</h1>
//     <div className='home-div'>
//       {meetings.length > 0 ? (
//         meetings.map((meeting: Meeting) => (
//           <MeetingCard key={meeting._id} meeting={meeting} onUpdate={fetchMeetings} />
//         ))
//       ) : (
//         <p>No meetings available.</p>
//       )}
//     </div>
//     <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//       />
//   </div>
// );