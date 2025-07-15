
import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/apiRequest';
import '../styles/CalendarSection.css';

const CalendarSection = ({ userRole, openModal }) => {
  const [calendars, setCalendars] = useState({ marketing: [], southMain: [], unionCross: [] });
  const [currentMonth, setCurrentMonth] = useState('July 2025');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('calendar', 'GET');
        setCalendars(data || { marketing: [], southMain: [], unionCross: [] });
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="calendar-section">
      <h2>Calendar</h2>
      {userRole === 'admin' && (
        <button className="btn add-event" onClick={() => openModal('eventModal')}>
          Add Event
        </button>
      )}
      {['marketing', 'southMain', 'unionCross'].map((calendar) => (
        <div key={calendar} className="calendar">
          <h3>{calendar === 'marketing' ? 'Marketing Calendar' : calendar === 'southMain' ? 'South Main' : 'Union Cross'}</h3>
          <div className="calendar-header">
            <button className="nav-btn">◀</button>
            <span>{currentMonth}</span>
            <button className="nav-btn">▶</button>
          </div>
          <div className="event-list">
            {calendars[calendar].map((event) => (
              <div key={event.id} className="event-item">
                {userRole === 'admin' && (
                  <div className="event-actions">
                    <button onClick={() => openModal('eventModal', { ...event, section: 'calendar', type: calendar })}>Edit</button>
                    <button onClick={() => openModal('deleteModal', { id: event.id, section: 'calendar', type: calendar })}>Delete</button>
                  </div>
                )}
                <h4>{event.title}</h4>
                <p>{event.date} {event.startTime} - {event.endTime}</p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarSection;
