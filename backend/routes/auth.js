const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// User credentials - matching your current system
const defaultUsers = [
  { username: 'Kvillecfa', passwords: ['1248', '4772'], role: 'team' },
  { username: 'kvillecfa', passwords: ['1248', '4772'], role: 'team' },
  { username: 'Kvillecfamgr', passwords: ['1248mgr', '4772mgr'], role: 'manager' },
  { username: 'kvillecfamgr', passwords: ['1248mgr', '4772mgr'], role: 'manager' },
  { username: 'Admin', passwords: ['AdminCFA'], role: 'admin' },
  { username: 'admin', passwords: ['AdminCFA'], role: 'admin' }
];

// Helper function to generate JWT token
const generateToken = (userId, username, role) => {
  return jwt.sign(
    { userId, username, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.SESSION_TIMEOUT || '1h' }
  );
};

// Login endpoint
router.post('/login', [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  body('role').isIn(['team', 'manager', 'admin']).withMessage('Valid role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, password, role } = req.body;

    // Check if user exists in database first
    let userQuery = 'SELECT * FROM users WHERE LOWER(username) = LOWER($1) AND is_active = true';
    let userResult = await db.query(userQuery, [username]);
    
    let user = null;

    if (userResult.rows.length > 0) {
      // User exists in database
      user = userResult.rows[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // Verify role matches
      if (user.role !== role) {
        return res.status(401).json({ error: 'Selected role does not match your account' });
      }
    } else {
      // Check against default users for backward compatibility
      const defaultUser = defaultUsers.find(u => 
        u.username.toLowerCase() === username.toLowerCase()
      );
      
      if (!defaultUser) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // Check if password is valid for default user
      if (!defaultUser.passwords.includes(password)) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // Check if role matches
      if (defaultUser.role !== role) {
        return res.status(401).json({ error: 'Selected role does not match your account' });
      }
      
      // Create user in database for future use
      const hashedPassword = await bcrypt.hash(password, 12);
      const insertQuery = `
        INSERT INTO users (username, password_hash, role, is_active, created_at)
        VALUES ($1, $2, $3, true, NOW())
        RETURNING id, username, role
      `;
      const insertResult = await db.query(insertQuery, [username, hashedPassword, role]);
      user = insertResult.rows[0];
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username, user.role);

    // Set httpOnly cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.SESSION_TIMEOUT) || 3600000 // 1 hour
    });

    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Login successful',
      token, // <-- Add token to response
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.json({ message: 'Logout successful' });
});

// Verify token endpoint
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Change password endpoint
router.put('/change-password', [
  authMiddleware,
  body('currentPassword').isLength({ min: 1 }).withMessage('Current password is required'),
  body('newPassword').isLength({ min: 4 }).withMessage('New password must be at least 4 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current user data
    const userQuery = 'SELECT password_hash FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
