
import React from 'react';
import api from '../../utils/api';
import useStore from '../../store';
// import apiRequest from '../../utils/api_request';
import '../../styles/Modal.css';

const DeleteModal = ({ isOpen, CloseModal, item }) => {
  const { 
    deleteAboutContent,
    deleteHomeQuickLink, deleteHomeAnnouncement,
    deleteBenefitsContent,
    deleteTeamContent,
    deleteDevelopmentContent,
    deleteDocumentsContent,
    deletePhotosContent,
    deleteVideosContent,
    deleteCalendarContent
  } = useStore();
  
  const handleDelete = async () => {
    try {
      const section = item?.section;
      const itemCategory = item?.category || item?.type; // Handle both category and type

      if (section === 'team') {
        await api.delete(`/team/${item.id}`);
        deleteTeamContent(item.id);
      } else {
        if (section === 'about') {
          deleteAboutContent(item.id);
        } else if (section === 'home') {
          if (item.type === 'quickLink') {
            deleteHomeQuickLink(item.id);
          } else if (item.type === 'announcement') {
            deleteHomeAnnouncement(item.id);
          }
        } else if (section === 'benefits') {
          deleteBenefitsContent(itemCategory, item.id);
        } else if (section === 'development') {
          deleteDevelopmentContent(item.id);
        } else if (section === 'documents') {
          deleteDocumentsContent(itemCategory, item.id);
        } else if (section === 'photos') {
          deletePhotosContent(itemCategory, item.id);
        } else if (section === 'videos') {
          deleteVideosContent(itemCategory, item.id);
        } else if (section === 'calendar') {
          deleteCalendarContent(itemCategory, item.id);
        }
      }

      console.log('Deleting item:', {
        section: item?.section || 'unknown',
        id: item?.id || 'unknown',
        category: itemCategory || 'unknown'
      });
      CloseModal('DeleteModal');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Delete failed: ' + (err?.message || 'Unknown error'));
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
