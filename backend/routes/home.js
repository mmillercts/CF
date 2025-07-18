const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get home content
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get welcome content
    const welcomeQuery = 'SELECT * FROM home_content WHERE type = $1 ORDER BY created_at DESC LIMIT 1';
    const welcomeResult = await db.query(welcomeQuery, ['welcome']);
    
    // Get quick links
    const quickLinksQuery = 'SELECT * FROM home_content WHERE type = $1 AND is_active = true ORDER BY display_order, created_at';
    const quickLinksResult = await db.query(quickLinksQuery, ['quick_link']);
    
    // Get announcements
    const announcementsQuery = 'SELECT * FROM home_content WHERE type = $1 AND is_active = true ORDER BY created_at DESC LIMIT 10';
    const announcementsResult = await db.query(announcementsQuery, ['announcement']);

    res.json({
      welcome: welcomeResult.rows[0] || {
        title: 'Welcome to Your Employee Portal',
        description: 'Your gateway to company resources, updates, and team connections'
      },
      quickLinks: quickLinksResult.rows.map(row => ({
        id: row.id,
        label: row.title,
        link: row.link_url,
        icon: row.icon
      })),
      announcements: announcementsResult.rows.map(row => ({
        id: row.id,
        title: row.title,
        message: row.description,
        date: row.created_at
      })),
      role: req.user.role
    });

  } catch (error) {
    console.error('Get home content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add/Update welcome content (Admin only)
router.post('/welcome', [
  authMiddleware,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, description } = req.body;

    // Deactivate existing welcome content
    await db.query(
      'UPDATE home_content SET is_active = false WHERE type = $1',
      ['welcome']
    );

    // Insert new welcome content
    const insertQuery = `
      INSERT INTO home_content (type, title, description, created_by, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, ['welcome', title, description, req.user.id]);

    res.json({
      message: 'Welcome content updated successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Update welcome content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add quick link (Admin only)
router.post('/quick-link', [
  authMiddleware,
  requireAdmin,
  body('label').trim().isLength({ min: 1 }).withMessage('Label is required'),
  body('link').trim().isLength({ min: 1 }).withMessage('Link is required'),
  body('icon').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { label, link, icon } = req.body;

    const insertQuery = `
      INSERT INTO home_content (type, title, link_url, icon, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, ['quick_link', label, link, icon || '🔗', req.user.id]);

    res.json({
      message: 'Quick link added successfully',
      quickLink: {
        id: result.rows[0].id,
        label: result.rows[0].title,
        link: result.rows[0].link_url,
        icon: result.rows[0].icon
      }
    });

  } catch (error) {
    console.error('Add quick link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add announcement (Admin only)
router.post('/announcement', [
  authMiddleware,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, message } = req.body;

    const insertQuery = `
      INSERT INTO home_content (type, title, description, created_by, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, ['announcement', title, message, req.user.id]);

    res.json({
      message: 'Announcement added successfully',
      announcement: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        message: result.rows[0].description,
        date: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Add announcement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete content item (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'UPDATE home_content SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });

  } catch (error) {
    console.error('Delete home content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
