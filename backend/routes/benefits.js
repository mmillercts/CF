const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get benefits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = 'SELECT * FROM benefits WHERE is_active = true ORDER BY category, display_order, created_at';
    const result = await db.query(query);

    // Group benefits by category
    const benefitsByCategory = {
      fulltime: [],
      parttime: [],
      manager: []
    };

    result.rows.forEach(benefit => {
      if (benefitsByCategory[benefit.category]) {
        benefitsByCategory[benefit.category].push(benefit);
      }
    });

    res.json({
      benefits: benefitsByCategory,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get benefits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add benefit (Admin only)
router.post('/', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { title, description, category, displayOrder } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    if (!['fulltime', 'parttime', 'manager'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const insertQuery = `
      INSERT INTO benefits (title, description, category, display_order, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      title, description, category, displayOrder || 0, req.user.id
    ]);

    res.json({
      message: 'Benefit added successfully',
      benefit: result.rows[0]
    });

  } catch (error) {
    console.error('Add benefit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update benefit (Admin only)
router.put('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, displayOrder } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    if (!['fulltime', 'parttime', 'manager'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const updateQuery = `
      UPDATE benefits 
      SET title = $1, description = $2, category = $3, display_order = $4, updated_at = NOW()
      WHERE id = $5 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [
      title, description, category, displayOrder || 0, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benefit not found' });
    }

    res.json({
      message: 'Benefit updated successfully',
      benefit: result.rows[0]
    });

  } catch (error) {
    console.error('Update benefit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete benefit (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'UPDATE benefits SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benefit not found' });
    }

    res.json({ message: 'Benefit deleted successfully' });

  } catch (error) {
    console.error('Delete benefit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
