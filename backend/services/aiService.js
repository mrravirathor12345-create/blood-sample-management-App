const Report = require('../models/Report');
const https = require('https');

// Helper to make HTTPS requests to Gemini API (zero-dependency)
function geminiPost(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseBody);
        } else {
          reject(new Error(`HTTP Error ${res.statusCode}: ${responseBody}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(bodyStr);
    req.end();
  });
}

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
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const patientInfo = report.patient ? {
          age: report.patient.dateOfBirth ? Math.floor((new Date() - new Date(report.patient.dateOfBirth)) / 31557600000) : 'Unknown',
          gender: report.patient.gender || 'Unknown',
          bloodGroup: report.patient.bloodGroup || 'Unknown'
        } : {};
        
        const testList = report.testResults.map(tr => ({
          testName: tr.test ? tr.test.testName : 'Unknown',
          value: tr.resultValue,
          unit: tr.unit,
          status: tr.status
        }));
        
        const systemPrompt = `You are a clinical laboratory AI assistant. Analyze these patient details and blood test results.
Identify abnormalities and output a JSON response matching the database structure.
Ensure your response is valid JSON and only contains this object structure:
{
  "hasAbnormalities": true/false,
  "flaggedParameters": ["Hemoglobin", "Glucose"],
  "riskLevel": "Low" or "Medium" or "High",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "confidenceScore": 0 to 100
}`;

        const userMessage = `Patient Info: ${JSON.stringify(patientInfo)}
Test Results: ${JSON.stringify(testList)}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.15,
            responseMimeType: 'application/json'
          }
        };
        
        const responseText = await geminiPost(url, payload);
        const data = JSON.parse(responseText);
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return {
            hasAbnormalities: !!result.hasAbnormalities,
            flaggedParameters: Array.isArray(result.flaggedParameters) ? result.flaggedParameters : [],
            riskLevel: ['Low', 'Medium', 'High'].includes(result.riskLevel) ? result.riskLevel : 'Low',
            recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
            confidenceScore: typeof result.confidenceScore === 'number' ? result.confidenceScore : 90
          };
        }
      } catch (error) {
        console.error('Backend Gemini AI analysis failed, falling back to rule engine:', error.message);
      }
    }

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