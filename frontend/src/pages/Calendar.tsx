import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { meetingAPI } from '../APIs/api';
import { CalendarView }from '../components/CalendarView';
import { Meeting } from '../types';

// interface Meeting {
//     _id: string;
//     title: string;
//     startTime: string;
//     endTime: string;
//     participants: string[];
// }

interface DayWithMeetings {
    day: number;
    meetings: Meeting[];
}

export const Calendar: React.FC = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarDays, setCalendarDays] = useState<DayWithMeetings[]>([]);

    useEffect(() => {
        fetchMeetings();
    }, [currentDate]);

    useEffect(() => {
        generateCalendarDays();
    }, [meetings, currentDate]);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await meetingAPI.getMeetings();
            setMeetings(response.data.data.meetings);
        } catch (error) {
            toast.error('Failed to fetch meetings');
        } finally {
            setLoading(false);
        }
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get the first day of the month
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay(); // Day of the week (0-6)

        // Get the number of days in the month
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const days: DayWithMeetings[] = [];

        // Add empty days for the days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push({ day: 0, meetings: [] });
        }

        // Add days with their meetings
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayMeetings = meetings.filter(meeting => {
                const meetingDate = new Date(meeting.startTime);
                return meetingDate.getDate() === day &&
                    meetingDate.getMonth() === month &&
                    meetingDate.getFullYear() === year;
            });

            days.push({ day, meetings: currentDayMeetings });
        }

        setCalendarDays(days);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        if (day === 0) return; // Don't do anything for empty days

        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayMeetings = meetings.filter(meeting => {
            const meetingDate = new Date(meeting.startTime);
            return meetingDate.getDate() === day &&
                meetingDate.getMonth() === currentDate.getMonth() &&
                meetingDate.getFullYear() === currentDate.getFullYear();
        });

        if (dayMeetings.length === 1) {
            // If there's only one meeting, go directly to it
            navigate(`/meeting/${dayMeetings[0]._id}`);
        } else if (dayMeetings.length > 1) {
            // If there are multiple meetings, show them in a list
            const selectedDateStr = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            navigate(`/home`, { state: { selectedDate: selectedDateStr } });
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handleGoBack} className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <h1>Calendar</h1>
            </div>

            {loading ? (
                <div className="loading">Loading calendar...</div>
            ) : (
                <CalendarView
                    currentDate={currentDate}
                    calendarDays={calendarDays}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onDayClick={handleDayClick}
                />
            )}
        </div>
    );
};
