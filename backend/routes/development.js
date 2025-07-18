const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get development content
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = 'SELECT * FROM development_content WHERE is_active = true ORDER BY display_order, created_at';
    const result = await db.query(query);

    res.json({
      content: result.rows,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get development content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add development content (Admin only)
router.post('/', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { title, description, links, category, displayOrder } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const insertQuery = `
      INSERT INTO development_content (title, description, links, category, display_order, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      title, description, links || [], category, displayOrder || 0, req.user.id
    ]);

    res.json({
      message: 'Development content added successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Add development content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update development content (Admin only)
router.put('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, links, category, displayOrder } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const updateQuery = `
      UPDATE development_content 
      SET title = $1, description = $2, links = $3, category = $4, display_order = $5, updated_at = NOW()
      WHERE id = $6 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [
      title, description, links || [], category, displayOrder || 0, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Development content not found' });
    }

    res.json({
      message: 'Development content updated successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Update development content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete development content (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'UPDATE development_content SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Development content not found' });
    }

    res.json({ message: 'Development content deleted successfully' });

  } catch (error) {
    console.error('Delete development content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
