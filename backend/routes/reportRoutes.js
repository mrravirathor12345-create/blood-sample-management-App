const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Sample = require('../models/Sample');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const AIService = require('../services/aiService');
const notificationService = require('../services/notificationService');

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patient', 'firstName lastName patientId')
      .populate('sample', 'sampleId collectionDate')
      .populate('doctor', 'firstName lastName')
      .sort({ generatedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient')
      .populate('sample')
      .populate('doctor', 'firstName lastName')
      .populate('technician', 'firstName lastName')
      .populate('testResults.test');
      
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new report
router.post('/', async (req, res) => {
  try {
    // Generate report ID
    const reportCount = await Report.countDocuments();
    const reportId = `RPT${String(reportCount + 1).padStart(8, '0')}`;
    
    const report = new Report({
      ...req.body,
      reportId
    });
    
    const newReport = await report.save();
    
    // Populate references
    await newReport.populate('patient', 'firstName lastName patientId');
    await newReport.populate('sample', 'sampleId collectionDate');
    await newReport.populate('doctor', 'firstName lastName');
    await newReport.populate('testResults.test');
    
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update test results in report
router.patch('/:id/results', async (req, res) => {
  try {
    const { testResults, technicianId } = req.body;
    
    // Perform AI analysis if test results are provided
    let aiAnalysis = null;
    if (testResults && testResults.length > 0) {
      const report = await Report.findById(req.params.id)
        .populate('testResults.test')
        .populate('patient')
        .populate('sample');
      
      if (report) {
        // Update report with test results first
        report.testResults = testResults;
        report.technician = technicianId;
        report.generatedAt = new Date();
        await report.save();
        
        // Perform AI analysis
        aiAnalysis = await AIService.analyzeReport(report);
        
        // Send notifications if there are abnormal results
        const abnormalTests = testResults.filter(test => 
          test.status === 'Abnormal' || test.status === 'Critical'
        );
        
        if (abnormalTests.length > 0) {
          try {
            await notificationService.sendAbnormalResultAlert(
              report.patient, 
              report, 
              abnormalTests
            );
          } catch (notificationError) {
            console.error('Failed to send abnormal result notification:', notificationError);
          }
        }
        
        // Send report ready notification to patient
        try {
          await notificationService.sendReportReadyNotification(
            report.patient, 
            report
          );
        } catch (notificationError) {
          console.error('Failed to send report ready notification:', notificationError);
        }
        
        // Notify doctor for review if assigned
        if (report.doctor) {
          try {
            await notificationService.sendDoctorReviewNotification(
              report.doctor,
              report,
              report.patient
            );
          } catch (notificationError) {
            console.error('Failed to send doctor review notification:', notificationError);
          }
        }
      }
    }
    
    const updateData = {
      testResults,
      technician: technicianId,
      ...(testResults && testResults.length > 0 ? { 
        generatedAt: new Date(),
        'aiAnalysis.hasAbnormalities': testResults.some(r => r.status === 'Abnormal' || r.status === 'Critical')
      } : {})
    };
    
    // Add AI analysis results if available
    if (aiAnalysis) {
      updateData.aiAnalysis = aiAnalysis;
    }
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('patient', 'firstName lastName patientId')
      .populate('sample', 'sampleId collectionDate')
      .populate('doctor', 'firstName lastName')
      .populate('testResults.test');
      
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Generate PDF report
router.get('/:id/pdf', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient')
      .populate('sample')
      .populate('doctor', 'firstName lastName')
      .populate('testResults.test');
      
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Create PDF
    const doc = new PDFDocument();
    const filename = `report_${report.reportId}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    
    // Pipe the PDF to a writable stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Add content to PDF
    doc.fontSize(18).text('Blood Sample Test Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Report ID: ${report.reportId}`);
    doc.text(`Patient: ${report.patient.firstName} ${report.patient.lastName}`);
    doc.text(`Sample ID: ${report.sample.sampleId}`);
    doc.text(`Generated At: ${report.generatedAt.toLocaleDateString()}`);
    doc.moveDown();
    
    // Add test results
    doc.fontSize(14).text('Test Results:');
    doc.moveDown();
    
    report.testResults.forEach(result => {
      doc.fontSize(12).text(`${result.test.testName}: ${result.resultValue} ${result.unit || ''}`);
      doc.text(`Status: ${result.status}`);
      if (result.remarks) {
        doc.text(`Remarks: ${result.remarks}`);
      }
      doc.moveDown();
    });
    
    // Add AI analysis if available
    if (report.aiAnalysis && report.aiAnalysis.hasAbnormalities) {
      doc.fontSize(14).text('AI Analysis:');
      doc.moveDown();
      doc.fontSize(12).text(`Risk Level: ${report.aiAnalysis.riskLevel}`);
      doc.text(`Confidence Score: ${report.aiAnalysis.confidenceScore}%`);
      doc.moveDown();
      
      if (report.aiAnalysis.recommendations.length > 0) {
        doc.text('Recommendations:');
        report.aiAnalysis.recommendations.forEach((rec, index) => {
          doc.text(`${index + 1}. ${rec}`);
        });
      }
    }
    
    // Add conclusion if available
    if (report.conclusion) {
      doc.fontSize(14).text('Conclusion:');
      doc.fontSize(12).text(report.conclusion);
    }
    
    // Finalize PDF
    doc.end();
    
    // Wait for the file to be written
    stream.on('finish', () => {
      // Update report with PDF URL
      report.pdfUrl = `/uploads/${filename}`;
      report.save();
      
      // Send PDF file
      res.sendFile(filePath);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark report as viewed by patient
router.patch('/:id/viewed', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { viewedByPatient: true },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json({ message: 'Report marked as viewed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get AI analysis for a report
router.get('/:id/ai-analysis', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('testResults.test');
      
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Perform AI analysis
    const analysis = await AIService.analyzeReport(report);
    
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;