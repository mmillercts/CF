require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed default users
    const defaultUsers = [
      { username: 'Kvillecfa', passwords: ['1248', '4772'], role: 'team' },
      { username: 'kvillecfa', passwords: ['1248', '4772'], role: 'team' },
      { username: 'Kvillecfamgr', passwords: ['1248mgr', '4772mgr'], role: 'manager' },
      { username: 'kvillecfamgr', passwords: ['1248mgr', '4772mgr'], role: 'manager' },
      { username: 'Admin', passwords: ['AdminCFA'], role: 'admin' },
      { username: 'admin', passwords: ['AdminCFA'], role: 'admin' }
    ];

    for (const user of defaultUsers) {
      // Use the first password as the default
      const hashedPassword = await bcrypt.hash(user.passwords[0], 12);
      
      await db.query(`
        INSERT INTO users (username, password_hash, role, is_active, created_at)
        VALUES ($1, $2, $3, true, NOW())
        ON CONFLICT (username) DO NOTHING
      `, [user.username, hashedPassword, user.role]);
    }
    console.log('✅ Seeded default users');

    // Seed home content
    await db.query(`
      INSERT INTO home_content (type, title, description, created_at)
      VALUES 
        ('welcome', 'Welcome to Your Employee Portal', 'Your gateway to company resources, updates, and team connections', NOW())
      ON CONFLICT DO NOTHING
    `);
    
    await db.query(`
      INSERT INTO home_content (type, title, link_url, icon, created_at)
      VALUES 
        ('quick_link', 'Team', 'team', '👥', NOW()),
        ('quick_link', 'Calendar', 'calendar', '📅', NOW()),
        ('quick_link', 'Benefits', 'benefits', '🏥', NOW()),
        ('quick_link', 'Documents', 'documents', '📄', NOW())
      ON CONFLICT DO NOTHING
    `);
    
    await db.query(`
      INSERT INTO home_content (type, title, description, created_at)
      VALUES 
        ('announcement', 'Welcome to the Portal', 'Welcome to the new Chick-fil-A Kernersville Employee Portal! Here you can access all your employee resources, benefits information, training materials, and stay updated with the latest company news.', NOW()),
        ('announcement', 'Training Reminder', 'Don''t forget to complete your monthly safety training. Access the training materials in the Development section.', NOW()),
        ('announcement', 'Team Meeting', 'Next team meeting is scheduled for the first Monday of next month. Check the calendar for specific details.', NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Seeded home content');

    // Seed about content
    await db.query(`
      INSERT INTO about_content (title, description, display_order, created_at)
      VALUES 
        ('Our Mission', 'To glorify God by being a faithful steward of all that is entrusted to us and to have a positive influence on all who come into contact with Chick-fil-A.', 1, NOW()),
        ('Our Vision', 'To be America''s best quick-service restaurant at getting better.', 2, NOW()),
        ('Our Values', 'Service: We exist to serve others with excellence. Teamwork: We collaborate to achieve our goals. Growth: We continuously improve ourselves.', 3, NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Seeded about content');

    // Seed team members
    await db.query(`
      INSERT INTO team_members (name, position, department, level, created_at)
      VALUES 
        ('Owner/Operator', 'Restaurant Owner', 'Leadership', 1, NOW()),
        ('Executive Director', 'Executive Leadership', 'Leadership', 2, NOW()),
        ('General Manager', 'Operations Leader', 'Management', 6, NOW()),
        ('Team Leaders', 'Front & Back of House', 'Operations', 7, NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Seeded team members');

    // Seed development content
    await db.query(`
      INSERT INTO development_content (title, description, category, display_order, created_at)
      VALUES 
        ('New Team Member Orientation', 'Complete introduction to Chick-fil-A values and procedures.', 'orientation', 1, NOW()),
        ('Food Safety Certification', 'Essential food safety and handling procedures.', 'safety', 2, NOW()),
        ('Leadership Development', 'Leadership skills and management training.', 'leadership', 3, NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Seeded development content');

    // Seed benefits
    await db.query(`
      INSERT INTO benefits (title, description, category, display_order, created_at)
      VALUES 
        ('Health Insurance', 'Comprehensive medical, dental, and vision coverage.', 'fulltime', 1, NOW()),
        ('401(k) Plan', 'Retirement savings with company matching.', 'fulltime', 2, NOW()),
        ('Paid Time Off', 'Vacation days, sick leave, and personal days.', 'fulltime', 3, NOW()),
        ('Employee Discounts', 'Generous meal discounts and special offers.', 'parttime', 1, NOW()),
        ('Flexible Scheduling', 'Work schedules that fit your lifestyle.', 'parttime', 2, NOW()),
        ('Performance Bonuses', 'Quarterly and annual performance incentives.', 'manager', 1, NOW()),
        ('Leadership Development', 'Advanced training and career advancement opportunities.', 'manager', 2, NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Seeded benefits');

    // Seed sample calendar events
    await db.query(`
      INSERT INTO calendar_events (title, description, event_date, category, created_at)
      VALUES 
        ('Team Meeting', 'Monthly team meeting to discuss goals and updates', CURRENT_DATE + INTERVAL '7 days', 'marketing', NOW()),
        ('Safety Training', 'Mandatory food safety training session', CURRENT_DATE + INTERVAL '14 days', 'south-main', NOW()),
        ('Performance Review', 'Quarterly performance review meetings', CURRENT_DATE + INTERVAL '21 days', 'union-cross', NOW())
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Seeded calendar events');

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };
