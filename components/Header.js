import React from 'react';
import useStore from '../store';
import '../styles/Header.css';

const Header = ({ userRole, showSection, handleLogout, activeSection }) => {
  const sections = ['Home', 'About', 'Team', 'Development', 'Benefits', 'Documents', 'Photos', 'Calendar'];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src="/cfa-logo.jpg" alt="Chick-fil-A Logo" />
          <span>Chick-fil-A Kernersville</span>
        </div>
        <nav className="header-nav">
          {sections.map((section) => (
            <a
              key={section}
              href="#"
              className={activeSection === section.toLowerCase() ? 'active' : ''}
              onClick={() => showSection(section.toLowerCase())}
            >
              {section}
            </a>
          ))}
          <a href="#" onClick={handleLogout}>Log Out</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;