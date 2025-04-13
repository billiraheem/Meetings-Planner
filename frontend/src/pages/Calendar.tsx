import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { meetingAPI } from "../APIs/api";
import { Meeting } from "../types";

interface DayWithMeetings {
  day: number;
  meetings: Meeting[];
  isCurrentMonth: boolean;
  isToday: boolean;
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
    if (meetings.length >= 0) {
      generateCalendarDays();
    }
  }, [meetings, currentDate]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingAPI.getMeetings();
      setMeetings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const meetingsArray = Array.isArray(meetings) ? meetings : [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // Day of the week (0-6)

    // Get the number of days in the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the last day of the previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: DayWithMeetings[] = [];

    // Add days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        day,
        meetings: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add days for current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const currentDayMeetings = meetingsArray.filter((meeting) => {
        if (!meeting || !meeting.startTime) return false;

        const meetingDate = new Date(meeting.startTime);
        return (
          meetingDate.getDate() === day &&
          meetingDate.getMonth() === month &&
          meetingDate.getFullYear() === year
        );
      });

      days.push({
        day,
        meetings: currentDayMeetings,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Add days from next month to complete the grid
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        meetings: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    setCalendarDays(days);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const meetingsArray = Array.isArray(meetings) ? meetings : [];

    const dayMeetings = meetingsArray.filter((meeting) => {
      if (!meeting || !meeting.startTime) return false;

      const meetingDate = new Date(meeting.startTime);
      return (
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === currentDate.getMonth() &&
        meetingDate.getFullYear() === currentDate.getFullYear()
      );
    });

    if (dayMeetings.length === 1) {
      // If there's only one meeting, go directly to it
      navigate(`/meeting/${dayMeetings[0]._id}`);
    } else if (dayMeetings.length > 0) {
      // If there are multiple meetings, show them in a list with the selected date
      const selectedDateStr = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      navigate(`/home`, {
        state: {
          selectedDate: selectedDateStr,
          meetingIds: dayMeetings.map((meeting) => meeting._id),
        },
      });
    } else {
      // If no meetings, navigate to create meeting page with the date pre-filled
      navigate(`/meeting/new`, {
        state: {
          prefilledDate: selectedDate.toISOString(),
        },
      });
    }
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-pg-container">
      <div className="calendar-pg-header">
        <button onClick={handleGoBack} className="c-back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h1>Calendar</h1>
        <div className="calendar-pg-nav">
          <button onClick={handlePrevMonth} className="calendar-pg-nav-button">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={handleNextMonth} className="calendar-nav-button">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="calendar-pg-loading">Loading calendar...</div>
      ) : (
        <div className="calendar-pg-calendar">
          <div className="calendar-pg-weekdays">
            {weekdays.map((day) => (
              <div key={day} className="calendar-pg-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-pg-days">
            {calendarDays.map((dayObj, index) => (
              <div
                key={index}
                className={`calendar-pg-day ${
                  !dayObj.isCurrentMonth ? "other-month" : ""
                } 
                                          ${dayObj.isToday ? "today" : ""} 
                                          ${
                                            dayObj.meetings.length > 0
                                              ? "has-meetings"
                                              : ""
                                          }`}
                onClick={() =>
                  handleDayClick(dayObj.day, dayObj.isCurrentMonth)
                }
              >
                <div className="calendar-pg-day-number">{dayObj.day}</div>
                {dayObj.meetings.length > 0 && (
                  <div className="calendar-pg-day-meetings">
                    {dayObj.meetings.length === 1 ? (
                      <div className="calendar-meeting-indicator">
                        {dayObj.meetings[0].title}
                      </div>
                    ) : (
                      <div className="calendar-meeting-indicator">
                        {dayObj.meetings.length} meetings
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
