const express = require('express');
const router = express.Router();
const Sample = require('../models/Sample');
const Patient = require('../models/Patient');
const qrcode = require('qrcode');

// Get all samples
router.get('/', async (req, res) => {
  try {
    const samples = await Sample.find()
      .populate('patient', 'firstName lastName patientId')
      .populate('collector', 'firstName lastName')
      .populate('testsAssigned', 'testName testCode')
      .sort({ collectionDate: -1 });
    res.json(samples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get sample by ID
router.get('/:id', async (req, res) => {
  try {
    const sample = await Sample.findById(req.params.id)
      .populate('patient')
      .populate('collector', 'firstName lastName')
      .populate('testsAssigned');
      
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    res.json(sample);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new sample
router.post('/', async (req, res) => {
  try {
    // Generate sample ID
    const sampleCount = await Sample.countDocuments();
    const sampleId = `SMP${String(sampleCount + 1).padStart(8, '0')}`;
    
    // Generate QR code
    const qrData = `${sampleId}|${req.body.patient}|${new Date().toISOString()}`;
    const qrCode = await qrcode.toDataURL(qrData);
    
    const sample = new Sample({
      ...req.body,
      sampleId,
      qrCode
    });
    
    const newSample = await sample.save();
    
    // Populate references
    await newSample.populate('patient', 'firstName lastName patientId');
    await newSample.populate('collector', 'firstName lastName');
    await newSample.populate('testsAssigned', 'testName testCode');
    
    res.status(201).json(newSample);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update sample status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const sample = await Sample.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patient', 'firstName lastName patientId')
      .populate('collector', 'firstName lastName')
      .populate('testsAssigned', 'testName testCode');
    
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    
    res.json(sample);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign tests to sample
router.patch('/:id/assign-tests', async (req, res) => {
  try {
    const { tests } = req.body;
    
    const sample = await Sample.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { testsAssigned: { $each: tests } },
        status: 'Processing'
      },
      { new: true }
    ).populate('patient', 'firstName lastName patientId')
      .populate('collector', 'firstName lastName')
      .populate('testsAssigned', 'testName testCode');
    
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    
    res.json(sample);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete sample
router.delete('/:id', async (req, res) => {
  try {
    const sample = await Sample.findByIdAndDelete(req.params.id);
    
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    
    res.json({ message: 'Sample deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;