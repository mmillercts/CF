
import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/api_request';
import '../../styles/Modal.css';

const QuickModal = ({ isOpen, CloseModal, item }) => {
  const [icon, setIcon] = useState('');
  const [label, setLabel] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (item) {
      setIcon(item.icon || '');
      setLabel(item.label || '');
      setLink(item.link || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('home', item?.id ? 'PUT' : 'POST', { icon, label, link, type: 'quickLink' }, item?.id);
      CloseModal('QuickModal');
      setIcon('');
      setLabel('');
      setLink('');
    } catch (err) {
      console.error('Error saving quick link:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Quick Access Link</h2>
        <button className="modal-close" onClick={() => CloseModal('QuickModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="icon">Icon (Emoji)</label>
            <input
              type="text"
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Link To Section</label>
            <select
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            >
              <option value="">Select Section</option>
              {['home', 'about', 'team', 'development', 'benefits', 'documents', 'photos', 'calendar'].map((section) => (
                <option key={section} value={section}>{section.charAt(0).toUpperCase() + section.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('QuickModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickModal;
