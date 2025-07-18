// src/components/LoginScreen.js

import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/LoginScreen.css';

function LoginScreen({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const response = await api.post('/auth/login', { username, password, role });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        handleLogin(role, username, password);
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    }
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
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
              required
              autoComplete="current-password"
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