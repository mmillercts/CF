import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Backend connection failed'));
  }, []);

  const handleLogin = () => {
    // Simple test login
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@chickfila.com',
        password: 'admin123'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        setIsLoggedIn(true);
        setUserRole(data.user.role);
        localStorage.setItem('token', data.token);
      }
    })
    .catch(err => console.error('Login failed:', err));
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Chick-fil-A Employee Portal</h1>
          <p>Backend Status: {message}</p>
          <button onClick={handleLogin}>
            Test Login
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Chick-fil-A Employee Portal</h1>
        <p>Logged in as: {userRole}</p>
        <p>Backend Status: {message}</p>
        <button onClick={() => {
          setIsLoggedIn(false);
          setUserRole('');
          localStorage.removeItem('token');
        }}>
          Logout
        </button>
      </header>
    </div>
  );
}

export default App;
