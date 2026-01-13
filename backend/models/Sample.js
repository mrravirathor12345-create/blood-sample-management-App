const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  sampleId: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectionDate: {
    type: Date,
    default: Date.now
  },
  collectionPoint: {
    type: String,
    required: true
  },
  sampleType: {
    type: String,
    enum: ['Whole Blood', 'Plasma', 'Serum', 'Buffy Coat'],
    required: true
  },
  volume: {
    type: Number, // in mL
    required: true
  },
  containerType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Collected', 'In Transit', 'At Lab', 'Processing', 'Processed', 'Stored', 'Disposed'],
    default: 'Collected'
  },
  priority: {
    type: String,
    enum: ['Routine', 'Urgent', 'Stat'],
    default: 'Routine'
  },
  qrCode: {
    type: String
  },
  barcode: {
    type: String
  },
  rfidTag: {
    type: String
  },
  testsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sample', sampleSchema);