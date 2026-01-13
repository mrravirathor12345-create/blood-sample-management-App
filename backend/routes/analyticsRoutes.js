const express = require('express');
const router = express.Router();
const Sample = require('../models/Sample');
const Report = require('../models/Report');
const Patient = require('../models/Patient');
const Test = require('../models/Test');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get counts
    const totalPatients = await Patient.countDocuments();
    const totalSamples = await Sample.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalTests = await Test.countDocuments({ isActive: true });
    
    // Get recent samples
    const recentSamples = await Sample.find()
      .populate('patient', 'firstName lastName')
      .sort({ collectionDate: -1 })
      .limit(5);
    
    // Get sample status distribution
    const statusDistribution = await Sample.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get samples collected in last 30 days
    const samplesLast30Days = await Sample.find({
      collectionDate: { $gte: thirtyDaysAgo }
    });
    
    // Group by date for chart
    const samplesByDate = {};
    samplesLast30Days.forEach(sample => {
      const date = sample.collectionDate.toISOString().split('T')[0];
      samplesByDate[date] = (samplesByDate[date] || 0) + 1;
    });
    
    res.json({
      stats: {
        totalPatients,
        totalSamples,
        totalReports,
        totalTests
      },
      recentSamples,
      statusDistribution,
      samplesByDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient demographics
router.get('/patients/demographics', async (req, res) => {
  try {
    // Gender distribution
    const genderDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Age distribution
    const ageDistribution = await Patient.aggregate([
      {
        $project: {
          age: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                365 * 24 * 60 * 60 * 1000
              ]
            }
          }
        }
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 35, 50, 65, 100],
          default: '65+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    
    res.json({
      genderDistribution,
      ageDistribution
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get test statistics
router.get('/tests/statistics', async (req, res) => {
  try {
    // Most requested tests
    const popularTests = await Report.aggregate([
      { $unwind: '$testResults' },
      {
        $group: {
          _id: '$testResults.test',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).exec();
    
    // Populate test details
    const testIds = popularTests.map(item => item._id);
    const tests = await Test.find({ _id: { $in: testIds } });
    
    const testData = popularTests.map(item => {
      const test = tests.find(t => t._id.toString() === item._id.toString());
      return {
        test: test ? test.testName : 'Unknown Test',
        count: item.count
      };
    });
    
    res.json({
      popularTests: testData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get abnormal result statistics
router.get('/reports/abnormalities', async (req, res) => {
  try {
    // Count of reports with abnormalities
    const abnormalReports = await Report.countDocuments({
      'aiAnalysis.hasAbnormalities': true
    });
    
    // Total reports
    const totalReports = await Report.countDocuments();
    
    // Abnormality rate
    const abnormalityRate = totalReports > 0 
      ? ((abnormalReports / totalReports) * 100).toFixed(2) 
      : 0;
    
    res.json({
      abnormalReports,
      totalReports,
      abnormalityRate: parseFloat(abnormalityRate)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;