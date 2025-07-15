
import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api_request';
import '../styles/Photos_section_styles.css';

const PhotosSection = ({ userRole, openModal }) => {
  const [photos, setPhotos] = useState({ teamEvents: [], southMain: [], unionCross: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('photos', 'GET');
        setPhotos(data || { teamEvents: [], southMain: [], unionCross: [] });
      } catch (err) {
        console.error('Error fetching photos data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="photos-section">
      <h2>Photos</h2>
      {userRole === 'admin' && (
        <button className="btn upload-photos" onClick={() => openModal('photoModal')}>
          Upload Photos
        </button>
      )}
      {['teamEvents', 'southMain', 'unionCross'].map((category) => (
        <div key={category} className="photo-category">
          <h3>{category === 'teamEvents' ? 'Team Events' : category === 'southMain' ? 'South Main' : 'Union Cross'}</h3>
          {userRole === 'admin' && (
            <button className="btn add-photo" onClick={() => openModal('photoModal', { section: 'photos', type: category })}>
              Add
            </button>
          )}
          <div className="photo-grid">
            {photos[category].map((photo) => (
              <div key={photo.id} className="photo-item">
                {userRole === 'admin' && (
                  <div className="photo-actions">
                    <button onClick={() => openModal('photoModal', { ...photo, section: 'photos', type: category })}>Edit</button>
                    <button onClick={() => openModal('deleteModal', { id: photo.id, section: 'photos', type: category })}>Delete</button>
                  </div>
                )}
                <img src={photo.url} alt={photo.title} onClick={() => openModal('photoViewerModal', photo)} />
                <p>{photo.title}</p>
                <p>{photo.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotosSection;
