const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    // Get various statistics
    const [
      usersResult,
      contentResult,
      documentsResult,
      photosResult,
      eventsResult
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM users WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM home_content WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM documents WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM photos WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM calendar_events WHERE is_active = true')
    ]);

    // Get recent activity
    const recentActivityResult = await db.query(`
      SELECT 'user' as type, username as title, created_at FROM users WHERE created_at > NOW() - INTERVAL '7 days'
      UNION ALL
      SELECT 'content' as type, title, created_at FROM home_content WHERE created_at > NOW() - INTERVAL '7 days'
      UNION ALL
      SELECT 'document' as type, title, created_at FROM documents WHERE created_at > NOW() - INTERVAL '7 days'
      UNION ALL
      SELECT 'photo' as type, title, created_at FROM photos WHERE created_at > NOW() - INTERVAL '7 days'
      UNION ALL
      SELECT 'event' as type, title, created_at FROM calendar_events WHERE created_at > NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      stats: {
        users: parseInt(usersResult.rows[0].count),
        content: parseInt(contentResult.rows[0].count),
        documents: parseInt(documentsResult.rows[0].count),
        photos: parseInt(photosResult.rows[0].count),
        events: parseInt(eventsResult.rows[0].count)
      },
      recentActivity: recentActivityResult.rows
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const query = `
      SELECT id, username, role, is_active, last_login, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);

    res.json({
      users: result.rows
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user status (Admin only)
router.put('/users/:id/status', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const updateQuery = `
      UPDATE users 
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, role, is_active
    `;
    const result = await db.query(updateQuery, [isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role (Admin only)
router.put('/users/:id/role', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['team', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updateQuery = `
      UPDATE users 
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, role, is_active
    `;
    const result = await db.query(updateQuery, [role, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get system logs (Admin only)
router.get('/logs', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    // This is a simplified log system - in production you might use a proper logging service
    const query = `
      SELECT 'login' as action, u.username, u.last_login as timestamp
      FROM users u 
      WHERE u.last_login IS NOT NULL
      ORDER BY u.last_login DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [parseInt(limit), parseInt(offset)]);

    res.json({
      logs: result.rows
    });

  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Backup database (Admin only)
router.post('/backup', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    // This would implement database backup functionality
    // For now, just return a success message
    res.json({
      message: 'Backup functionality would be implemented here',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
