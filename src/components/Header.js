import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ userRole, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Define sections with their subsections
  const sectionsWithSubsections = {
    'Home': [],
    'About': ['Company History', 'Mission & Values', 'Leadership'],
    'Team': ['Team Members', 'Team Roles', 'Team Recognition'],
    'Development': ['Training Programs', 'Career Paths', 'Skills Development'],
    'Benefits': ['Health Benefits', 'Time Off', 'Employee Perks', 'Retirement'],
    'Documents': ['Policies', 'Forms', 'Handbooks', 'Training Materials'],
    'Photos': ['Team Events', 'Store Photos', 'Community Events'],
    'Videos': ['Training Videos', 'Team Messages', 'Company Updates'],
    'Calendar': ['Events', 'Meetings', 'Training Sessions', 'Holidays']
  };

  const sections = Object.keys(sectionsWithSubsections);

  const handleSectionClick = (section) => {
    const path = section === 'home' ? '/' : `/${section}`;
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    console.log('Logout button clicked in Header');
    if (handleLogout) {
      console.log('Calling handleLogout function');
      handleLogout();
    } else {
      console.error('handleLogout function not provided to Header');
    }
    setIsMobileMenuOpen(false);
  };

  const isActiveSection = (section) => {
    const path = section === 'home' ? '/' : `/${section}`;
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-logo">
            <img src="/IMG_3606.JPG" alt="Chick-fil-A Logo" />
            <span>Chick-fil-A Kernersville</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <a href="#" onClick={handleLogoutClick}>Log Out</a>
          </nav>

          {/* Mobile Hamburger Menu Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="header-secondary">
        <nav className="secondary-nav">
          {sections.map((section) => (
            <div key={section} className="secondary-nav-item">
              <a
                href="#"
                className={isActiveSection(section.toLowerCase()) ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick(section.toLowerCase());
                }}
              >
                {section}
              </a>
              {sectionsWithSubsections[section].length > 0 && (
                <div className="dropdown-menu">
                  {sectionsWithSubsections[section].map((subsection, index) => (
                    <a
                      key={index}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle subsection navigation if needed
                        handleSectionClick(section.toLowerCase());
                      }}
                    >
                      {subsection}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {sections.map((section) => (
            <a
              key={section}
              href="#"
              className={isActiveSection(section.toLowerCase()) ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleSectionClick(section.toLowerCase());
              }}
            >
              {section}
            </a>
          ))}
          <a href="#" onClick={handleLogoutClick} className="logout-btn">Log Out</a>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </header>
  );
};

export default Header;