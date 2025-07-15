
import React from 'react';
import apiRequest from '../../utils/apiRequest';
import '../../styles/Modal.css';

const DeleteModal = ({ isOpen, CloseModal, item }) => {
  const handleDelete = async () => {
    try {
      await apiRequest(item.section, 'DELETE', null, item.id);
      CloseModal('DeleteModal');
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Delete</h2>
        <button className="modal-close" onClick={() => CloseModal('DeleteModal')}>
          ×
        </button>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="modal-actions">
          <button type="button" className="btn cancel" onClick={() => CloseModal('DeleteModal')}>
            Cancel
          </button>
          <button type="button" className="btn delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
