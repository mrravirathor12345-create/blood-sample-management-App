// Groq AI Service - Blood Sample Management System
// Uses Groq's ultra-fast LLaMA models for medical analysis

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('VITE_GROQ_API_KEY') || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192'; // Groq's fastest model

/**
 * Send a request to Groq API
 */
async function groqRequest(messages, systemPrompt = '', options = {}) {
  const activeKey = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('VITE_GROQ_API_KEY') || '';
  if (!activeKey) {
    throw new Error('GROQ_API_KEY not configured. Please add VITE_GROQ_API_KEY to your .env file or configure it in the AI Settings.');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${activeKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || MODEL,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages,
      ],
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature || 0.3,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Analyze blood test results and provide medical insights
 */
export async function analyzeBloodTestResults(testData) {
  const systemPrompt = `You are an expert medical laboratory AI assistant specializing in blood test analysis. 
Provide concise, clinically relevant insights based on blood test data. 
Always recommend consulting a doctor for medical decisions.
Format your response as JSON with these fields:
{
  "summary": "Brief 2-3 sentence clinical summary",
  "findings": [{"parameter": "name", "status": "Normal/High/Low/Critical", "interpretation": "brief note"}],
  "riskLevel": "Low/Medium/High/Critical",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "urgency": "Routine/Soon/Urgent/Emergency",
  "confidence": 0-100
}`;

  const userMessage = `Analyze these blood test results and provide medical insights:
${JSON.stringify(testData, null, 2)}`;

  const content = await groqRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    { maxTokens: 1500, temperature: 0.2 }
  );

  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { summary: content, findings: [], riskLevel: 'Unknown', recommendations: [], urgency: 'Routine', confidence: 0 };
  } catch {
    return { summary: content, findings: [], riskLevel: 'Unknown', recommendations: [], urgency: 'Routine', confidence: 0 };
  }
}

/**
 * Generate patient risk assessment based on history
 */
export async function generatePatientRiskAssessment(patientData) {
  const systemPrompt = `You are a medical AI specializing in patient risk stratification for laboratory services.
Analyze patient data and provide a comprehensive risk assessment.
Format response as JSON:
{
  "overallRisk": "Low/Medium/High/Critical",
  "riskScore": 0-100,
  "riskFactors": [{"factor": "name", "severity": "Low/Medium/High", "description": "brief"}],
  "predictedAbnormalities": ["potential issue 1", "potential issue 2"],
  "recommendedTests": ["test 1", "test 2"],
  "monitoringFrequency": "Monthly/Quarterly/Semi-annual/Annual",
  "clinicalNotes": "Brief clinical assessment"
}`;

  const userMessage = `Assess risk for this patient:
${JSON.stringify(patientData, null, 2)}`;

  const content = await groqRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    { maxTokens: 1200, temperature: 0.25 }
  );

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return { overallRisk: 'Unknown', riskScore: 0, riskFactors: [], predictedAbnormalities: [], recommendedTests: [], monitoringFrequency: 'Quarterly', clinicalNotes: content };
}

/**
 * Analyze population-level trends from lab data
 */
export async function analyzePopulationTrends(analyticsData) {
  const systemPrompt = `You are a public health and laboratory medicine AI analyst.
Analyze population-level blood test data and identify trends, anomalies, and actionable insights.
Format response as JSON:
{
  "trendSummary": "2-3 sentence population health summary",
  "keyTrends": [{"trend": "description", "significance": "Low/Medium/High", "actionRequired": true/false}],
  "anomalies": [{"parameter": "name", "deviation": "description", "possibleCause": "explanation"}],
  "seasonalPatterns": ["pattern 1", "pattern 2"],
  "operationalRecommendations": ["recommendation 1", "recommendation 2"],
  "forecastInsights": "Next period prediction",
  "qualityFlags": ["flag 1", "flag 2"]
}`;

  const userMessage = `Analyze this lab population data for trends and insights:
${JSON.stringify(analyticsData, null, 2)}`;

  const content = await groqRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    { maxTokens: 1500, temperature: 0.3 }
  );

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return { trendSummary: content, keyTrends: [], anomalies: [], seasonalPatterns: [], operationalRecommendations: [], forecastInsights: '', qualityFlags: [] };
}

