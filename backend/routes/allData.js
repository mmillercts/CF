const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper to get all table names in public schema
async function getAllTableNames() {
  const result = await db.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  `);
  return result.rows.map(row => row.table_name);
}

// GET /api/all-data - returns all rows from all tables
router.get('/', async (req, res) => {
  try {
    const tables = await getAllTableNames();
    const allData = {};
    for (const table of tables) {
      const result = await db.query(`SELECT * FROM "${table}"`);
      allData[table] = result.rows;
    }
    res.json({ success: true, data: allData });
  } catch (err) {
    console.error('Error fetching all data:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch all data' });
  }
});

module.exports = router;
