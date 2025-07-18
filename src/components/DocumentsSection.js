
import React, { useState } from 'react';
import useStore from '../store';
import '../styles/Documents_section_style.css';

const DocumentsSection = ({ userRole, openModal }) => {
  const { documentsContent } = useStore();
  const [activeTab, setActiveTab] = useState('forms');

  const tabs = [
    { id: 'forms', label: 'Forms' },
    { id: 'policy', label: 'Policies & Procedures' },
    { id: 'tools', label: 'Tools & Resources' },
    { id: 'handbook', label: 'Employee Handbook' },
    { id: 'training', label: 'Training Materials' }
  ];

  const getDocumentsByCategory = (category) => {
    return documentsContent[category] || [];
  };

  return (
    <div className="documents-section">
      <div className="section-header">
        <h2>Document Library</h2>
        <p className="section-subtitle">Access important documents, forms, and resources</p>
      </div>

      <div className="tabs-container">
        <div className="documents-dropdown-container">
          <label htmlFor="documents-select" className="dropdown-label">Select Category:</label>
          <select 
            id="documents-select"
            className="documents-dropdown"
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
                onClick={() => openModal('DocumentModal', { section: 'documents', type: activeTab })}
              >
                <span>+</span> Upload Document
              </button>
            )}
          </div>

          <div className="documents-grid" data-category={activeTab}>
            {getDocumentsByCategory(activeTab).map((doc) => (
              <div key={doc.id} className="document-card">
                {userRole === 'admin' && (
                  <div className="card-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openModal('DocumentModal', { ...doc, section: 'documents', type: activeTab })}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => openModal('DeleteModal', { id: doc.id, section: 'documents', type: activeTab })}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                <div className="document-content">
                  <div className="document-info">
                    <h4 className="document-title">{doc.title}</h4>
                    {doc.description && (
                      <p className="document-description">{doc.description}</p>
                    )}
                    
                    <div className="document-meta">
                      {doc.size && (
                        <span className="document-size">{doc.size}</span>
                      )}
                      {doc.lastModified && (
                        <span className="document-date">
                          Updated: {new Date(doc.lastModified).toLocaleDateString()}
                        </span>
                      )}
                      {doc.version && (
                        <span className="document-version">v{doc.version}</span>
                      )}
                    </div>
                    
                    <div className="document-actions-bottom">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-download"
                        title="Download document"
                      >
                        Download
                      </a>
                      {doc.url && (
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-view"
                          title="View document"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {getDocumentsByCategory(activeTab).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">Coming Soon!</div>
                <h4>No documents yet</h4>
                <p>Be the first to upload documents to this category</p>
                {userRole === 'admin' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => openModal('DocumentModal', { section: 'documents', type: activeTab })}
                  >
                    Upload Document
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

export default DocumentsSection;
