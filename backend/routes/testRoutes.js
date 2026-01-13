const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true }).sort({ testName: 1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get test by ID
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new test
router.post('/', async (req, res) => {
  try {
    // Generate test code
    const testCount = await Test.countDocuments();
    const testCode = `TST${String(testCount + 1).padStart(5, '0')}`;
    
    const test = new Test({
      ...req.body,
      testCode
    });
    
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update test
router.put('/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete test (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json({ message: 'Test deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;