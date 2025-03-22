import { useEffect, useState } from 'react';
import { meetingAPI, Meeting } from '../services/api';
import { MeetingCard } from '../components/MeetingsCard';
import { Pagination } from '../components/Pagination';
import { NavBar } from '../components/NavBar';
// import { MeetingForm } from '../components/MeetingsForm';

export const Home = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [currentPage, filter]);

  const fetchMeetings = async () => {
    try {
      const { meetings, totalCount } = await meetingAPI.getAll(currentPage, 5, filter);
      setMeetings(meetings);
      setTotalPages(Math.ceil(totalCount / 5));
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await meetingAPI.delete(id);
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  return (
    <div>
      <NavBar onSearch={setFilter} />
      {/* <MeetingForm onMeetingCreated={fetchMeetings} /> */}
      {meetings.map(meeting => (
        <MeetingCard key={meeting.id} meeting={meeting} onDelete={handleDelete} onEdit={fetchMeetings} />
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};