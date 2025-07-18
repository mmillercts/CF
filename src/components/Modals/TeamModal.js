

import React, { useState, useEffect } from 'react';
import useStore from '../../store';
import api from '../../utils/api';
import '../../styles/Modal.css';

const TeamModal = ({ isOpen, CloseModal, item }) => {
  const { ...rest } = useStore();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [store, setStore] = useState('');
  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState('');

  // Check if this is a photo upload action
  const isPhotoUpload = item?.action === 'uploadPhoto';

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPosition(item.position || '');
      setDescription(item.description || '');
      setLevel(item.level || '');
      setStore(item.store || '');
      setExistingPhoto(item.headshot || '');
    } else {
      // Reset form for new member
      setName('');
      setPosition('');
      setDescription('');
      setLevel('');
      setStore('');
      setExistingPhoto('');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!isPhotoUpload) {
      if (!name.trim() || !position.trim() || !level || !store) {
        alert('Please fill in all required fields');
        return;
      }
    }
    if (isPhotoUpload && !photo) {
      alert('Please select a photo to upload');
      return;
    }
    try {
      let headshotUrl = existingPhoto;
      // Convert photo to base64 or URL for local storage
      if (photo) {
        headshotUrl = await convertFileToBase64(photo);
      }
      // Map level string to integer for backend
      const levelMap = {
        owner: 1,
        executive: 2,
        global: 3,
        operations: 4,
        director: 5,
        manager: 6,
        teamLeader: 7
      };
      const levelInt = levelMap[level] || null;
      const payload = { name, position, description, level: levelInt, store, headshot: headshotUrl };
      if (item?.id) {
        // Update existing member (PUT)
        await api.put(`team/${item.id}`, payload);
      } else {
        // Add new member (POST)
        await api.post('team', payload);
      }
      // Always fetch the latest team members from backend to sync state
      const { teamMembers } = await api.get('/team').then(res => res.data);
      useStore.setState({ teamContent: teamMembers });
      CloseModal('TeamModal');
      setName('');
      setPosition('');
      setDescription('');
      setLevel('');
      setStore('');
      setPhoto(null);
      setExistingPhoto('');
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Error saving team member: ' + err.message);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isPhotoUpload ? `Upload Photo for ${name}` : (item?.id ? 'Edit Team Member' : 'Add Team Member')}</h2>
        <button className="modal-close" onClick={() => CloseModal('TeamModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          {!isPhotoUpload && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
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
                <label htmlFor="level">Organization Level</label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="owner">Owner/Operator</option>
                  <option value="executive">Executive Director</option>
                  <option value="global">Globals</option>
                  <option value="operations">Operations Director</option>
                  <option value="director">Directors</option>
                  <option value="manager">Managers</option>
                  <option value="teamLeader">Team Leaders</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="store">Store/Location</label>
                <select
                  id="store"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  required
                >
                  <option value="">Select Store</option>
                  <option value="corporate">Corporate</option>
                  <option value="southMain">South Main</option>
                  <option value="unionCross">Union Cross</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="photo">
              {isPhotoUpload ? 'New Headshot Photo' : 'Headshot Photo (Optional)'}
            </label>
            {existingPhoto && (
              <div className="current-photo">
                <p>Current photo:</p>
                <img src={existingPhoto} alt="Current headshot" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}} />
              </div>
            )}
            {photo && (
              <div className="current-photo">
                <p>Selected photo:</p>
                <img src={URL.createObjectURL(photo)} alt="Selected headshot" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}} />
              </div>
            )}
            <input
              type="file"
              id="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
              required={isPhotoUpload}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('TeamModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              {isPhotoUpload ? 'Upload Photo' : (item?.id ? 'Update Member' : 'Add Team Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
