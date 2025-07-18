require('dotenv').config();
const { Pool } = require('pg');

// Debug: Check if environment variables are loaded
console.log('🔍 Checking environment variables...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables!');
  console.log('💡 Make sure .env file exists in the backend folder with:');
  console.log('   DATABASE_URL=postgresql://...');
  process.exit(1);
}

// Show a safe version of the connection string for debugging
const safeUrl = process.env.DATABASE_URL.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
console.log('📋 Full connection string (safe):', safeUrl);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testNeonConnection() {
  try {
    console.log('🔍 Testing Neon database connection...');
    console.log('📋 Connecting to:', safeUrl);
    
    const client = await pool.connect();
    console.log('✅ Neon database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('🕐 Database time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
    
    // Test database permissions
    const dbTest = await client.query('SELECT current_database(), current_user');
    console.log('🗄️  Database:', dbTest.rows[0].current_database);
    console.log('👤 User:', dbTest.rows[0].current_user);
    
    client.release();
    await pool.end();
    
    console.log('🎉 All connection tests passed! Ready for migration.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Neon connection failed:');
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    
    if (error.message.includes('SASL')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Check if your password contains special characters');
      console.log('   2. Verify the connection string is copied correctly from Neon');
      console.log('   3. Make sure your Neon database is active (not paused)');
    }
    
    process.exit(1);
  }
}

testNeonConnection();