const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get calendar events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, month, year } = req.query;
    
    let query = 'SELECT * FROM calendar_events WHERE is_active = true';
    let params = [];
    let paramCount = 0;
    
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    
    if (month && year) {
      paramCount++;
      query += ` AND EXTRACT(MONTH FROM event_date) = $${paramCount}`;
      params.push(parseInt(month));
      
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM event_date) = $${paramCount}`;
      params.push(parseInt(year));
    }
    
    query += ' ORDER BY event_date, start_time';
    
    const result = await db.query(query, params);

    // Group events by category
    const eventsByCategory = {};
    result.rows.forEach(event => {
      if (!eventsByCategory[event.category]) {
        eventsByCategory[event.category] = [];
      }
      eventsByCategory[event.category].push(event);
    });

    res.json({
      events: eventsByCategory,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add calendar event (Admin only)
router.post('/', [
  authMiddleware,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { 
      title, 
      description, 
      eventDate, 
      startTime, 
      endTime, 
      location, 
      category, 
      isAllDay 
    } = req.body;

    const insertQuery = `
      INSERT INTO calendar_events (
        title, description, event_date, start_time, end_time, 
        location, category, is_all_day, created_by, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      title,
      description || '',
      eventDate,
      startTime || null,
      endTime || null,
      location || '',
      category,
      isAllDay || false,
      req.user.id
    ]);

    res.json({
      message: 'Calendar event added successfully',
      event: result.rows[0]
    });

  } catch (error) {
    console.error('Add calendar event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update calendar event (Admin only)
router.put('/:id', [
  authMiddleware,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { 
      title, 
      description, 
      eventDate, 
      startTime, 
      endTime, 
      location, 
      category, 
      isAllDay 
    } = req.body;

    const updateQuery = `
      UPDATE calendar_events 
      SET title = $1, description = $2, event_date = $3, start_time = $4, 
          end_time = $5, location = $6, category = $7, is_all_day = $8, updated_at = NOW()
      WHERE id = $9 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [
      title,
      description || '',
      eventDate,
      startTime || null,
      endTime || null,
      location || '',
      category,
      isAllDay || false,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.json({
      message: 'Calendar event updated successfully',
      event: result.rows[0]
    });

  } catch (error) {
    console.error('Update calendar event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete calendar event (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'UPDATE calendar_events SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    res.json({ message: 'Calendar event deleted successfully' });

  } catch (error) {
    console.error('Delete calendar event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get events for a specific date range
router.get('/range', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    let query = 'SELECT * FROM calendar_events WHERE is_active = true AND event_date BETWEEN $1 AND $2';
    let params = [startDate, endDate];
    
    if (category) {
      query += ' AND category = $3';
      params.push(category);
    }
    
    query += ' ORDER BY event_date, start_time';
    
    const result = await db.query(query, params);

    res.json({
      events: result.rows,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get calendar events range error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
