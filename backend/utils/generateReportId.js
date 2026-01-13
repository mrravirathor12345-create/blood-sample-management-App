const Report = require('../models/Report');

const generateReportId = async () => {
  try {
    const reportCount = await Report.countDocuments();
    return `RPT${String(reportCount + 1).padStart(8, '0')}`;
  } catch (err) {
    throw new Error('Failed to generate report ID');
  }
};

module.exports = generateReportId;