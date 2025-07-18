

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../../styles/Modal.css';

const BenefitsModal = ({ isOpen, CloseModal, item }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setCategory(item.type || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, category };
      if (item?.id) {
        await api.put(`/benefits/${item.id}`, payload);
      } else {
        await api.post('/benefits', payload);
      }
      CloseModal('BenefitsModal');
      setTitle('');
      setDescription('');
      setCategory('');
    } catch (err) {
      console.error('Error saving benefit:', err);
      alert('Failed to save benefit.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Benefits Item</h2>
        <button className="modal-close" onClick={() => CloseModal('BenefitsModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {['fullTime', 'partTime', 'manager'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'fullTime' ? 'Full-Time' : cat === 'partTime' ? 'Part-Time' : 'Manager'}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('BenefitsModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Save Benefits Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BenefitsModal;
