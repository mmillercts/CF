// src/App.js
import React, { useState, useEffect } from 'react';
// import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import useStore from './store';
import api from './utils/api';
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
  // Fetch all backend data on first mount to sync Zustand store (before login)
  const { setAllData } = useStore.getState();
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await api.get('/all-data');
        if (response.data && response.data.success) {
          setAllData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load Neon DB data on mount:', err);
      }
    };
    fetchAllData();
  }, [setAllData]);
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
  const { setAllData } = useStore.getState();


  const handleLogin = async (role, username, password) => {
    setIsLoggedIn(true);
    setUserRole(role);
    // Fetch all Neon DB data after login
    try {
      const response = await api.get('/all-data');
      if (response.data && response.data.success) {
        setAllData(response.data.data);
      }
    } catch (err) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('isLoggedIn');
    return stored === 'true';
  });
  const { userRole, setUserRole, modals, modalData, openModal, closeModal } = useStore();
  const { setAllData } = useStore.getState();

  // Restore userRole from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) setUserRole(storedRole);
  }, [setUserRole]);

  const handleLogin = async (role, username, password) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    // Fetch all Neon DB data after login
    try {
      const response = await api.get('/all-data');
      if (response.data && response.data.success) {
        setAllData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load Neon DB data:', err);
    }
  };

  const handleLogout = async () => {
    // Static logout - no API call needed
    console.log('Logout clicked - setting logged in to false');
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
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