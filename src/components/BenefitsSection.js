
import React, { useState } from 'react';
import useStore from '../store';
import '../styles/Benefits_section_styles.css';

const BenefitsSection = ({ userRole, openModal }) => {
  const { benefitsContent } = useStore();
  const [activeTab, setActiveTab] = useState('partTime');

  const tabs = [
    { id: 'partTime', label: 'Part-time' },
    { id: 'fullTime', label: 'Full-time' },
    { id: 'manager', label: 'Manager' }
  ];

  // Handle both new category system and legacy fullTime/partTime/manager system
  const getContentByCategory = (category) => {
    // Check if benefitsContent has the legacy structure (fullTime, partTime, manager)
    if (benefitsContent.fullTime || benefitsContent.partTime || benefitsContent.manager) {
      // Legacy support - return benefits from the specific category
      return benefitsContent[category] || [];
    }
    
    // New structure - filter by category
    return (benefitsContent || []).filter(item => 
      item.category === category || 
      (!item.category && category === 'partTime')
    );
  };

  return (
    <div className="benefits-section">
      <div className="section-header">
        <h2>Employee Benefits</h2>
        <p className="section-subtitle">Benefits by employment category</p>
      </div>

      <div className="tabs-container">
        <div className="benefits-dropdown-container">
          <label htmlFor="benefits-select" className="dropdown-label">Select Employment Type:</label>
          <select 
            id="benefits-select"
            className="benefits-dropdown"
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
                onClick={() => openModal('EditModal', { section: 'benefits', category: activeTab })}
              >
                <span>+</span> Add Benefit
              </button>
            )}
          </div>

          <div className="content-grid">
            {getContentByCategory(activeTab).map((benefit) => (
              <div key={benefit.id} className="content-card benefit-card">
                {userRole === 'admin' && (
                  <div className="card-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openModal('EditModal', { ...benefit, section: 'benefits' })}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => openModal('DeleteModal', { id: benefit.id, section: 'benefits', category: benefit.category })}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <div className="card-content">
                  <div className="benefit-header">
                    <h4>{benefit.title}</h4>
                    {benefit.eligibility && (
                      <span className={`eligibility-badge ${benefit.eligibility.toLowerCase().replace(' ', '-')}`}>
                        {benefit.eligibility}
                      </span>
                    )}
                  </div>
                  <p className="benefit-description">{benefit.description}</p>
                  
                  {benefit.details && (
                    <div className="benefit-details">
                      <strong>Details:</strong>
                      <ul>
                        {benefit.details.split('\n').map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {benefit.coverage && (
                    <div className="benefit-coverage">
                      <strong>Coverage:</strong> {benefit.coverage}
                    </div>
                  )}
                  
                  {benefit.cost && (
                    <div className="benefit-cost">
                      <strong>Employee Cost:</strong> {benefit.cost}
                    </div>
                  )}
                  
                  {benefit.enrollmentPeriod && (
                    <div className="enrollment-info">
                      <strong>Enrollment:</strong> {benefit.enrollmentPeriod}
                    </div>
                  )}
                  
                  {benefit.contactInfo && (
                    <div className="contact-info">
                      <strong>Contact:</strong> {benefit.contactInfo}
                    </div>
                  )}
                  
                  {benefit.date && (
                    <span className="content-date">{new Date(benefit.date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
            
            {getContentByCategory(activeTab).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{tabs.find(tab => tab.id === activeTab)?.icon}</div>
                <h4>No benefits listed</h4>
                <p>Be the first to add benefits information</p>
                {userRole === 'admin' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => openModal('EditModal', { section: 'benefits', category: activeTab })}
                  >
                    Add Benefit
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

export default BenefitsSection;
