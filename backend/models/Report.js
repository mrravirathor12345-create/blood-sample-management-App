const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  sample: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sample',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  testResults: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    resultValue: mongoose.Schema.Types.Mixed,
    unit: String,
    status: {
      type: String,
      enum: ['Normal', 'Abnormal', 'Critical', 'Pending']
    },
    remarks: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],
  conclusion: String,
  recommendations: [String],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  pdfUrl: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  viewedByPatient: {
    type: Boolean,
    default: false
  },
  aiAnalysis: {
    hasAbnormalities: Boolean,
    flaggedParameters: [String],
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    },
    recommendations: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);