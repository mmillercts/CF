
import React, { useState } from 'react';
import useStore from '../store';
import '../styles/Calendar_section.css';

const CalendarSection = ({ userRole, openModal }) => {
  const { calendarContent } = useStore();
  const [activeCalendar, setActiveCalendar] = useState('marketing');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get today's date for highlighting
  const today = new Date();
  const isToday = (day) => {
    return currentYear === today.getFullYear() && 
           currentMonth === today.getMonth() && 
           day === today.getDate();
  };
  
  // Get events for a specific day
  const getEventsForDay = (day) => {
    const dateStr = `${(currentMonth + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${currentYear}`;
    return calendarContent[activeCalendar].filter(event => event.date === dateStr);
  };
  
  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Calendar tabs
  const calendars = [
    { key: 'marketing', label: 'Marketing Calendar' },
    { key: 'southMain', label: 'South Main' },
    { key: 'unionCross', label: 'Union Cross' }
  ];
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isTodayDate = isToday(day);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isTodayDate ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
          title={dayEvents.length > 0 ? dayEvents.map(e => `${e.title} ${e.time ? '- ' + e.time : ''}`).join('\n') : ''}
        >
          <span className="day-number">{day}</span>
          {dayEvents.length > 0 && (
            <span className="event-count">{dayEvents.length}</span>
          )}
          <div className="event-preview">
            {dayEvents.map(event => (
              <div key={event.id} className="preview-event">
                <strong>{event.title}</strong>
                {event.time && <div className="preview-time">{event.time}</div>}
                {event.description && <div className="preview-desc">{event.description}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar-section">
      <h2>Calendar</h2>
      
      {/* Calendar Dropdown */}
      <div className="calendar-dropdown-container">
        <label htmlFor="calendar-select" className="dropdown-label">Select Calendar:</label>
        <select 
          id="calendar-select"
          className="calendar-dropdown"
          value={activeCalendar}
          onChange={(e) => setActiveCalendar(e.target.value)}
        >
          {calendars.map(cal => (
            <option key={cal.key} value={cal.key}>
              {cal.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Active Calendar */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-btn" onClick={goToPrevMonth}>◀</button>
          <h3>{monthNames[currentMonth]} {currentYear}</h3>
          <button className="nav-btn" onClick={goToNextMonth}>▶</button>
        </div>
        
        {userRole === 'admin' && (
          <button 
            className="btn add-event" 
            onClick={() => openModal('EventModal', { section: 'calendar', type: activeCalendar })}
          >
            Add Event
          </button>
        )}
        
        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
          
          {/* Calendar days */}
          {generateCalendarDays()}
        </div>
        
        {/* Event List for current calendar */}
        <div className="event-list-section">
          <h4>Upcoming Events</h4>
          <div className="event-list">
            {calendarContent[activeCalendar].map((event) => (
              <div key={event.id} className="event-item">
                {userRole === 'admin' && (
                  <div className="event-actions">
                    <button onClick={() => openModal('EventModal', { ...event, section: 'calendar', type: activeCalendar })}>Edit</button>
                    <button onClick={() => openModal('DeleteModal', { id: event.id, section: 'calendar', type: activeCalendar })}>Delete</button>
                  </div>
                )}
                <h4>{event.title}</h4>
                <p>{event.date} {event.time}</p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
