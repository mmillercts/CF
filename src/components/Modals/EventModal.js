
import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apiRequest';
import '../../styles/Modal.css';

const EventModal = ({ isOpen, CloseModal, item }) => {
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
    try {
      await apiRequest('calendar', item?.id ? 'PUT' : 'POST', { title, calendar, date, startTime, endTime, description }, item?.id);
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
        <button className="modal-close" onClick={() => closeModal('EventModal')}>
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
            <label>Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
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
