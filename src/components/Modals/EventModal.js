
import React, { useState, useEffect } from 'react';
import useStore from '../../store';
import '../../styles/Modal.css';

const EventModal = ({ isOpen, CloseModal, item }) => {
  const { addCalendarContent, updateCalendarContent } = useStore();
  const [title, setTitle] = useState('');
  const [calendar, setCalendar] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setCalendar(item.type || '');
      setDate(item.date || '');
      setStartTime(item.startTime || '');
      setEndTime(item.endTime || '');
      setDescription(item.description || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format date to MM/DD/YYYY
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US') : '';
    
    // Format time string
    let timeString = '';
    if (startTime && endTime) {
      timeString = `${startTime} - ${endTime}`;
    } else if (startTime) {
      timeString = startTime;
    } else if (endTime) {
      timeString = endTime;
    }
    
    const eventData = {
      title,
      date: formattedDate,
      time: timeString,
      description
    };

    try {
      if (item?.id) {
        // Update existing event
        updateCalendarContent(calendar, item.id, eventData);
      } else {
        // Add new event
        addCalendarContent(calendar, eventData);
      }
      
      CloseModal('EventModal');
      setTitle('');
      setCalendar('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setDescription('');
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Event</h2>
        <button className="modal-close" onClick={() => CloseModal('EventModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="calendar">Calendar</label>
            <select
              id="calendar"
              value={calendar}
              onChange={(e) => setCalendar(e.target.value)}
              required
            >
              <option value="">Select Calendar</option>
              {['marketing', 'southMain', 'unionCross'].map((cal) => (
                <option key={cal} value={cal}>
                  {cal === 'marketing' ? 'Marketing Calendar' : cal === 'southMain' ? 'South Main' : 'Union Cross'}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Time (Optional)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start time"
              />
              <span>to</span>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="End time"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('EventModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
