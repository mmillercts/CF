import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import apiRequest from '../utils/apiRequest';
import '../styles/HomeSection.css';

const HomeSection = ({ userRole, openModal }) => {
  const [welcomeContent, setWelcomeContent] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('home', 'GET');
        setWelcomeContent(data.welcome || []);
        setQuickLinks(data.quickLinks || []);
        setAnnouncements(data.announcements || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddContent = () => {
    openModal('editModal', { section: 'home', type: 'welcome' });
  };

  const handleAddQuickLink = () => {
    openModal('quickModal', { section: 'home', type: 'quickLink' });
  };

  const handleAddAnnouncement = () => {
    openModal('announcementModal', { section: 'home', type: 'announcement' });
  };

  return (
    <div className="home-section">
      <h2>Welcome to Your Employee Portal</h2>
      {userRole === 'admin' && (
        <button className="btn add-content" onClick={handleAddContent}>
          Add Content
        </button>
      )}
      <div className="welcome-content">
        {welcomeContent.map((item) => (
          <div key={item.id} className="content-item">
            {userRole === 'admin' && (
              <div className="content-actions">
                <button onClick={() => openModal('editModal', { ...item, section: 'home', type: 'welcome' })}>Edit</button>
                <button onClick={() => openModal('deleteModal', { id: item.id, section: 'home', type: 'welcome' })}>Delete</button>
              </div>
            )}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <div className="quick-links">
        <h3>Quick Access</h3>
        <div className="links-grid">
          {quickLinks.map((link) => (
            <div key={link.id} className="link-item">
              {userRole === 'admin' && (
                <div className="link-actions">
                  <button onClick={() => openModal('quickModal', { ...link, section: 'home', type: 'quickLink' })}>Edit</button>
                  <button onClick={() => openModal('deleteModal', { id: link.id, section: 'home', type: 'quickLink' })}>Delete</button>
                </div>
              )}
              <span className="link-icon">{link.icon}</span>
              <a href={`/${link.link}`}>{link.label}</a>
            </div>
          ))}
        </div>
        {userRole === 'admin' && (
          <button className="btn add-link" onClick={handleAddQuickLink}>
            Add Quick Link
          </button>
        )}
      </div>
      <div className="announcements">
        <h3>Announcements</h3>
        {announcements.map((announcement) => (
          <div key={announcement.id} className="announcement-item">
            {userRole === 'admin' && (
              <div className="announcement-actions">
                <button onClick={() => openModal('announcementModal', { ...announcement, section: 'home', type: 'announcement' })}>Edit</button>
                <button onClick={() => openModal('deleteModal', { id: announcement.id, section: 'home', type: 'announcement' })}>Delete</button>
              </div>
            )}
            <p>{announcement.date}</p>
            <h4>{announcement.title}</h4>
            <p>{announcement.description}</p>
          </div>
        ))}
        {userRole === 'admin' && (
          <button className="btn add-announcement" onClick={handleAddAnnouncement}>
            Add Announcement
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeSection;