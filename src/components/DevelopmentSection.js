
import React, { useState } from 'react';
import useStore from '../store';
import '../styles/Development_section_styles.css';

const DevelopmentSection = ({ userRole, openModal }) => {
  const { developmentContent } = useStore();
  const [activeTab, setActiveTab] = useState('training');

  const tabs = [
    { id: 'training', label: 'Training Programs' },
    { id: 'career', label: 'Career Paths' },
    { id: 'skills', label: 'Skills Development' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'mentorship', label: 'Mentorship' }
  ];

  const getContentByCategory = (category) => {
    return developmentContent.filter(item => 
      item.category === category || 
      (!item.category && category === 'training')
    );
  };

  return (
    <div className="development-section">
      <div className="section-header">
        <h2>Professional Development</h2>
        <p className="section-subtitle">Grow your skills and advance your career</p>
      </div>

      <div className="tabs-container">
        <div className="development-dropdown-container">
          <label htmlFor="development-select" className="dropdown-label">Select Category:</label>
          <select 
            id="development-select"
            className="development-dropdown"
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
                onClick={() => openModal('EditModal', { section: 'development', type: 'content', category: activeTab })}
              >
                <span>+</span> Add Program
              </button>
            )}
          </div>

          <div className="content-grid">
            {getContentByCategory(activeTab).map((item) => (
              <div key={item.id} className="content-card program-card">
                {userRole === 'admin' && (
                  <div className="card-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openModal('EditModal', { ...item, section: 'development', type: 'content' })}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => openModal('DeleteModal', { id: item.id, section: 'development', type: 'content' })}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <div className="card-content">
                  <div className="program-header">
                    <h4>{item.title}</h4>
                    {item.level && (
                      <span className={`level-badge ${item.level.toLowerCase()}`}>
                        {item.level}
                      </span>
                    )}
                  </div>
                  <p className="program-description">{item.description}</p>
                  {item.duration && (
                    <div className="program-details">
                      <span className="detail-item">
                        <strong>Duration:</strong> {item.duration}
                      </span>
                    </div>
                  )}
                  {item.requirements && (
                    <div className="program-requirements">
                      <strong>Requirements:</strong>
                      <p>{item.requirements}</p>
                    </div>
                  )}
                  {item.links && item.links.length > 0 && (
                    <div className="program-links">
                      <strong>Resources:</strong>
                      {item.links.map((link, index) => (
                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="resource-link">
                          {link}
                        </a>
                      ))}
                    </div>
                  )}
                  {item.date && (
                    <span className="content-date">{new Date(item.date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
            
            {getContentByCategory(activeTab).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{tabs.find(tab => tab.id === activeTab)?.icon}</div>
                <h4>No programs yet</h4>
                <p>Be the first to add a development program</p>
                {userRole === 'admin' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => openModal('EditModal', { section: 'development', type: 'content', category: activeTab })}
                  >
                    Add Program
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

export default DevelopmentSection;
