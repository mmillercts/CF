// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import useStore from './store';
import '../styles/App.css'; // Confirmed as App.css
import LoginScreen from '../components/LoginScreen'; // Missing
import Header from '../components/Header'; // Missing
import HomeSection from '../components/HomeSection'; // Exists
import AboutSection from '../components/AboutSection'; // Exists
import TeamSection from '../components/TeamSection'; // Exists
import DevelopmentSection from '../components/DevelopmentSection'; // Exists
import BenefitsSection from '../components/BenefitsSection'; // Exists
import DocumentsSection from '../components/DocumentsSection'; // Exists
import PhotosSection from '../components/PhotosSection'; // Exists
import CalendarSection from '../components/CalendarSection'; // Exists
import EditModal from '../components/Modals/EditModal'; // Missing
import DeleteModal from '../components/Modals/DeleteModal'; // Missing
import TeamModal from '../components/Modals/TeamModal'; // Missing
import DocumentModal from '../components/Modals/DocumentModal'; // Missing
import PhotoModal from '../components/Modals/PhotoModal'; // Missing
import EventModal from '../components/Modals/EventModal'; // Missing
import QuickModal from '../components/Modals/QuickModal'; // Missing
import AnnouncementModal from '../components/Modals/AnnouncementModal'; // Missing
import BenefitsModal from '../components/Modals/BenefitsModal'; // Missing
import PhotoViewerModal from '../components/Modals/PhotoViewerModal'; // Missing;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userRole, setUserRole, activeSection, setActiveSection, modals, openModal, closeModal } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:3001/api/home', { withCredentials: true });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, [setUserRole]);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserRole(null);
      setActiveSection('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const showSection = (sectionName) => {
    setActiveSection(sectionName);
  };

  return (
    <Router>
      <div className="App">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/" element={<LoginScreen handleLogin={handleLogin} />} />
            <Route path="/2fa" element={<LoginScreen handleLogin={handleLogin} />} />
          </Routes>
        ) : (
          <div id="mainPortal">
            <Header
              userRole={userRole}
              showSection={showSection}
              handleLogout={handleLogout}
              activeSection={activeSection}
            />
            <main className="main">
              <div className="container">
                <Routes>
                  <Route path="/" element={<HomeSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/about" element={<AboutSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/team" element={<TeamSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/development" element={<DevelopmentSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/benefits" element={<BenefitsSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/documents" element={<DocumentsSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/photos" element={<PhotosSection userRole={userRole} OpenModal={openModal} />} />
                  <Route path="/calendar" element={<CalendarSection userRole={userRole} OpenModal={openModal} />} />
                </Routes>
              </div>
            </main>
            <EditModal isOpen={modals.EditModal} CloseModal={() => closeModal('EditModal')} />
            <DeleteModal isOpen={modals.DeleteModal} CloseModal={() => closeModal('DeleteModal')} />
            <TeamModal isOpen={modals.TeamModal} CloseModal={() => closeModal('TeamModal')} />
            <DocumentModal isOpen={modals.DocumentModal} CloseModal={() => closeModal('DocumentModal')} />
            <PhotoModal isOpen={modals.PhotoModal} CloseModal={() => closeModal('PhotoModal')} />
            <EventModal isOpen={modals.EventModal} CloseModal={() => closeModal('EventModal')} />
            <QuickModal isOpen={modals.QuickModal} CloseModal={() => closeModal('QuickModal')} />
            <AnnouncementModal isOpen={modals.AnnouncementModal} CloseModal={() => closeModal('AnnouncementModal')} />
            <BenefitsModal isOpen={modals.BenefitsModal} CloseModal={() => closeModal('BenefitsModal')} />
            <PhotoViewerModal isOpen={modals.PhotoViewerModal} CloseModal={() => closeModal('PhotoViewerModal')} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;