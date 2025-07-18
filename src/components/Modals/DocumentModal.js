
import React, { useState, useEffect } from 'react';
import useStore from '../../store';
import '../../styles/Modal.css';

const DocumentModal = ({ isOpen, CloseModal, item }) => {
  const { addDocumentsContent, updateDocumentsContent } = useStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setCategory(item.type || '');
    } else {
      // Reset form for new document
      setTitle('');
      setCategory('');
      setFile(null);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const documentData = {
      title,
      type: 'PDF', // Default type
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      url: file ? URL.createObjectURL(file) : '#' // Temporary URL for demo
    };

    try {
      if (item?.id) {
        // Update existing document
        updateDocumentsContent(category, item.id, documentData);
      } else {
        // Add new document
        addDocumentsContent(category, documentData);
      }
      
      CloseModal('DocumentModal');
      setTitle('');
      setCategory('');
      setFile(null);
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Upload Document</h2>
        <button className="modal-close" onClick={() => CloseModal('DocumentModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Document Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
              {['forms', 'policy', 'tools', 'handbook', 'training'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'forms' ? 'Forms' :
                   cat === 'policy' ? 'Policies & Procedures' :
                   cat === 'tools' ? 'Tools & Resources' :
                   cat === 'handbook' ? 'Employee Handbook' :
                   cat === 'training' ? 'Training Materials' : 
                   cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="file">Select File</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              required={!item}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('DocumentModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentModal;
