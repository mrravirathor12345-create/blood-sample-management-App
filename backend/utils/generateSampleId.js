const Sample = require('../models/Sample');

const generateSampleId = async () => {
  try {
    const sampleCount = await Sample.countDocuments();
    return `SMP${String(sampleCount + 1).padStart(8, '0')}`;
  } catch (err) {
    throw new Error('Failed to generate sample ID');
  }
};

module.exports = generateSampleId;