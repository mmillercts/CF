import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import MainPortal from './components/MainPortal';

const App = () => {
  const { userRole, login } = useAuth();

  return (
    <BrowserRouter>
      <ModalProvider>
        {userRole ? <MainPortal userRole={userRole} onLogout={() => {}} /> : <LoginScreen onLogin={login} />}
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
