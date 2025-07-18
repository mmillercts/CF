const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const userQuery = 'SELECT id, username, role, is_active FROM users WHERE id = $1 AND is_active = true';
    const userResult = await db.query(userQuery, [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token. User not found or inactive.' });
    }
    
    req.user = {
      id: userResult.rows[0].id,
      username: userResult.rows[0].username,
      role: userResult.rows[0].role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: userRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Admin only middleware
const requireAdmin = requireRole(['admin']);

// Manager or Admin middleware
const requireManager = requireRole(['manager', 'admin']);

// Team member, Manager, or Admin middleware
const requireTeamMember = requireRole(['team', 'manager', 'admin']);

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireManager,
  requireTeamMember
};
