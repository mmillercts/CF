// src/components/LoginScreen.js
import React, { useState } from 'react';
import '../styles/LoginScreen.css';

function LoginScreen({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  // User credentials database - matching the working HTML version
  const userCredentials = {
    // Team Members
    'Kvillecfa': { password: '1248', role: 'team' },
    'kvillecfa': { password: '1248', role: 'team' },
    'Kvillecfa_4772': { password: '4772', role: 'team' },
    'kvillecfa_4772': { password: '4772', role: 'team' },
    
    // Managers
    'Kvillecfamgr': { password: '1248mgr', role: 'manager' },
    'kvillecfamgr': { password: '1248mgr', role: 'manager' },
    'Kvillecfamgr_4772': { password: '4772mgr', role: 'manager' },
    'kvillecfamgr_4772': { password: '4772mgr', role: 'manager' },
    
    // Admins
    'Admin': { password: 'AdminCFA', role: 'admin' },
    'admin': { password: 'AdminCFA', role: 'admin' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate inputs
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }
    
    // Check if user exists
    if (!userCredentials[username]) {
      setError('Invalid username or password');
      return;
    }
    
    const user = userCredentials[username];
    
    // Validate password
    if (user.password !== password) {
      setError('Invalid username or password');
      return;
    }
    
    // Validate role matches user's assigned role
    if (user.role !== role) {
      setError('Selected role does not match your account');
      return;
    }
    
    // Successful login
    handleLogin(role, username, password);
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <img src="/IMG_3606.JPG" alt="Chick-fil-A Logo" />
          </div>
          <h1>Chick-fil-A Kernersville</h1>
          <h2>Employee Portal</h2>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter username"
              required
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
              required
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Login As</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Role</option>
              <option value="team">Team Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;