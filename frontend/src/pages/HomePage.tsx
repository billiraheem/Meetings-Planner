import React, { useState, useEffect } from "react";
import { Pagination } from "../components/Pagination";
import { meetingAPI } from "../APIs/api";
import { Meeting } from "../types/index";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomButton } from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

interface LocationState {
  selectedDate?: string;
  meetingIds?: string[];
  refresh?: boolean;
}

export const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const location = useLocation();
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const locationState = location.state as LocationState;

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

  // Handle filtering by date
  useEffect(() => {
    if (locationState && locationState.selectedDate) {
      // We have a selected date from the calendar
      setIsFiltered(true);

      if (locationState.meetingIds && locationState.meetingIds.length > 0) {
        // Filter meetings by IDs if provided
        const filtered = meetings.filter((meeting) =>
          locationState.meetingIds?.includes(meeting._id)
        );
        setFilteredMeetings(filtered);
      } else {
        // Otherwise parse the date and filter manually
        const selectedDate = new Date(locationState.selectedDate);
        const filtered = meetings.filter((meeting) => {
          const meetingDate = new Date(meeting.startTime);
          return (
            meetingDate.getDate() === selectedDate.getDate() &&
            meetingDate.getMonth() === selectedDate.getMonth() &&
            meetingDate.getFullYear() === selectedDate.getFullYear()
          );
        });
        setFilteredMeetings(filtered);
      }
    } else {
      setIsFiltered(false);
    }
  }, [locationState, meetings]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingAPI.getMeetings(currentPage, 5);
      console.log("Response:", response);
      // Sort meetings by date (closest to farthest)
      const sortedMeetings = response.data.data.sort(
        (a: Meeting, b: Meeting) => {
          return (
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        }
      );
      console.log("Sorted:", sortedMeetings);

      setMeetings(sortedMeetings);
      setTotalPages(response.data.totalPages);
      console.log("All meetings from API:", response.data.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.errorMessage || "Failed to fetch meetings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = () => {
    navigate("/meeting/new");
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearDateFilter = () => {
    navigate("/home", { replace: true });
  };

  // Use filtered meetings when filtering is active
  const displayedMeetings = isFiltered ? filteredMeetings : meetings;

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

      {isFiltered && locationState?.selectedDate && (
        <div className="filter-notice">
          <p>Showing meetings for {formatDate(locationState.selectedDate)}</p>
          <button onClick={clearDateFilter}>Show All Meetings</button>
        </div>
      )}

      <div className="meetings-table-container">
        {loading ? (
          <div className="loading">Loading meetings...</div>
        ) : displayedMeetings.length === 0 ? (
          <div className="no-meetings">
            <p>
              {isFiltered
                ? "No meetings scheduled for this date."
                : "No meetings scheduled."}
            </p>
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
              {displayedMeetings.map((meeting) => (
                <tr
                  key={meeting._id}
                  onClick={() => handleViewMeeting(meeting._id)}
                >
                  <td>{meeting.title}</td>
                  <td>{formatDate(meeting.startTime)}</td>
                  <td>{formatTime(meeting.startTime)}</td>
                  <td>{formatTime(meeting.endTime)}</td>
                  <td>{meeting.participants.join(", ")}</td>
                  <td className="actions-cell">
                    <div className="menu-container">
                      <button
                        className="menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(meeting._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      {menuOpen === meeting._id && (
                        <div className="dropdown-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMeeting(meeting._id);
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMeeting(meeting._id);
                            }}
                          >
                            Edit
                          </button>
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

// {
  /* <div className="meetings-table-container">
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
                <tr
                  key={meeting._id}
                  onClick={() => handleViewMeeting(meeting._id)}
                >
                  <td>{meeting.title}</td>
                  <td>{formatDate(meeting.startTime)}</td>
                  <td>{formatTime(meeting.startTime)}</td>
                  <td>{formatTime(meeting.endTime)}</td>
                  <td>{meeting.participants.join(", ")}</td>
                  <td className="actions-cell">
                    <div className="menu-container">
                      <button
                        className="menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(meeting._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      {menuOpen === meeting._id && (
                        <div className="dropdown-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMeeting(meeting._id);
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMeeting(meeting._id);
                            }}
                          >
                            Edit
                          </button>
                          {/* <button onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMeeting(meeting._id);
                          }}>
                             Delete
                          </button> */
// }
//                   </div>
//                 )}
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
//   <Pagination
//     currentPage={currentPage}
//     totalPages={totalPages}
//     onPageChange={setCurrentPage}
//   />
// </div> */}
