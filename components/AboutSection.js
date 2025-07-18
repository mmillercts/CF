
import React, { useState, useEffect } from 'react';
import { useModal } from '../../contexts/ModalContext'; // Import useModal hook
import apiRequest from '../utils/apiRequest';
import '../styles/AboutSection.css';

const AboutSection = ({ userRole }) => {
  const [content, setContent] = useState([]);
  const { openModal } = useModal(); // Use ModalContext hook instead of prop

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('about', 'GET');
        setContent(data || []); // Ensure content is an array
      } catch (err) {
        console.error('Error fetching about data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="about-section">
      <h2>About Chick-fil-A</h2>
      {userRole === 'admin' && (
        <button
          className="btn add-content"
          onClick={() => openModal('EditModal', { section: 'about', type: 'content' })}
        >
          Add Content
        </button>
      )}
      <div className="content-list">
        {content.map((item) => (
          <div key={item.id} className="content-item">
            {userRole === 'admin' && (
              <div className="content-actions">
                <button
                  onClick={() => openModal('EditModal', { ...item, section: 'about', type: 'content' })}
                >
                  Edit
                </button>
                <button
                  onClick={() => openModal('DeleteModal', { id: item.id, section: 'about', type: 'content' })}
                >
                  Delete
                </button>
              </div>
            )}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;