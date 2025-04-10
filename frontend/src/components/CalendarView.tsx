import { Meeting } from "../types";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface DayWithMeetings {
    day: number;
    meetings: Meeting[];
}

interface CalendarViewProps {
    currentDate: Date;
    calendarDays: DayWithMeetings[];
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onDayClick: (day: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    currentDate,
    calendarDays,
    onPrevMonth,
    onNextMonth,
    onDayClick
}) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="calendar">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button onClick={onPrevMonth} className="calendar-nav-button">
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <h2>
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={onNextMonth} className="calendar-nav-button">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>

            <div className="calendar-weekdays">
                {weekdays.map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-days">
                {calendarDays.map((dayObj, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${dayObj.day === 0 ? 'empty' : ''} ${dayObj.meetings.length > 0 ? 'has-meetings' : ''}`}
                        onClick={() => onDayClick(dayObj.day)}
                    >
                        {dayObj.day !== 0 && (
                            <>
                                <div className="day-number">{dayObj.day}</div>
                                {dayObj.meetings.length > 0 && (
                                    <div className="day-meetings">
                                        {dayObj.meetings.length === 1 ? (
                                            <div className="meeting-indicator">{dayObj.meetings[0].title}</div>
                                        ) : (
                                            <div className="meeting-indicator">{dayObj.meetings.length} meetings</div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
