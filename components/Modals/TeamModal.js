
import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apiRequest';
import '../../styles/Modal.css';

const TeamModal = ({ isOpen, CloseModal, item }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPosition(item.position || '');
      setDescription(item.description || '');
      setLevel(item.level || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('description', description);
    formData.append('level', level);
    if (photo) formData.append('photo', photo);

    try {
      await apiRequest('team', item?.id ? 'PUT' : 'POST', formData, item?.id);
      CloseModal('TeamModal');
      setName('');
      setPosition('');
      setDescription('');
      setLevel('');
      setPhoto(null);
    } catch (err) {
      console.error('Error saving team member:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Team Member</h2>
        <button className="modal-close" onClick={() => CloseModal('TeamModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
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
              {['Owner/Operator', 'Executive Director', 'Globals', 'Operations Directors', 'Directors', 'Managers', 'Team Leaders'].map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="photo">Headshot Photo</label>
            <input
              type="file"
              id="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('TeamModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Add Team Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
