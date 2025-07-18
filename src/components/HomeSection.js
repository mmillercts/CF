import React from 'react';
import useStore from '../store';
import '../styles/Home_section_styles.css';

const HomeSection = ({ userRole, openModal, setActiveSection }) => {
  const { homeContent } = useStore();
  const { welcomeContent, quickLinks, announcements } = homeContent;

  const handleAddContent = () => {
    openModal('EditModal', { section: 'home', type: 'welcome' });
  };

  const handleAddQuickLink = () => {
    openModal('EditModal', { section: 'home', type: 'quickLink' });
  };

  const handleAddAnnouncement = () => {
    openModal('EditModal', { section: 'home', type: 'announcement' });
  };

  const handleVideoUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Create a URL for the uploaded file
        const videoUrl = URL.createObjectURL(file);
        // Update the video in the store
        const { updateHeroVideo } = useStore.getState();
        updateHeroVideo(videoUrl);
      }
    };
    input.click();
  };

  return (
    <div className="home-section">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{welcomeContent.title || "Welcome to Your Employee Portal"}</h1>
          <p className="hero-subtitle">{welcomeContent.message || "Your gateway to company resources, updates, and team connections"}</p>
          {userRole === 'admin' && (
            <button className="btn btn-hero" onClick={handleAddContent}>
              Customize Welcome Message
            </button>
          )}
        </div>
        <div className="hero-video">
          {userRole === 'admin' && (
            <button className="video-edit-btn" onClick={handleVideoUpload}>
              🎥 Change Video
            </button>
          )}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="hero-video-player"
          >
            <source src={homeContent.heroVideo || "/June2025_Summer25_GM_FoodLove_SummerOfSauce_06_OLV_McCann_Video_File_1_video-preview_1080p.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        
        {/* Quick Links Card */}
        <div className="dashboard-card quick-links-card">
          <div className="card-header">
            <div className="card-icon">🚀</div>
            <h3>Quick Access</h3>
            {userRole === 'admin' && (
              <button className="action-btn add-btn" onClick={handleAddQuickLink}>
                ➕
              </button>
            )}
          </div>
          <div className="card-content">
            <div className="quick-links-grid">
              {quickLinks.map((link) => (
                <div key={link.id} className="quick-link-item">
                  {userRole === 'admin' && (
                    <div className="link-actions">
                      <button className="mini-btn" onClick={() => openModal('EditModal', { ...link, section: 'home', type: 'quickLink' })}>✏️</button>
                      <button className="mini-btn delete" onClick={() => openModal('DeleteModal', { id: link.id, section: 'home', type: 'quickLink' })}>🗑️</button>
                    </div>
                  )}
                  <span className="link-icon">{link.icon}</span>
                  <a href={`/${link.link}`}>{link.label}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements Card */}
        <div className="dashboard-card announcements-card">
          <div className="card-header">
            <div className="card-icon">📢</div>
            <h3>Latest Updates</h3>
            {userRole === 'admin' && (
              <button className="action-btn add-btn" onClick={handleAddAnnouncement}>
                ➕
              </button>
            )}
          </div>
          <div className="card-content">
            <div className="announcements-list">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-item">
                  {userRole === 'admin' && (
                    <div className="announcement-actions">
                      <button className="mini-btn" onClick={() => openModal('EditModal', { ...announcement, section: 'home', type: 'announcement' })}>✏️</button>
                      <button className="mini-btn delete" onClick={() => openModal('DeleteModal', { id: announcement.id, section: 'home', type: 'announcement' })}>🗑️</button>
                    </div>
                  )}
                  <div className="announcement-date">{
                    announcement.date ? 
                    new Date(announcement.date).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit', 
                      year: 'numeric'
                    }) : 
                    announcement.date
                  }</div>
                  <h4>{announcement.title}</h4>
                  <p>{announcement.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeSection;