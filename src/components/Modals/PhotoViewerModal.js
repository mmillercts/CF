
import React from 'react';
import '../../styles/Modal.css';

const PhotoViewerModal = ({ isOpen, CloseModal, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={() => closeModal('PhotoViewerModal')}>
          ×
        </button>
        <img src={item.url} alt={item.title} className="photo-viewer" />
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  );
};

export default PhotoViewerModal;
