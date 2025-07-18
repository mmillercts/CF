
import React, { useState } from 'react';
import useStore from '../store';
import '../styles/About_section_styles.css';

const AboutSection = ({ userRole, openModal }) => {
  const { aboutContent } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'history', label: 'Company History' },
    { id: 'culture', label: 'Culture & Values' },
    { id: 'leadership', label: 'Leadership' }
  ];

  const getContentByCategory = (category) => {
    return aboutContent.filter(item => 
      item.category === category || 
      (!item.category && category === 'overview')
    );
  };

  return (
    <div className="about-section">
      <div className="section-header">
        <h2>About Our Company</h2>
        <p className="section-subtitle">Discover our story, mission, and values</p>
      </div>

      <div className="tabs-container">
        <div className="about-dropdown-container">
          <label htmlFor="about-select" className="dropdown-label">Select Topic:</label>
          <select 
            id="about-select"
            className="about-dropdown"
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
                onClick={() => openModal('EditModal', { section: 'about', type: 'content', category: activeTab })}
              >
                <span>+</span> Add Content
              </button>
            )}
          </div>

          <div className="content-grid">
            {getContentByCategory(activeTab).map((item) => (
              <div key={item.id} className="content-card">
                {userRole === 'admin' && (
                  <div className="card-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openModal('EditModal', { ...item, section: 'about', type: 'content' })}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => openModal('DeleteModal', { id: item.id, section: 'about', type: 'content' })}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <div className="card-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  {item.date && (
                    <span className="content-date">{new Date(item.date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
            
            {getContentByCategory(activeTab).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{tabs.find(tab => tab.id === activeTab)?.icon}</div>
                <h4>No content yet</h4>
                <p>Be the first to add content to this section</p>
                {userRole === 'admin' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => openModal('EditModal', { section: 'about', type: 'content', category: activeTab })}
                  >
                    Add Content
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

export default AboutSection;
