
import React, { useState, useEffect } from 'react';
import useStore from '../../store';
import '../../styles/Modal.css';

const PhotoModal = ({ isOpen, CloseModal, item }) => {
  const { addPhotosContent, updatePhotosContent } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setCategory(item.type || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (photos.length > 0) {
      // Handle multiple photos
      photos.forEach(photo => {
        const photoData = {
          title,
          description,
          url: URL.createObjectURL(photo), // Temporary URL for demo
          uploadDate: new Date().toISOString().split('T')[0]
        };

        if (item?.id) {
          // Update existing photo
          updatePhotosContent(category, item.id, photoData);
        } else {
          // Add new photo
          addPhotosContent(category, photoData);
        }
      });
    } else if (item?.id) {
      // Update existing photo metadata only
      const photoData = {
        title,
        description
      };
      updatePhotosContent(category, item.id, photoData);
    }

    CloseModal('PhotoModal');
    setTitle('');
    setDescription('');
    setCategory('');
    setPhotos([]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Upload Photos</h2>
        <button className="modal-close" onClick={() => CloseModal('PhotoModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Photo Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {['teamEvents', 'southMain', 'unionCross'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'teamEvents' ? 'Team Events' : cat === 'southMain' ? 'South Main' : 'Union Cross'}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="photos">Select Photos</label>
            <input
              type="file"
              id="photos"
              multiple
              onChange={(e) => setPhotos(Array.from(e.target.files))}
              accept="image/*"
              required={!item}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('PhotoModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Upload Photos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoModal;
