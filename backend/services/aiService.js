const Report = require('../models/Report');

/**
 * AI Service for analyzing test results and identifying abnormalities
 */
class AIService {
  /**
   * Analyze test results for abnormalities
   * @param {Object} report - The report containing test results
   * @returns {Object} Analysis results with risk levels and recommendations
   */
  static async analyzeReport(report) {
    try {
      const analysis = {
        hasAbnormalities: false,
        flaggedParameters: [],
        riskLevel: 'Low',
        recommendations: [],
        confidenceScore: 0
      };

      // Analyze each test result
      for (const testResult of report.testResults) {
        const abnormality = this.checkAbnormality(testResult);
        if (abnormality.isAbnormal) {
          analysis.hasAbnormalities = true;
          analysis.flaggedParameters.push(testResult.test.testName);
          
          // Add recommendation based on abnormal result
          analysis.recommendations.push(...abnormality.recommendations);
        }
      }

      // Determine overall risk level
      if (analysis.flaggedParameters.length > 3) {
        analysis.riskLevel = 'High';
      } else if (analysis.flaggedParameters.length > 0) {
        analysis.riskLevel = 'Medium';
      }

      // Calculate confidence score based on number of analyzed parameters
      analysis.confidenceScore = Math.min(95, 70 + (report.testResults.length * 2));

      return analysis;
    } catch (error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Check if a test result is abnormal
   * @param {Object} testResult - Individual test result
   * @returns {Object} Abnormality check result
   */
  static checkAbnormality(testResult) {
    const result = {
      isAbnormal: false,
      recommendations: []
    };

    // Example rules for common blood tests
    switch (testResult.test.testName) {
      case 'Hemoglobin':
        if (testResult.resultValue < 12 || testResult.resultValue > 16) {
          result.isAbnormal = true;
          result.recommendations.push('Hemoglobin level is outside normal range. Consider checking for anemia or dehydration.');
        }
        break;
      
      case 'White Blood Cell Count':
        if (testResult.resultValue < 4000 || testResult.resultValue > 11000) {
          result.isAbnormal = true;
          result.recommendations.push('WBC count is abnormal. May indicate infection, inflammation, or immune system disorder.');
        }
        break;
      
      case 'Platelet Count':
        if (testResult.resultValue < 150000 || testResult.resultValue > 450000) {
          result.isAbnormal = true;
          result.recommendations.push('Platelet count is outside normal range. Evaluate for bleeding disorders or bone marrow issues.');
        }
        break;
      
      case 'Glucose':
        if (testResult.resultValue < 70 || testResult.resultValue > 100) {
          result.isAbnormal = true;
          result.recommendations.push('Glucose level is abnormal. Monitor for diabetes or hypoglycemia.');
        }
        break;
      
      case 'Cholesterol':
        if (testResult.resultValue > 200) {
          result.isAbnormal = true;
          result.recommendations.push('Cholesterol level is elevated. Recommend dietary changes and exercise.');
        }
        break;
    }

    return result;
  }

  /**
   * Generate personalized health insights
   * @param {Object} patient - Patient information
   * @param {Array} reports - Recent reports
   * @returns {Array} Personalized health insights
   */
  static generateHealthInsights(patient, reports) {
    const insights = [];
    
    // Analyze trends across multiple reports
    if (reports.length > 1) {
      // Example: Check for improving or worsening conditions
      const latestReport = reports[0];
      const previousReport = reports[1];
      
      // Compare key metrics
      for (const latestTest of latestReport.testResults) {
        const previousTest = previousReport.testResults.find(
          t => t.test.testName === latestTest.test.testName
        );
        
        if (previousTest) {
          const change = ((latestTest.resultValue - previousTest.resultValue) / previousTest.resultValue) * 100;
          
          if (Math.abs(change) > 10) {
            insights.push({
              parameter: latestTest.test.testName,
              change: change > 0 ? 'increased' : 'decreased',
              percentage: Math.abs(change).toFixed(1),
              recommendation: change > 0 
                ? `Monitor ${latestTest.test.testName} levels closely.` 
                : `Positive trend in ${latestTest.test.testName} levels.`
            });
          }
        }
      }
    }
    
    return insights;
  }
}

module.exports = AIService;