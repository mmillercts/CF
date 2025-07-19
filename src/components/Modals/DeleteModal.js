
import React from 'react';
import api from '../../utils/api';
import useStore from '../../store';
// import apiRequest from '../../utils/api_request';
import '../../styles/Modal.css';

const DeleteModal = ({ isOpen, CloseModal, item }) => {
  // Removed unused delete*Content variables to fix ESLint errors
  
  const handleDelete = async () => {
    try {
      const section = item?.section;
      const itemCategory = item?.category || item?.type;

      if (section === 'team') {
        await api.delete(`/team/${item.id}`);
        const { teamMembers } = await api.get('/team').then(res => res.data);
        useStore.setState({ teamContent: teamMembers });
      } else if (section === 'about') {
        await api.delete(`/about/${item.id}`);
        const { content } = await api.get('/about').then(res => res.data);
        useStore.setState({ aboutContent: content });
      } else if (section === 'home') {
        if (item.type === 'quickLink') {
          await api.delete(`/home/quick-links/${item.id}`);
        } else if (item.type === 'announcement') {
          await api.delete(`/home/announcements/${item.id}`);
        }
        const homeData = await api.get('/home').then(res => res.data);
        useStore.setState({ homeContent: homeData });
      } else if (section === 'benefits') {
        await api.delete(`/benefits/${itemCategory}/${item.id}`);
        const benefitsData = await api.get('/benefits').then(res => res.data);
        useStore.setState({ benefitsContent: benefitsData });
      } else if (section === 'development') {
        await api.delete(`/development/${item.id}`);
        const developmentData = await api.get('/development').then(res => res.data);
        useStore.setState({ developmentContent: developmentData });
      } else if (section === 'documents') {
        await api.delete(`/documents/${itemCategory}/${item.id}`);
        const documentsData = await api.get('/documents').then(res => res.data);
        useStore.setState({ documentsContent: documentsData });
      } else if (section === 'photos') {
        await api.delete(`/photos/${itemCategory}/${item.id}`);
        const photosData = await api.get('/photos').then(res => res.data);
        useStore.setState({ photosContent: photosData });
      } else if (section === 'videos') {
        await api.delete(`/videos/${itemCategory}/${item.id}`);
        const videosData = await api.get('/videos').then(res => res.data);
        useStore.setState({ videosContent: videosData });
      } else if (section === 'calendar') {
        await api.delete(`/calendar/${itemCategory}/${item.id}`);
        const calendarData = await api.get('/calendar').then(res => res.data);
        useStore.setState({ calendarContent: calendarData });
      }

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
