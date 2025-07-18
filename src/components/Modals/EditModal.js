
import React, { useState, useEffect } from 'react';
import useStore from '../../store';
// import apiRequest from '../../utils/api_request';
import '../../styles/Modal.css';

const EditModal = ({ isOpen, CloseModal, item }) => {
  const { 
    addAboutContent, updateAboutContent,
    updateHomeWelcome, addHomeQuickLink, updateHomeQuickLink, addHomeAnnouncement, updateHomeAnnouncement,
    addBenefitsContent, updateBenefitsContent,
    addTeamContent, updateTeamContent,
    addDevelopmentContent, updateDevelopmentContent,
    addDocumentsContent, updateDocumentsContent,
    addPhotosContent, updatePhotosContent,
    addVideosContent, updateVideosContent,
    addCalendarContent, updateCalendarContent
  } = useStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [level, setLevel] = useState('');
  const [store, setStore] = useState('');
  const [icon, setIcon] = useState('');
  const [label, setLabel] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [uploadDate, setUploadDate] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || item.message || '');
      setCategory(item.category || item.type || '');
      setDate(item.date || '');
      setTime(item.time || '');
      setName(item.name || '');
      setPosition(item.position || '');
      setLevel(item.level || '');
      setStore(item.store || '');
      setIcon(item.icon || '');
      setLabel(item.label || '');
      setLink(item.link || '');
      setMessage(item.message || '');
      setUrl(item.url || '');
      setType(item.type || '');
      setSize(item.size || '');
      setUploadDate(item.uploadDate || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const section = item?.section;
      const itemCategory = item?.category;
      
      // Handle different sections
      if (section === 'about') {
        if (item.id) {
          updateAboutContent(item.id, { title, description });
        } else {
          addAboutContent({ title, description });
        }
      } else if (section === 'home') {
        if (item.type === 'welcome') {
          updateHomeWelcome({ title, message: description });
        } else if (item.type === 'quickLink') {
          if (item.id) {
            updateHomeQuickLink(item.id, { label, link, icon });
          } else {
            addHomeQuickLink({ label, link, icon });
          }
        } else if (item.type === 'announcement') {
          if (item.id) {
            updateHomeAnnouncement(item.id, { title, date, message: description });
          } else {
            addHomeAnnouncement({ title, date, message: description });
          }
        }
      } else if (section === 'benefits') {
        if (item.id) {
          updateBenefitsContent(itemCategory, item.id, { title, description });
        } else {
          addBenefitsContent(itemCategory, { title, description });
        }
      } else if (section === 'team') {
        if (item.id) {
          updateTeamContent(item.id, { name, position, description, level, store });
        } else {
          addTeamContent({ name, position, description, level, store });
        }
      } else if (section === 'development') {
        if (item.id) {
          updateDevelopmentContent(item.id, { title, description, type, duration: time });
        } else {
          addDevelopmentContent({ title, description, type, duration: time });
        }
      } else if (section === 'documents') {
        if (item.id) {
          updateDocumentsContent(itemCategory, item.id, { title, type, size, uploadDate });
        } else {
          addDocumentsContent(itemCategory, { title, type, size, uploadDate });
        }
      } else if (section === 'photos') {
        if (item.id) {
          updatePhotosContent(itemCategory, item.id, { title, description, url, uploadDate });
        } else {
          addPhotosContent(itemCategory, { title, description, url, uploadDate });
        }
      } else if (section === 'videos') {
        if (item.id) {
          updateVideosContent(itemCategory, item.id, { title, description, videoUrl: url, uploadDate, date });
        } else {
          addVideosContent(itemCategory, { title, description, videoUrl: url, uploadDate, date });
        }
      } else if (section === 'calendar') {
        if (item.id) {
          updateCalendarContent(itemCategory, item.id, { title, date, time, description });
        } else {
          addCalendarContent(itemCategory, { title, date, time, description });
        }
      }
      
      // Static handling - no API call needed
      console.log('Saving content:', { 
        section: section || 'unknown', 
        title, 
        description, 
        type: item?.type || 'content' 
      });
      
      CloseModal('EditModal');
      // Reset all form fields
      setTitle('');
      setDescription('');
      setCategory('');
      setDate('');
      setTime('');
      setName('');
      setPosition('');
      setLevel('');
      setStore('');
      setIcon('');
      setLabel('');
      setLink('');
      setMessage('');
      setUrl('');
      setType('');
      setSize('');
      setUploadDate('');
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  if (!isOpen) return null;

  const renderFormFields = () => {
    const section = item?.section;
    const itemType = item?.type;

    if (section === 'team') {
      return (
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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="">Select Level</option>
              <option value="owner">Owner/Operator</option>
              <option value="executive">Executive Director</option>
              <option value="global">Global</option>
              <option value="operations">Operations Director</option>
              <option value="director">Director</option>
              <option value="manager">Manager</option>
              <option value="teamLeader">Team Leader</option>
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
              <option value="corporate">Global</option>
              <option value="southMain">South Main</option>
              <option value="unionCross">Union Cross</option>
            </select>
          </div>
        </>
      );
    }

    if (section === 'home' && itemType === 'quickLink') {
      const iconOptions = [
        '📊', '📈', '📋', '📅', '👥', '📄', '📷', '💡', '🎯', '⚡', 
        '🔧', '💼', '📞', '✉️', '🏠', '🍔', '🎉', '📝', '💻', '🔍',
        '⭐', '🚀', '🎨', '📚', '🏆', '💰', '🎵', '🌟', '⚙️', '📊'
      ];
      
      const linkOptions = [
        { value: 'about', label: 'About Us' },
        { value: 'team', label: 'Team / Organizational Chart' },
        { value: 'calendar', label: 'Calendar / Events' },
        { value: 'benefits', label: 'Benefits' },
        { value: 'benefits/health', label: 'Benefits → Health Insurance' },
        { value: 'benefits/retirement', label: 'Benefits → Retirement Plans' },
        { value: 'benefits/pto', label: 'Benefits → Time Off' },
        { value: 'benefits/discounts', label: 'Benefits → Employee Discounts' },
        { value: 'documents', label: 'Documents' },
        { value: 'documents/policies', label: 'Documents → Company Policies' },
        { value: 'documents/forms', label: 'Documents → HR Forms' },
        { value: 'documents/training', label: 'Documents → Training Materials' },
        { value: 'photos', label: 'Photos' },
        { value: 'photos/events', label: 'Photos → Company Events' },
        { value: 'photos/team', label: 'Photos → Team Photos' },
        { value: 'photos/facilities', label: 'Photos → Facility Photos' },
        { value: 'videos', label: 'Videos' },
        { value: 'videos/teamEvents', label: 'Videos → Team Events' },
        { value: 'videos/training', label: 'Videos → Training Videos' },
        { value: 'videos/southMain', label: 'Videos → South Main' },
        { value: 'videos/unionCross', label: 'Videos → Union Cross' },
        { value: 'development', label: 'Development / Training' },
        { value: 'development/onboarding', label: 'Development → New Employee Onboarding' },
        { value: 'development/skills', label: 'Development → Skills Training' },
        { value: 'development/leadership', label: 'Development → Leadership Programs' }
      ];
      
      return (
        <>
          <div className="form-group">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <select
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            >
              <option value="">Select a page/section</option>
              {linkOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <select
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              required
            >
              <option value="">Select an icon</option>
              {iconOptions.map((iconOption) => (
                <option key={iconOption} value={iconOption}>
                  {iconOption} {iconOption}
                </option>
              ))}
            </select>
          </div>
        </>
      );
    }

    if (section === 'home' && itemType === 'announcement') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Message</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </>
      );
    }

    if (section === 'calendar') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </>
      );
    }

    if (section === 'documents') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="size">Size</label>
            <input
              type="text"
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="uploadDate">Upload Date</label>
            <input
              type="date"
              id="uploadDate"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              required
            />
          </div>
        </>
      );
    }

    if (section === 'photos') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="title">Title</label>
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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="url">Image URL</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="uploadDate">Upload Date</label>
            <input
              type="date"
              id="uploadDate"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              required
            />
          </div>
        </>
      );
    }

    // Default fields for about, benefits, development, home welcome
    return (
      <>
        <div className="form-group">
          <label htmlFor="title">Title</label>
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
            required
          />
        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Content</h2>
        <button className="modal-close" onClick={() => CloseModal('EditModal')}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => CloseModal('EditModal')}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
