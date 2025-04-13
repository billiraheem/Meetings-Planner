import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { meetingAPI } from "../APIs/api";
import { Meeting } from "../types";
// import { CustomButton } from "./Button";

interface DayWithMeetings {
  day: number;
  meetings: Meeting[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const CalendarWidget: React.FC = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarDays, setCalendarDays] = useState<DayWithMeetings[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showCalendar) {
      fetchMeetings();
    }
  }, [showCalendar, currentDate]);

  useEffect(() => {
    if (showCalendar) {
      generateCalendarDays();
    }
  }, [meetings, currentDate, showCalendar]);

  // Add event listener for clicks outside the calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current && 
        buttonRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    
    // Add event listener when the calendar is shown
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         calendarRef.current &&
//         !calendarRef.current.contains(event.target as Node)
//       ) {
//         setShowCalendar(false);
//       }
//     };

//     if (showCalendar) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showCalendar]);

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
    // Ensure meetings is defined
    // const meetingsArray = Array.isArray(meetings) ? meetings : [];

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

      const currentDayMeetings = meetings.filter((meeting) => {
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

    // Add days from next month to complete the grid (42 cells for 6 rows of 7 days)
    const nextMonthDays = 42 - days.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push({
        day,
        meetings: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }

    setCalendarDays(days);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
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

    // Ensure meetings is defined
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

    // const dayMeetings = meetings.filter((meeting) => {
    //   const meetingDate = new Date(meeting.startTime);
    //   return (
    //     meetingDate.getDate() === day &&
    //     meetingDate.getMonth() === currentDate.getMonth() &&
    //     meetingDate.getFullYear() === currentDate.getFullYear()
    //   );
    // });

    if (dayMeetings.length === 1) {
      // If there's only one meeting, go directly to it
      navigate(`/meeting/${dayMeetings[0]._id}`);
    } else if (dayMeetings.length > 0) {
      // If there are multiple meetings, show them in a list
      const selectedDateStr = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      navigate(`/home`, { state: { selectedDate: selectedDateStr, meetingIds: dayMeetings.map(meeting => meeting._id) } });
    } else {
      // If no meetings, navigate to create meeting page with the date pre-filled
      navigate(`/meeting/new`, {
        state: {
          prefilledDate: selectedDate.toISOString(),
        },
      });
    }

    setShowCalendar(false);
  };

  const toggleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      setCurrentDate(new Date());
    }
  };

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date());
  };

  const handleFullCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/calendar");
    setShowCalendar(false);
  };

  //   const handleClickOutside = (e: React.MouseEvent) => {
  //     const target = e.target as HTMLElement;
  //     if (!target.closest(".calendar-dropdown-container")) {
  //       setShowCalendar(false);
  //     }
  //     e.stopPropagation();
  //   };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  return (
    <div className="calendar-dropdown-container">
      <button
        className="calendar-toggle-btn"
        onClick={toggleCalendar}
        aria-label="Toggle Calendar"
        ref={buttonRef}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
      </button>

      {showCalendar && (
          <div
            className="calendar-dropdown"
            onClick={(e) => e.stopPropagation()}
            ref={calendarRef}
          >
            <div className="calendar-header">
              <button
                onClick={handlePrevMonth}
                className="calendar-nav-btn"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <h3>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={handleNextMonth}
                className="calendar-nav-btn"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            <div className="calendar-weekdays">
              {weekdays.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="calendar-loading">Loading...</div>
            ) : (
              <div className="calendar-grid">
                {calendarDays.map((dayObj, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${
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
                    <span className="day-number">{dayObj.day}</span>
                    {dayObj.meetings.length > 0 && (
                      <div className="meeting-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="calendar-footer">
              <button
                className="calendar-btn calendar-today-btn"
                onClick={handleToday}
                // onClick={() => setCurrentDate(new Date())}
              >
                Today
              </button>
              <button
                className="calendar-btn calendar-full-btn"
                // onClick={() => {
                //   navigate("/calendar");
                //   setShowCalendar(false);
                // }}
                onClick={handleFullCalendar}
              >
                Full Calendar
              </button>
            </div>
          </div>
      )}
    </div>
  );
};

// import { Meeting } from "../types";
// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// interface DayWithMeetings {
//     day: number;
//     meetings: Meeting[];
// }

// interface CalendarViewProps {
//     currentDate: Date;
//     calendarDays: DayWithMeetings[];
//     onPrevMonth: () => void;
//     onNextMonth: () => void;
//     onDayClick: (day: number) => void;
// }

// export const CalendarView: React.FC<CalendarViewProps> = ({
//     currentDate,
//     calendarDays,
//     onPrevMonth,
//     onNextMonth,
//     onDayClick
// }) => {
//     const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     return (
//         <div className="calendar">
//             <div className="calendar-header">
//                 <div className="calendar-nav">
//                     <button onClick={onPrevMonth} className="calendar-nav-button">
//                         <FontAwesomeIcon icon={faChevronLeft} />
//                     </button>
//                     <h2>
//                         {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                     </h2>
//                     <button onClick={onNextMonth} className="calendar-nav-button">
//                         <FontAwesomeIcon icon={faChevronRight} />
//                     </button>
//                 </div>
//             </div>

//             <div className="calendar-weekdays">
//                 {weekdays.map(day => (
//                     <div key={day} className="calendar-weekday">{day}</div>
//                 ))}
//             </div>

//             <div className="calendar-days">
//                 {calendarDays.map((dayObj, index) => (
//                     <div
//                         key={index}
//                         className={`calendar-day ${dayObj.day === 0 ? 'empty' : ''} ${dayObj.meetings.length > 0 ? 'has-meetings' : ''}`}
//                         onClick={() => onDayClick(dayObj.day)}
//                     >
//                         {dayObj.day !== 0 && (
//                             <>
//                                 <div className="day-number">{dayObj.day}</div>
//                                 {dayObj.meetings.length > 0 && (
//                                     <div className="day-meetings">
//                                         {dayObj.meetings.length === 1 ? (
//                                             <div className="meeting-indicator">{dayObj.meetings[0].title}</div>
//                                         ) : (
//                                             <div className="meeting-indicator">{dayObj.meetings.length} meetings</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
