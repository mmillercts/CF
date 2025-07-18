import React, { useState, useEffect } from 'react';
import useStore from '../../store';
import '../../styles/Modal_overlay_style.css';

const VideoModal = ({ isOpen, closeModal, item }) => {
  const { addVideosContent, updateVideosContent } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [category, setCategory] = useState('teamEvents');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setDate(item.date || '');
      setCategory(item.type || 'teamEvents');
    } else {
      // Reset form for new videos
      setTitle('');
      setDescription('');
      setDate('');
      setVideoFile(null);
      setThumbnailFile(null);
      setCategory('teamEvents');
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const videoData = {
      title,
      description,
      date,
      videoUrl: videoFile ? URL.createObjectURL(videoFile) : (item?.videoUrl || ''),
      thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : (item?.thumbnail || ''),
      uploadDate: new Date().toISOString().split('T')[0]
    };

    try {
      if (item && item.id) {
        // Update existing video
        updateVideosContent(category, item.id, videoData);
      } else {
        // Add new video
        addVideosContent(category, videoData);
      }
      
      // Reset form and close modal
      setTitle('');
      setDescription('');
      setDate('');
      setVideoFile(null);
      setThumbnailFile(null);
      closeModal();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal video-modal">
        <div className="modal-header">
          <h2>{item ? 'Edit Video' : 'Upload Video'}</h2>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="video-category">Category:</label>
            <select
              id="video-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="teamEvents">Team Events</option>
              <option value="training">Training Videos</option>
              <option value="southMain">South Main</option>
              <option value="unionCross">Union Cross</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="video-title">Title:</label>
            <input
              type="text"
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-description">Description:</label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-date">Date:</label>
            <input
              type="date"
              id="video-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-file">Video File:</label>
            <input
              type="file"
              id="video-file"
              accept="video/*"
              onChange={handleVideoChange}
              required={!item}
            />
            {videoFile && (
              <div className="file-preview">
                <p>Selected: {videoFile.name}</p>
              </div>
            )}
            {item?.videoUrl && !videoFile && (
              <div className="current-file">
                <p>Current video uploaded</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail-file">Thumbnail Image (Optional):</label>
            <input
              type="file"
              id="thumbnail-file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {thumbnailFile && (
              <div className="file-preview">
                <p>Selected: {thumbnailFile.name}</p>
                <img 
                  src={URL.createObjectURL(thumbnailFile)} 
                  alt="Thumbnail preview" 
                  style={{ width: '100px', height: '60px', objectFit: 'cover', marginTop: '8px' }}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {item ? 'Update Video' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoModal;