/**
 * Medical Q&A chatbot for lab-related questions
 */
export async function askMedicalQuestion(question, conversationHistory = []) {
  const systemPrompt = `You are BloodAI, an expert medical laboratory assistant integrated into a Blood Sample Management System.
You help laboratory staff, doctors, and administrators understand:
- Blood test interpretations and reference ranges
- Sample collection and handling procedures  
- Laboratory workflows and best practices
- Patient management recommendations
- Quality control and calibration
Always be clinically accurate, concise, and recommend physician consultation for medical decisions.
Do NOT provide direct diagnoses. Always note uncertainty where appropriate.`;

  const messages = [
    ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: question }
  ];

  return await groqRequest(messages, systemPrompt, { maxTokens: 800, temperature: 0.4 });
}

/**
 * Generate smart report summary from test results
 */
export async function generateReportSummary(reportData) {
  const systemPrompt = `You are a medical report writing AI for laboratory reports.
Generate a clear, professional clinical summary for patient reports.
Format as JSON:
{
  "clinicalSummary": "Professional 3-4 sentence summary",
  "criticalValues": ["critical finding 1"],
  "normalFindings": ["normal parameter"],
  "followUpRequired": true/false,
  "followUpTimeframe": "1 week/1 month/3 months/etc",
  "physicianAlertRequired": true/false,
  "patientFriendlySummary": "Simple language explanation for patient"
}`;

  const userMessage = `Generate a clinical report summary for:
${JSON.stringify(reportData, null, 2)}`;

  const content = await groqRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    { maxTokens: 1000, temperature: 0.2 }
  );

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return { clinicalSummary: content, criticalValues: [], normalFindings: [], followUpRequired: false, followUpTimeframe: '', physicianAlertRequired: false, patientFriendlySummary: content };
}

/**
 * Detect anomalies in sample data
 */
export async function detectSampleAnomalies(samples) {
  const systemPrompt = `You are a laboratory quality control AI.
Analyze blood sample data for anomalies, quality issues, and processing irregularities.
Format as JSON:
{
  "anomalyScore": 0-100,
  "anomalies": [{"sampleId": "id", "issue": "description", "severity": "Low/Medium/High/Critical", "action": "recommended action"}],
  "qualityMetrics": {"overallQuality": "Excellent/Good/Fair/Poor", "rejectionRate": 0-100, "processingCompliance": 0-100},
  "systemAlerts": ["alert 1", "alert 2"],
  "recommendations": ["recommendation 1"]
}`;

  const userMessage = `Detect anomalies in these blood samples:
${JSON.stringify(samples, null, 2)}`;

  const content = await groqRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    { maxTokens: 1200, temperature: 0.2 }
  );

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}
  return { anomalyScore: 0, anomalies: [], qualityMetrics: {}, systemAlerts: [], recommendations: [] };
}

export async function dictateClinicalNotes(rawNotes) {
  const systemPrompt = `You are a clinical transcription and medical record formatting assistant.
Take unstructured, messy medical dictations or draft notes and structure them into a highly professional, clinical summary.
Include sections like: Key Symptoms, Preliminary Indications, Recommended Actions, and Note Summary.
Use professional medical terminology.`;

  const userMessage = `Structure these clinical notes:
"${rawNotes}"`;

  return await groqRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    { maxTokens: 800, temperature: 0.3 }
  );
}

export default {
  analyzeBloodTestResults,
  generatePatientRiskAssessment,
  analyzePopulationTrends,
  askMedicalQuestion,
  generateReportSummary,
  dictateClinicalNotes,
  detectSampleAnomalies,
};


