
import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api_request';
import '../styles/Development_section_styles.css';

const DevelopmentSection = ({ userRole, openModal }) => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('development', 'GET');
        setContent(data || []);
      } catch (err) {
        console.error('Error fetching development data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="development-section">
      <h2>My Development</h2>
      {userRole === 'admin' && (
        <button className="btn add-content" onClick={() => openModal('editModal', { section: 'development', type: 'content' })}>
          Add Content
        </button>
      )}
      <div className="content-list">
        {content.map((item) => (
          <div key={item.id} className="content-item">
            {userRole === 'admin' && (
              <div className="content-actions">
                <button onClick={() => openModal('editModal', { ...item, section: 'development', type: 'content' })}>Edit</button>
                <button onClick={() => openModal('deleteModal', { id: item.id, section: 'development', type: 'content' })}>Delete</button>
              </div>
            )}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.links && item.links.map((link, index) => (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentSection;
