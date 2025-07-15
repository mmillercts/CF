
import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api_request';
import '../styles/Documents_section_style.css';

const DocumentsSection = ({ userRole, openModal }) => {
  const [documents, setDocuments] = useState({ forms: [], policy: [], tools: [], handbook: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('documents', 'GET');
        setDocuments(data || { forms: [], policy: [], tools: [], handbook: [] });
      } catch (err) {
        console.error('Error fetching documents data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="documents-section">
      <h2>My Documents</h2>
      {userRole === 'admin' && (
        <button className="btn upload-document" onClick={() => openModal('documentModal')}>
          Upload Document
        </button>
      )}
      {['forms', 'policy', 'tools', 'handbook'].map((category) => (
        <div key={category} className="document-category">
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          {userRole === 'admin' && (
            <button className="btn upload-document" onClick={() => openModal('documentModal', { section: 'documents', type: category })}>
              Upload Document
            </button>
          )}
          <div className="document-list">
            {documents[category].map((doc) => (
              <div key={doc.id} className="document-item">
                {userRole === 'admin' && (
                  <div className="document-actions">
                    <button onClick={() => openModal('documentModal', { ...doc, section: 'documents', type: category })}>Edit</button>
                    <button onClick={() => openModal('deleteModal', { id: doc.id, section: 'documents', type: category })}>Delete</button>
                  </div>
                )}
                <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.title}</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsSection;
