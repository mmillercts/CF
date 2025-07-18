const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log(`🕐 Database time: ${result.rows[0].now}`);
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

// Query function with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`🔍 Query executed: ${text.substring(0, 50)}... (${duration}ms)`);
    return result;
  } catch (err) {
    console.error('❌ Query error:', err.message);
    console.error('🔍 Query text:', text);
    console.error('📊 Query params:', params);
    throw err;
  }
};

// Transaction wrapper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};
