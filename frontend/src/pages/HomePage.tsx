import { useEffect, useState } from 'react';
import { meetingAPI } from '../APIs/meetingsAPI';
import { MeetingCard } from '../components/MeetingsCard';
import { Pagination } from '../components/Pagination';
import { NavBar } from '../components/NavBar';

type props = {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  participants: string[];
};

export const Home = ({_id, title, startTime, endTime, participants}: props) => {
  const [meetings, setMeetings] = useState([{_id, title, startTime, endTime, participants}]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  

  useEffect(() => {
    console.log("Fetching meetings triggered!!!");
    fetchMeetings();
  }, [currentPage, filter]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchMeetings = async () => {
    try {
      const { meetings, totalCount } = await meetingAPI.getAll(currentPage, 5, filter);
      console.log("Fetching meetings from API for page:", currentPage);
      setMeetings(meetings);
      setTotalPages(Math.ceil(totalCount / 5));
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setMessage('Error fetching meetings');
      setMessageType('error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await meetingAPI.delete(id);
      setMeetings(meetings.filter(meeting => meeting._id !== id));
      setMessage('Meeting deleted successfully 🗑️');
      setMessageType('success')
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setMessage('Failed to delete meeting');
      setMessageType('error');
    }
  };

  const handleEdit = (updatedMeeting: props) => {
    //update state to update the edited item.
    setMeetings(meetings.map(meeting => meeting._id === updatedMeeting._id ? updatedMeeting : meeting));
    setMessage('Meeting updated successfully ✏️');
    setMessageType('success');
};

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    console.log('Page changed to:', page); 
    setCurrentPage(page);
  };

  return (
    <div>
      <NavBar onSearch={setFilter} />
      {message && <div className={`notification ${messageType}`}>{message}</div>}
      {meetings.map(meeting => (
          <MeetingCard key={meeting._id} meeting={meeting} onDelete={handleDelete} onEdit={handleEdit} />
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};