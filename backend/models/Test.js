const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  testCode: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  methodology: String,
  sampleTypeRequired: {
    type: String,
    enum: ['Whole Blood', 'Plasma', 'Serum', 'Buffy Coat'],
    required: true
  },
  turnaroundTime: { // in hours
    type: Number,
    required: true
  },
  normalRange: {
    min: Number,
    max: Number,
    unit: String
  },
  criticalRange: {
    min: Number,
    max: Number
  },
  cost: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requiresFasting: {
    type: Boolean,
    default: false
  },
  preparationInstructions: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', testSchema);