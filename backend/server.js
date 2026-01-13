const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
if (process.env.MONGODB_REQUIRED !== 'false') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodsampledb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(err => {
    console.log('Failed to connect to MongoDB, continuing without database:', err.message);
  });
} else {
  console.log('MongoDB connection skipped as per configuration');
}

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  console.log('Starting server without database connection...');
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Blood Sample Management System API' });
});

// Patient routes
app.use('/api/patients', require('./routes/patientRoutes'));

// Sample routes
app.use('/api/samples', require('./routes/sampleRoutes'));

// Test routes
app.use('/api/tests', require('./routes/testRoutes'));

// User/auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Doctor routes
app.use('/api/doctors', require('./routes/doctorRoutes'));

// Report routes
app.use('/api/reports', require('./routes/reportRoutes'));

// Analytics routes
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check route
app.use('/api', require('./routes/healthRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});