import React, { useState } from 'react';
import useStore from '../store';
import '../styles/Videos_section_styles.css';

const VideosSection = ({ userRole, openModal }) => {
  const { videosContent } = useStore();
  const [activeTab, setActiveTab] = useState('teamEvents');

  const tabs = [
    { id: 'teamEvents', label: 'Team Events' },
    { id: 'training', label: 'Training Videos' },
    { id: 'southMain', label: 'South Main' },
    { id: 'unionCross', label: 'Union Cross' }
  ];

  const getVideosByCategory = (category) => {
    return videosContent[category] || [];
  };

  return (
    <div className="videos-section">
      <div className="section-header">
        <h2>Videos</h2>
        <p className="section-subtitle">Watch videos by location and events</p>
      </div>

      <div className="tabs-container">
        <div className="videos-dropdown-container">
          <label htmlFor="videos-select" className="dropdown-label">Select Category:</label>
          <select 
            id="videos-select"
            className="videos-dropdown"
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
                onClick={() => openModal('VideoModal', { section: 'videos', type: activeTab })}
              >
                Upload Video
              </button>
            )}
          </div>

          <div className="videos-grid">
            {getVideosByCategory(activeTab).length === 0 ? (
              <div className="no-content">
                <p>No videos uploaded yet for {tabs.find(tab => tab.id === activeTab)?.label}</p>
                {userRole === 'admin' && (
                  <button 
                    className="btn-secondary" 
                    onClick={() => openModal('VideoModal', { section: 'videos', type: activeTab })}
                  >
                    Upload First Video
                  </button>
                )}
              </div>
            ) : (
              getVideosByCategory(activeTab).map((video) => (
                <div key={video.id} className="video-item">
                  {userRole === 'admin' && (
                    <div className="video-actions">
                      <button className="action-btn edit" onClick={() => openModal('EditModal', { ...video, section: 'videos', type: activeTab })}>✏️</button>
                      <button className="action-btn delete" onClick={() => openModal('DeleteModal', { id: video.id, section: 'videos', type: activeTab })}>🗑️</button>
                    </div>
                  )}
                  
                  <div className="video-container">
                    {video.videoUrl ? (
                      <video 
                        controls 
                        className="video-player"
                        poster={video.thumbnail}
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="video-placeholder">
                        <span className="video-icon">🎥</span>
                        <p>Video not available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    {video.description && <p>{video.description}</p>}
                    {video.date && (
                      <span className="video-date">
                        {new Date(video.date).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit', 
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosSection;
