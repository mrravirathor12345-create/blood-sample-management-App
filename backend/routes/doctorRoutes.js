const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' })
      .select('-password')
      .sort({ firstName: 1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reports assigned to doctor
router.get('/reports/:doctorId', async (req, res) => {
  try {
    const reports = await Report.find({ doctor: req.params.doctorId })
      .populate('patient', 'firstName lastName patientId')
      .populate('sample', 'sampleId collectionDate')
      .populate('testResults.test', 'testName normalRange')
      .sort({ createdAt: -1 });
      
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve report
router.patch('/reports/:reportId/approve', async (req, res) => {
  try {
    const { doctorId, notes } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      {
        isApproved: true,
        approvedBy: doctorId,
        approvedAt: new Date(),
        ...(notes && { conclusion: notes })
      },
      { new: true }
    )
      .populate('patient', 'firstName lastName patientId')
      .populate('sample', 'sampleId collectionDate')
      .populate('testResults.test', 'testName normalRange');
      
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id)
      .select('-password');
      
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;