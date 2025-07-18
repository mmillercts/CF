
import React, { useState } from 'react';
import useStore from '../store';
import '../styles/Photos_section_styles.css';

const PhotosSection = ({ userRole, openModal }) => {
  const { photosContent } = useStore();
  const [activeTab, setActiveTab] = useState('teamEvents');

  const tabs = [
    { id: 'teamEvents', label: 'Team Events' },
    { id: 'southMain', label: 'South Main' },
    { id: 'unionCross', label: 'Union Cross' }
  ];

  const getPhotosByCategory = (category) => {
    return photosContent[category] || [];
  };

  return (
    <div className="photos-section">
      <div className="section-header">
        <h2>Photos</h2>
        <p className="section-subtitle">Browse photos by location and events</p>
      </div>

      <div className="tabs-container">
        <div className="photos-dropdown-container">
          <label htmlFor="photos-select" className="dropdown-label">Select Category:</label>
          <select 
            id="photos-select"
            className="photos-dropdown"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map(tab => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        <div className="tab-content">
          <div className="tab-header">
            <h3>{tabs.find(tab => tab.id === activeTab)?.label}</h3>
            {userRole === 'admin' && (
              <button 
                className="btn-primary add-content-btn" 
                onClick={() => openModal('PhotoModal', { section: 'photos', type: activeTab })}
              >
                <span>+</span> Add Photo
              </button>
            )}
          </div>

          <div className="photo-grid">
            {getPhotosByCategory(activeTab).map((photo) => (
              <div key={photo.id} className="photo-item">
                {userRole === 'admin' && (
                  <div className="photo-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openModal('PhotoModal', { ...photo, section: 'photos', type: activeTab })}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => openModal('DeleteModal', { id: photo.id, section: 'photos', type: activeTab })}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <img src={photo.url} alt={photo.title} onClick={() => openModal('PhotoViewerModal', photo)} />
                <div className="photo-info">
                  <p className="photo-title">{photo.title}</p>
                  <p className="photo-description">{photo.description}</p>
                </div>
              </div>
            ))}
            
            {getPhotosByCategory(activeTab).length === 0 && (
              <div className="empty-state">
                <h4>No photos uploaded</h4>
                <p>Be the first to add photos to this category</p>
                {userRole === 'admin' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => openModal('PhotoModal', { section: 'photos', type: activeTab })}
                  >
                    Add Photo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotosSection;
