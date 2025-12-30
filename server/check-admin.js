// Script để kiểm tra và tạo user admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkAndCreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check for existing admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`📊 Found ${adminUsers.length} admin users:`);

    adminUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email})`);
    });

    // If no admin exists, create one
    if (adminUsers.length === 0) {
      console.log('\n🚨 No admin users found. Creating default admin...');

      const adminUser = new User({
        username: 'admin',
        email: 'admin@securityapp.com',
        password: 'admin123',
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@securityapp.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    } else {
      console.log('\n✅ Admin users already exist');
    }

    // Show all users for reference
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}, 'username email role');
    allUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

checkAndCreateAdmin();