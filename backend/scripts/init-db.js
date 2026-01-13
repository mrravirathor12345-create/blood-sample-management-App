const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Patient = require('../models/Patient');
const Test = require('../models/Test');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodsampledb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Test.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Create sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@lab.com',
        password: 'password123',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'Admin',
        department: 'Administration',
        employeeId: 'EMP001',
        phoneNumber: '+1 (555) 123-4567'
      },
      {
        username: 'drsmith',
        email: 'alice@lab.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'Doctor',
        department: 'Pathology',
        employeeId: 'EMP002',
        phoneNumber: '+1 (555) 234-5678'
      },
      {
        username: 'tech1',
        email: 'bob@lab.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Johnson',
        role: 'Lab Technician',
        department: 'Hematology',
        employeeId: 'EMP003',
        phoneNumber: '+1 (555) 345-6789'
      }
    ];
    
    await User.insertMany(users);
    console.log('Sample users created');
    
    // Create sample patients
    const patients = [
      {
        patientId: 'PAT000001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Male',
        bloodGroup: 'O+',
        phoneNumber: '+1 (555) 987-6543',
        email: 'john.doe@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 876-5432'
        }
      },
      {
        patientId: 'PAT000002',
        firstName: 'Sarah',
        lastName: 'Williams',
        dateOfBirth: new Date('1990-03-22'),
        gender: 'Female',
        bloodGroup: 'A-',
        phoneNumber: '+1 (555) 456-7890',
        email: 'sarah.williams@example.com',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Michael Williams',
          relationship: 'Father',
          phone: '+1 (555) 345-6789'
        }
      }
    ];
    
    await Patient.insertMany(patients);
    console.log('Sample patients created');
    
    // Create sample tests
    const tests = [
      {
        testName: 'Complete Blood Count',
        testCode: 'TST00001',
        category: 'Hematology',
        description: 'A common blood test that evaluates overall health and detects a wide range of disorders.',
        sampleTypeRequired: 'Whole Blood',
        turnaroundTime: 24,
        normalRange: {
          min: null,
          max: null,
          unit: null
        },
        criticalRange: {
          min: null,
          max: null
        },
        cost: 150,
        requiresFasting: false
      },
      {
        testName: 'Lipid Profile',
        testCode: 'TST00002',
        category: 'Biochemistry',
        description: 'Measures the amount of cholesterol and triglycerides in your blood.',
        sampleTypeRequired: 'Serum',
        turnaroundTime: 48,
        normalRange: {
          min: null,
          max: null,
          unit: null
        },
        criticalRange: {
          min: null,
          max: null
        },
        cost: 200,
        requiresFasting: true
      },
      {
        testName: 'Liver Function Test',
        testCode: 'TST00003',
        category: 'Biochemistry',
        description: 'A group of blood tests that give information about the normal function of the liver.',
        sampleTypeRequired: 'Serum',
        turnaroundTime: 24,
        normalRange: {
          min: null,
          max: null,
          unit: null
        },
        criticalRange: {
          min: null,
          max: null
        },
        cost: 180,
        requiresFasting: false
      }
    ];
    
    await Test.insertMany(tests);
    console.log('Sample tests created');
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
});