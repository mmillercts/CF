
import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apiRequest';
import '../../styles/Modal.css';

const EditModal = ({ isOpen, CloseModal, item }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(item.section, item.id ? 'PUT' : 'POST', { title, description, type: item.type }, item.id);
      CloseModal('EditModal');
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Content</h2>
        <button className="modal-close" onClick={() => CloseModal('EditModal')}>
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
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('EditModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
