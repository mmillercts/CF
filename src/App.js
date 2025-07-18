// src/App.js
import React, { useState } from 'react';
// import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import useStore from './store';
import './styles/global.css';
import './styles/base.css';
import './styles/App.css';
import './styles/App_styling.css';
import './styles/LoginScreen.css';
import './styles/Header_styles.css';
import './styles/Home_section_styles.css';
import './styles/About_section_styles.css';
import './styles/Team_section_styles.css';
import './styles/Development_section_styles.css';
import './styles/Benefits_section_styles.css';
import './styles/Documents_section_style.css';
import './styles/Photos_section_styles.css';
import './styles/Calendar_section.css';
import './styles/mobile.css';
import './styles/Modal_overlay_style.css';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header'; // Missing
import HomeSection from './components/HomeSection'; // Exists
import AboutSection from './components/AboutSection'; // Exists
import TeamSection from './components/TeamSection'; // Exists
import DevelopmentSection from './components/DevelopmentSection'; // Exists
import BenefitsSection from './components/BenefitsSection'; // Exists
import DocumentsSection from './components/DocumentsSection'; // Exists
import PhotosSection from './components/PhotosSection'; // Exists
import VideosSection from './components/VideosSection'; // New
import CalendarSection from './components/CalendarSection'; // Exists
import EditModal from './components/Modals/EditModal'; // Missing
import DeleteModal from './components/Modals/DeleteModal'; // Missing
import TeamModal from './components/Modals/TeamModal'; // Missing
import DocumentModal from './components/Modals/DocumentModal'; // Missing
import PhotoModal from './components/Modals/PhotoModal'; // Missing
import VideoModal from './components/Modals/VideoModal'; // New
import EventModal from './components/Modals/EventModal'; // Missing
import QuickModal from './components/Modals/QuickModal'; // Missing
import AnnouncementModal from './components/Modals/AnnouncementModal'; // Missing
import BenefitsModal from './components/Modals/BenefitsModal'; // Missing
import PhotoViewerModal from './components/Modals/PhotoViewerModal'; // Missing;

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userRole, setUserRole, modals, modalData, openModal, closeModal } = useStore();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       await axios.get('http://localhost:3001/api/home', { withCredentials: true });
  //       setIsLoggedIn(true);
  //     } catch (err) {
  //       setIsLoggedIn(false);
  //       setUserRole(null);
  //     }
  //   };
  //   checkAuth();
  // }, [setUserRole]);

  const handleLogin = (role, username, password) => {
    // In a real application, you would validate credentials here
    // For now, we'll just set the user as logged in
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    // try {
    //   await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
    //   setIsLoggedIn(false);
    //   setUserRole(null);
    // } catch (err) {
    //   console.error('Logout error:', err);
    // }
    
    // Static logout - no API call needed
    console.log('Logout clicked - setting logged in to false');
    setIsLoggedIn(false);
    setUserRole(null);
    
    // Navigate to home route to ensure login screen shows
    navigate('/');
  };

  return (
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
              handleLogout={handleLogout}
            />
            <main className="main">
              <div className="container">
                <Routes>
                  <Route path="/" element={<HomeSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/about" element={<AboutSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/team" element={<TeamSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/development" element={<DevelopmentSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/benefits" element={<BenefitsSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/documents" element={<DocumentsSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/photos" element={<PhotosSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/videos" element={<VideosSection userRole={userRole} openModal={openModal} />} />
                  <Route path="/calendar" element={<CalendarSection userRole={userRole} openModal={openModal} />} />
                </Routes>
              </div>
            </main>
            <EditModal isOpen={modals.EditModal} CloseModal={() => closeModal('EditModal')} item={modalData} />
            <DeleteModal isOpen={modals.DeleteModal} CloseModal={() => closeModal('DeleteModal')} item={modalData} />
            <TeamModal isOpen={modals.TeamModal} CloseModal={() => closeModal('TeamModal')} item={modalData} />
            <DocumentModal isOpen={modals.DocumentModal} CloseModal={() => closeModal('DocumentModal')} item={modalData} />
            <PhotoModal isOpen={modals.PhotoModal} CloseModal={() => closeModal('PhotoModal')} item={modalData} />
            <VideoModal isOpen={modals.VideoModal} closeModal={() => closeModal('VideoModal')} item={modalData} />
            <EventModal isOpen={modals.EventModal} CloseModal={() => closeModal('EventModal')} item={modalData} />
            <QuickModal isOpen={modals.QuickModal} CloseModal={() => closeModal('QuickModal')} item={modalData} />
            <AnnouncementModal isOpen={modals.AnnouncementModal} CloseModal={() => closeModal('AnnouncementModal')} item={modalData} />
            <BenefitsModal isOpen={modals.BenefitsModal} CloseModal={() => closeModal('BenefitsModal')} item={modalData} />
            <PhotoViewerModal isOpen={modals.PhotoViewerModal} CloseModal={() => closeModal('PhotoViewerModal')} item={modalData} />
          </div>
        )}
      </div>
  );
}

export default App;