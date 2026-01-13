const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB connection
console.log('Testing MongoDB connection...');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodsampledb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('✅ Successfully connected to MongoDB!');
  console.log('Database name:', db.name);
  
  // Test basic operations
  db.db.admin().ping((err, result) => {
    if (err) {
      console.error('❌ MongoDB ping failed:', err);
      process.exit(1);
    } else {
      console.log('✅ MongoDB ping successful:', result);
      mongoose.connection.close();
      console.log('✅ Database connection test completed successfully!');
      process.exit(0);
    }
  });
});

// Set timeout
setTimeout(() => {
  console.error('❌ MongoDB connection timeout after 10 seconds');
  process.exit(1);
}, 10000);