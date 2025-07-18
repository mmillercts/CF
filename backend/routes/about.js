const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get about content
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = 'SELECT * FROM about_content WHERE is_active = true ORDER BY display_order, created_at';
    const result = await db.query(query);

    res.json({
      content: result.rows,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get about content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add/Update about content (Admin only)
router.post('/', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { title, description, displayOrder } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const insertQuery = `
      INSERT INTO about_content (title, description, display_order, created_by, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, [title, description, displayOrder || 0, req.user.id]);

    res.json({
      message: 'About content added successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Add about content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update about content (Admin only)
router.put('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, displayOrder } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const updateQuery = `
      UPDATE about_content 
      SET title = $1, description = $2, display_order = $3, updated_at = NOW()
      WHERE id = $4 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [title, description, displayOrder || 0, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About content not found' });
    }

    res.json({
      message: 'About content updated successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Update about content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete about content (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'UPDATE about_content SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About content not found' });
    }

    res.json({ message: 'About content deleted successfully' });

  } catch (error) {
    console.error('Delete about content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
