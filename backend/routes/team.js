const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get team members
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = 'SELECT * FROM team_members WHERE is_active = true ORDER BY level, created_at';
    const result = await db.query(query);

    res.json({
      teamMembers: result.rows,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add team member (Admin only)
router.post('/', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { name, position, department, level, bio, startDate } = req.body;

    if (!name || !position) {
      return res.status(400).json({ error: 'Name and position are required' });
    }

    const insertQuery = `
      INSERT INTO team_members (name, position, department, level, bio, start_date, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      name, position, department, level || 1, bio, startDate, req.user.id
    ]);

    res.json({
      message: 'Team member added successfully',
      teamMember: result.rows[0]
    });

  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update team member (Admin only)
router.put('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, department, level, bio, startDate } = req.body;

    if (!name || !position) {
      return res.status(400).json({ error: 'Name and position are required' });
    }

    const updateQuery = `
      UPDATE team_members 
      SET name = $1, position = $2, department = $3, level = $4, bio = $5, start_date = $6, updated_at = NOW()
      WHERE id = $7 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [
      name, position, department, level || 1, bio, startDate, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      message: 'Team member updated successfully',
      teamMember: result.rows[0]
    });

  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete team member (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'UPDATE team_members SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });

  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
