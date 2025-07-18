
import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/api_request';
import '../../styles/Modal.css';

const AnnouncementModal = ({ isOpen, CloseModal, item }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setDate(item.date || '');
      setTitle(item.title || '');
      setDescription(item.description || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('home', item?.id ? 'PUT' : 'POST', { date, title, description, type: 'announcement' }, item?.id);
      CloseModal('AnnouncementModal');
      setDate('');
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error saving announcement:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Announcement</h2>
        <button className="modal-close" onClick={() => CloseModal('AnnouncementModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('AnnouncementModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Save Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
