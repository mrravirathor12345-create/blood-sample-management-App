import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  analyzeBloodTestResults as analyzeGroq, 
  askMedicalQuestion as askGroq,
  dictateClinicalNotes as dictateGroq
} from '../services/groqService';
import { 
  analyzeBloodTestResults as analyzeGemini, 
  askMedicalQuestion as askGemini,
  dictateClinicalNotes as dictateGemini
} from '../services/geminiService';
import './AIAnalysisDashboard.css';

// SVG Dashboard Circular Ring component - MOVED OUTSIDE for performance
const HealthRing = ({ color, percentage, label, icon }) => {
  const radius = 36;
  const strokeWidth = 5.5;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="health-ring-card glass-card">
      <div className="ring-graphic-container">
        <svg className="ring-svg" width="80" height="80">
          <circle
            className="ring-bg-track"
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx="40"
            cy="40"
          />
          <motion.circle
            className="ring-progress"
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx="40"
            cy="40"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="ring-center-icon" style={{ color }}>
          <span className="material-icons">{icon}</span>
        </div>
      </div>
      <div className="ring-text-block">
        <span className="ring-percentage">{Math.round(percentage)}%</span>
        <span className="ring-label">{label}</span>
      </div>
    </div>
  );
};

const AIAnalysisDashboard = () => {
  // AI Engine State ('gemini' or 'groq')
  const [aiEngine, setAiEngine] = useState(localStorage.getItem('VITE_AI_ENGINE') || import.meta.env.VITE_AI_ENGINE || 'groq');
  
  // API Keys State
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('VITE_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [groqKey, setGroqKey] = useState(localStorage.getItem('VITE_GROQ_API_KEY') || import.meta.env.VITE_GROQ_API_KEY || '');
  const [showSettings, setShowSettings] = useState(false);
  
  // Sandbox Sliders State (Expanded with TSH, Cholesterol, Creatinine, Bilirubin)
  const [parameters, setParameters] = useState({
    hemoglobin: 14.0,    // normal: 12-16 g/dL
    wbc: 7500,           // normal: 4000-11000 /μL
    platelets: 280000,   // normal: 150000-450000 /μL
    glucose: 90,         // normal: 70-100 mg/dL
    cholesterol: 180,    // normal: 120-200 mg/dL
    creatinine: 0.9,     // normal: 0.6-1.2 mg/dL (Kidney)
    bilirubin: 0.7,      // normal: 0.2-1.2 mg/dL (Liver)
    tsh: 2.1             // normal: 0.4-4.0 uIU/mL (Thyroid)
  });

  // Active Widget Tab ('risk', 'tests', 'dictation')
  const [activeTab, setActiveTab] = useState('risk');

  // Voice Output State
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Diagnostic Results State
  const [diagnosis, setDiagnosis] = useState({
    summary: 'Adjust sliders to simulate blood panel metrics and trigger AI diagnostic analysis.',
    findings: [],
    riskLevel: 'Low',
    recommendations: [],
    urgency: 'Routine',
    confidence: 100
  });

  // Agent Thinking Timeline States
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingProgress, setThinkingProgress] = useState(0);

  // Chat Console States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your clinical AI assistant. I can help analyze blood metrics or answer lab questions." }
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  
  // Note Dictation Assistant States
  const [rawNotes, setRawNotes] = useState('');
  const [formattedNotes, setFormattedNotes] = useState('');
  const [isFormattingNotes, setIsFormattingNotes] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  // Persist engine changes
  useEffect(() => {
    localStorage.setItem('VITE_AI_ENGINE', aiEngine);
  }, [aiEngine]);

  // Save Settings Form
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('VITE_GEMINI_API_KEY', geminiKey.trim());
    localStorage.setItem('VITE_GROQ_API_KEY', groqKey.trim());
    toast.success('API Configurations saved successfully!');
    setShowSettings(false);
    triggerAIDiagnosis();
  };

  // Check if API key for current engine is active
  const isEngineActive = () => {
    if (aiEngine === 'gemini') return !!geminiKey;
    if (aiEngine === 'groq') return !!groqKey;
    return false;
  };

  // Run AI Diagnosis based on sliders
  const triggerAIDiagnosis = async () => {
    setIsThinking(true);
    setThinkingProgress(0);
    
    // Setup reasoning timeline steps
    const steps = [
      { id: 1, text: 'Scanning cellular metrics...', status: 'pending' },
      { id: 2, text: 'Mapping multi-system risk...', status: 'pending' },
      { id: 3, text: 'Calculating trends...', status: 'pending' },
      { id: 4, text: 'Generating insights...', status: 'pending' }
    ];
    setThinkingSteps(steps);

    // Simulate Agent Thinking Steps sequentially
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 350));
      setThinkingSteps(prev => prev.map((step, idx) => {
        if (idx === i) return { ...step, status: 'active' };
        if (idx < i) return { ...step, status: 'completed' };
        return step;
      }));
      setThinkingProgress(((i + 1) / steps.length) * 100);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    setThinkingSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));

    const activeKey = aiEngine === 'gemini' ? geminiKey : groqKey;
    
    if (activeKey) {
      try {
        const testData = [
          { testName: 'Hemoglobin', resultValue: parameters.hemoglobin, unit: 'g/dL' },
          { testName: 'White Blood Cell Count', resultValue: parameters.wbc, unit: '/μL' },
          { testName: 'Platelet Count', resultValue: parameters.platelets, unit: '/μL' },
          { testName: 'Glucose', resultValue: parameters.glucose, unit: 'mg/dL' },
          { testName: 'Cholesterol', resultValue: parameters.cholesterol, unit: 'mg/dL' },
          { testName: 'Creatinine', resultValue: parameters.creatinine, unit: 'mg/dL' },
          { testName: 'Bilirubin', resultValue: parameters.bilirubin, unit: 'mg/dL' },
          { testName: 'Thyroid Stimulating Hormone', resultValue: parameters.tsh, unit: 'uIU/mL' }
        ];

        const result = aiEngine === 'gemini' 
          ? await analyzeGemini(testData)
          : await analyzeGroq(testData);

        setDiagnosis(result);
      } catch (error) {
        toast.error(`${aiEngine === 'gemini' ? 'Gemini' : 'Groq'} API error. Using local fallback.`);
        runLocalDiagnosis();
      }
    } else {
      runLocalDiagnosis();
    }
    setIsThinking(false);
  };

  // Run local high-fidelity diagnostic engine (fallback)
  const runLocalDiagnosis = () => {
    const findings = [];
    const recs = [];
    let risk = 'Low';
    let urgency = 'Routine';
    let summary = 'All cellular metrics are within optimal clinical limits.';

    // Check Hemoglobin
    if (parameters.hemoglobin < 12.0) {
      findings.push({ parameter: 'Hemoglobin', status: 'Low', interpretation: 'Suggests anemia, low oxygen transfer.' });
      recs.push('Increase dietary iron and screen for serum ferritin levels.');
      risk = 'Medium';
      urgency = 'Soon';
    } else if (parameters.hemoglobin > 16.0) {
      findings.push({ parameter: 'Hemoglobin', status: 'High', interpretation: 'Suggests erythrocytosis or dehydration.' });
      recs.push('Ensure proper hydration and consult hematology if levels persist.');
      risk = 'Medium';
    } else {
      findings.push({ parameter: 'Hemoglobin', status: 'Normal', interpretation: 'Healthy red blood cell concentration.' });
    }

    // Check WBC
    if (parameters.wbc < 4000) {
      findings.push({ parameter: 'WBC Count', status: 'Low', interpretation: 'Leukopenia; elevated infection vulnerability.' });
      recs.push('Apply infection precautions. Monitor body temperature.');
      risk = 'High';
      urgency = 'Urgent';
    } else if (parameters.wbc > 11000) {
      findings.push({ parameter: 'WBC Count', status: 'High', interpretation: 'Leukocytosis; indicator of infection or inflammation.' });
      recs.push('Identify symptoms of localized infection (respiratory, urinary, dermal).');
      risk = 'Medium';
      urgency = 'Soon';
    } else {
      findings.push({ parameter: 'WBC Count', status: 'Normal', interpretation: 'Normal active white blood cells count.' });
    }

    // Check Platelets
    if (parameters.platelets < 150000) {
      findings.push({ parameter: 'Platelet Count', status: 'Low', interpretation: 'Thrombocytopenia; risk of bleeding complications.' });
      recs.push('Avoid blood-thinning NSAIDs (aspirin, ibuprofen) and active sports.');
      risk = parameters.platelets < 80000 ? 'Critical' : 'High';
      urgency = parameters.platelets < 80000 ? 'Emergency' : 'Urgent';
    } else if (parameters.platelets > 450000) {
      findings.push({ parameter: 'Platelet Count', status: 'High', interpretation: 'Thrombocytosis; hypercoagulable risk.' });
      recs.push('Promote physical movement and stay hydrated to prevent clotting.');
      risk = 'Medium';
    } else {
      findings.push({ parameter: 'Platelet Count', status: 'Normal', interpretation: 'Healthy clotting mechanisms.' });
    }

    // Check Glucose
    if (parameters.glucose < 70) {
      findings.push({ parameter: 'Glucose', status: 'Low', interpretation: 'Hypoglycemia; acute glucose depletion.' });
      recs.push('Administer fast-acting carbohydrates (juice, glucose tablet) immediately.');
      risk = 'High';
      urgency = 'Urgent';
    } else if (parameters.glucose > 100) {
      findings.push({ parameter: 'Glucose', status: 'High', interpretation: 'Hyperglycemia; impaired fasting glycemic response.' });
      recs.push('Verify glycosylated hemoglobin (HbA1c) and restrict refined sugars.');
      risk = parameters.glucose > 180 ? 'High' : 'Medium';
      urgency = parameters.glucose > 180 ? 'Soon' : 'Routine';
    } else {
      findings.push({ parameter: 'Glucose', status: 'Normal', interpretation: 'Optimal glycemic control.' });
    }

    // Check Cholesterol
    if (parameters.cholesterol > 200) {
      findings.push({ parameter: 'Cholesterol', status: 'High', interpretation: 'Hypercholesterolemia; cardiovascular plaque risk.' });
      recs.push('Decrease saturated fat intake, introduce soluble fibers, and check lipid panels.');
      if (risk !== 'High' && risk !== 'Critical') risk = 'Medium';
    }

    // Check Creatinine
    if (parameters.creatinine > 1.2) {
      findings.push({ parameter: 'Creatinine', status: 'High', interpretation: 'Elevated creatinine indicates reduced glomerular filtration.' });
      recs.push('Check kidney functions (eGFR) and avoid high protein loadings or nephrotoxic agents.');
      risk = parameters.creatinine > 2.0 ? 'High' : 'Medium';
      urgency = parameters.creatinine > 2.0 ? 'Urgent' : 'Soon';
    }

    // Check Bilirubin
    if (parameters.bilirubin > 1.2) {
      findings.push({ parameter: 'Bilirubin', status: 'High', interpretation: 'Hyperbilirubinemia; biliary obstruction or liver cell stress.' });
      recs.push('Run liver function tests (LFT) and evaluate for symptoms of jaundice.');
      risk = 'Medium';
    }

    // Check TSH
    if (parameters.tsh < 0.4) {
      findings.push({ parameter: 'TSH', status: 'Low', interpretation: 'Suppressed TSH indicates primary hyperthyroidism.' });
      recs.push('Test free thyroid hormones (FT3/FT4) and thyroid antibody panels.');
      risk = 'Medium';
    } else if (parameters.tsh > 4.0) {
      findings.push({ parameter: 'TSH', status: 'High', interpretation: 'Elevated TSH indicates subclinical or primary hypothyroidism.' });
      recs.push('Check free T4 levels to assess thyroid replacement indications.');
      risk = 'Medium';
    }

    const abnormalCount = findings.filter(f => f.status !== 'Normal').length;
    if (abnormalCount === 0) {
      summary = 'All parameters reside in optimal healthy ranges. No active pathologies detected.';
    } else {
      summary = `Simulated panel indicates ${abnormalCount} abnormal reading${abnormalCount > 1 ? 's' : ''}. Primary risk profile is calculated as ${risk}.`;
    }

    setDiagnosis({
      summary,
      findings,
      riskLevel: risk,
      recommendations: recs.length > 0 ? recs : ['Maintain standard clinical hygiene, hydration, and nutritional diet.'],
      urgency,
      confidence: 95
    });
  };

  // Run initial diagnosis on parameter change
  useEffect(() => {
    triggerAIDiagnosis();
  }, [
    parameters.hemoglobin, 
    parameters.wbc, 
    parameters.platelets, 
    parameters.glucose,
    parameters.cholesterol,
    parameters.creatinine,
    parameters.bilirubin,
    parameters.tsh
  ]);

  // Handle Chat submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatTyping(true);

    const activeKey = aiEngine === 'gemini' ? geminiKey : groqKey;
    
    if (activeKey) {
      try {
        const history = chatMessages.slice(-5); // feed last 5 messages for context
        const response = aiEngine === 'gemini'
          ? await askGemini(userMsg, history)
          : await askGroq(userMsg, history);

        setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
        
        // Auto Speak Response
        if (voiceEnabled) {
          speakText(response);
        }
      } catch (error) {
        toast.error('AI chat failed. Using offline medical responder.');
        runLocalChatResponder(userMsg);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      runLocalChatResponder(userMsg);
    }
    setIsChatTyping(false);
  };

  // Local simulated chatbot logic (offline fallback)
  const runLocalChatResponder = (question) => {
    const q = question.toLowerCase();
    let response = `I'm running in local mode. Clinical guidance:\n\n`;

    if (q.includes('hemoglobin') || q.includes('anemia') || q.includes('oxygen')) {
      response += "Hemoglobin carries oxygen in red blood cells. Normal range is 12-16 g/dL. Low values point to anemia.";
    } else if (q.includes('wbc') || q.includes('white blood cell') || q.includes('infection')) {
      response += "White blood cells defend against pathogens. Normal range is 4,000-11,000 /μL.";
    } else if (q.includes('platelet') || q.includes('bleeding') || q.includes('clot')) {
      response += "Platelets coagulate blood. Normal range is 150k-450k /μL.";
    } else if (q.includes('glucose') || q.includes('sugar') || q.includes('diabetes')) {
      response += "Fasting blood glucose normal range is 70-100 mg/dL. Elevated levels indicate prediabetes/diabetes.";
    } else if (q.includes('creatinine') || q.includes('kidney')) {
      response += "Creatinine normal range is 0.6-1.2 mg/dL. Elevations signal decreased kidney function.";
    } else if (q.includes('bilirubin') || q.includes('liver')) {
      response += "Bilirubin normal range is 0.2-1.2 mg/dL. High levels point to liver stress.";
    } else if (q.includes('tsh') || q.includes('thyroid')) {
      response += "TSH normal range is 0.4-4.0 uIU/mL. High = hypothyroidism; low = hyperthyroidism.";
    } else {
      response += "Please configure your API keys in Settings to unlock full clinical dialogue.";
    }

    setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    if (voiceEnabled) speakText(response);
  };

  // Text to Speech Helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`_\-]/g, '').replace(/\{[\s\S]*\}/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Format Notes Handler
  const handleFormatNotes = async () => {
    if (!rawNotes.trim()) return;
    setIsFormattingNotes(true);
    const activeKey = aiEngine === 'gemini' ? geminiKey : groqKey;

    if (activeKey) {
      try {
        const formatted = aiEngine === 'gemini'
          ? await dictateGemini(rawNotes)
          : await dictateGroq(rawNotes);
        setFormattedNotes(formatted);
      } catch (error) {
        toast.error('Formatting notes failed. Using local template.');
        runLocalNotesFormatter();
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runLocalNotesFormatter();
    }
    setIsFormattingNotes(false);
  };

  // Local Notes Formatter fallback
  const runLocalNotesFormatter = () => {
    const formatted = `[CLINICAL RECORD FORMATTING - LOCAL ENGINE]\n\n1. KEY SYMPTOMS & OBSERVATIONS\n- Patient records: "${rawNotes}"\n\n2. INITIAL FINDINGS\n- Evaluated against standard clinical lab limits\n\n3. SUGGESTED FOLLOW-UP ACTION PROTOCOLS\n- Re-run parameters check`;
    setFormattedNotes(formatted);
  };

  // Helper to color risk levels
  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return '#34c759';
      case 'Medium': return '#ff9500';
      case 'High': return '#ff3b30';
      case 'Critical': return '#af52de';
      default: return '#8e8e93';
    }
  };

  // Apple Watch Rings percentage calculator
  const getProgressPercentage = (param, value) => {
    switch (param) {
      case 'hemoglobin':
        return Math.min(100, Math.max(10, ((value - 5) / 15) * 100));
      case 'wbc':
        return Math.min(100, Math.max(10, ((value - 1000) / 29000) * 100));
      case 'platelets':
        return Math.min(100, Math.max(10, ((value - 20000) / 580000) * 100));
      case 'glucose':
        return Math.min(100, Math.max(10, ((value - 30) / 270) * 100));
      default:
        return 50;
    }
  };

  // Dynamic Risk stratification metrics for local display
  const getSystemRisks = () => {
    const cardiovascular = Math.min(100, Math.round(
      (parameters.cholesterol > 200 ? (parameters.cholesterol - 150) * 0.35 : 10) +
      (parameters.hemoglobin < 11.5 || parameters.hemoglobin > 16.5 ? 20 : 0) +
      (parameters.platelets > 400000 ? 15 : 0)
    ));

    const diabetic = Math.min(100, Math.round(
      parameters.glucose > 100 ? (parameters.glucose - 80) * 0.45 : 10
    ));

    const renal = Math.min(100, Math.round(
      parameters.creatinine > 1.1 ? (parameters.creatinine - 0.6) * 18 : 10
    ));

    const hepatic = Math.min(100, Math.round(
      parameters.bilirubin > 1.1 ? (parameters.bilirubin - 0.5) * 12 : 10
    ));

    return { cardiovascular, diabetic, renal, hepatic };
  };

  // Dynamic test recommender
  const getTestRecommendations = () => {
    const recs = [];
    if (parameters.glucose > 100) {
      recs.push({
        test: 'HbA1c & Fasting Insulin',
        rationale: 'Elevated glucose detected. HbA1c measures 3-month glycemic trends.'
      });
    }
    if (parameters.cholesterol > 200) {
      recs.push({
        test: 'Lipid Subfraction Panel',
        rationale: 'High cholesterol levels. Assess cardiovascular risk by LDL-C and ApoB.'
      });
    }
    if (parameters.wbc > 11000 || parameters.wbc < 4000) {
      recs.push({
        test: 'CBC with Diff & CRP Test',
        rationale: 'Immunological metrics deviate. High WBC signals inflammation; CRP confirms it.'
      });
    }
    if (parameters.creatinine > 1.2) {
      recs.push({
        test: 'Renal Clearance & eGFR',
        rationale: 'Kidney filtration compromised. eGFR verifies GFR levels for staging.'
      });
    }
    if (parameters.bilirubin > 1.2) {
      recs.push({
        test: 'Hepatic Enzyme LFT Panel',
        rationale: 'Elevated bilirubin suggests liver strain. Check ALT/AST.'
      });
    }
    if (parameters.tsh > 4.0 || parameters.tsh < 0.4) {
      recs.push({
        test: 'Free T3 & Free T4 Panel',
        rationale: 'Thyroid signals fluctuate. Check active hormones.'
      });
    }

    if (recs.length === 0) {
      recs.push({
        test: 'Annual Health Panel Screen',
        rationale: 'All metrics inside optimal ranges. Continue routine checks.'
      });
    }
    return recs;
  };

  const systemRisks = getSystemRisks();
  const testRecommendations = getTestRecommendations();

  return (
    <div className="ai-co-pilot-container page-shell apple-theme">
      {/* Animated Background */}
      <div className="dna-particle-bg">
        {[...Array(18)].map((_, i) => (
          <div 
            key={i} 
            className="dna-node" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${14 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Header Block */}
      <header className="copilot-header">
        <div className="header-brand-container">
          <div className="logo-badge">
            <span className="material-icons logo-icon">medical_services</span>
          </div>
          <div className="header-text">
            <span className="superscript">Clinical Intelligence Suite</span>
            <h1>AI Diagnostic Co-Pilot</h1>
          </div>
          <span className="engine-badge pill-badge">
            {aiEngine === 'gemini' ? 'Gemini AI' : 'Groq AI'}
          </span>
        </div>
        
        <div className="header-actions">
          <div className="engine-segmented-control glass-card">
            <button 
              className={`segmented-btn ${aiEngine === 'gemini' ? 'active' : ''}`}
              onClick={() => setAiEngine('gemini')}
            >
              Gemini
            </button>
            <button 
              className={`segmented-btn ${aiEngine === 'groq' ? 'active' : ''}`}
              onClick={() => setAiEngine('groq')}
            >
              Groq
            </button>
          </div>

          <button 
            onClick={() => setShowSettings(true)} 
            className="settings-toggle-btn glass-card pill-btn"
            title="Configure API Keys"
          >
            <span className="material-icons">settings</span>
            Settings
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-backdrop">
          <motion.div 
            className="settings-modal-card glass-card apple-shadow"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="material-icons modal-icon">vpn_key</span>
                <h2>API Configuration</h2>
              </div>
              <button className="close-modal-btn" onClick={() => setShowSettings(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <p className="modal-subtext">Connect your AI models for live clinical diagnostic reasoning</p>
            
            <form onSubmit={handleSaveSettings} className="modal-form">
              <div className="form-group-field">
                <div className="field-label-wrap">
                  <span className="material-icons field-icon">smart_toy</span>
                  <label>Google Gemini API Key</label>
                </div>
                <div className="input-with-icon">
                  <span className="material-icons">key</span>
                  <input 
                    type="password" 
                    placeholder="Enter Gemini API key..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group-field">
                <div className="field-label-wrap">
                  <span className="material-icons field-icon">psychology</span>
                  <label>Groq LLaMA API Key</label>
                </div>
                <div className="input-with-icon">
                  <span className="material-icons">vpn_key</span>
                  <input 
                    type="password" 
                    placeholder="Enter Groq API key..."
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowSettings(false)}>Cancel</button>
                <button type="submit" className="save-btn pill-btn">Save & Apply</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Grid Layout */}
      <main className="copilot-grid">
        
        {/* PANEL 1: Clinical Sandbox (Sliders) */}
        <section className="copilot-card glass-card panel-sliders">
          <div className="card-header-bar">
            <div className="header-bar-left">
              <span className="material-icons header-icon">tune</span>
              <h2>Clinical Sandbox</h2>
            </div>
            <span className="badge-count">8 Parameters</span>
          </div>
          <p className="panel-desc">Adjust values to simulate patient blood panel metrics</p>

          <div className="sliders-container">
            {/* Hemoglobin */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">bloodtype</span>
                  <span className="param-label">Hemoglobin</span>
                </div>
                <span className="param-value">{parameters.hemoglobin.toFixed(1)} <span className="param-unit">g/dL</span></span>
              </div>
              <input 
                type="range" 
                min="5.0" 
                max="20.0" 
                step="0.1"
                value={parameters.hemoglobin}
                onChange={(e) => setParameters(prev => ({ ...prev, hemoglobin: parseFloat(e.target.value) }))}
                className="copilot-slider slider-red"
              />
              <div className="slider-bounds">
                <span>5.0</span>
                <span className="normal-range">12.0 - 16.0</span>
                <span>20.0</span>
              </div>
            </div>

            {/* WBC */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">coronavirus</span>
                  <span className="param-label">WBC Count</span>
                </div>
                <span className="param-value">{parameters.wbc.toLocaleString()} <span className="param-unit">/μL</span></span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="30000" 
                step="100"
                value={parameters.wbc}
                onChange={(e) => setParameters(prev => ({ ...prev, wbc: parseInt(e.target.value) }))}
                className="copilot-slider slider-blue"
              />
              <div className="slider-bounds">
                <span>1k</span>
                <span className="normal-range">4k - 11k</span>
                <span>30k</span>
              </div>
            </div>

            {/* Platelets */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">healing</span>
                  <span className="param-label">Platelet Count</span>
                </div>
                <span className="param-value">{parameters.platelets.toLocaleString()} <span className="param-unit">/μL</span></span>
              </div>
              <input 
                type="range" 
                min="20000" 
                max="600000" 
                step="5000"
                value={parameters.platelets}
                onChange={(e) => setParameters(prev => ({ ...prev, platelets: parseInt(e.target.value) }))}
                className="copilot-slider slider-purple"
              />
              <div className="slider-bounds">
                <span>20k</span>
                <span className="normal-range">150k - 450k</span>
                <span>600k</span>
              </div>
            </div>

            {/* Glucose */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">water_drop</span>
                  <span className="param-label">Glucose (Fasting)</span>
                </div>
                <span className="param-value">{parameters.glucose} <span className="param-unit">mg/dL</span></span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="300" 
                step="1"
                value={parameters.glucose}
                onChange={(e) => setParameters(prev => ({ ...prev, glucose: parseInt(e.target.value) }))}
                className="copilot-slider slider-cyan"
              />
              <div className="slider-bounds">
                <span>30</span>
                <span className="normal-range">70 - 100</span>
                <span>300</span>
              </div>
            </div>

            {/* Cholesterol */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">nutrition</span>
                  <span className="param-label">Total Cholesterol</span>
                </div>
                <span className="param-value">{parameters.cholesterol} <span className="param-unit">mg/dL</span></span>
              </div>
              <input 
                type="range" 
                min="80" 
                max="400" 
                step="5"
                value={parameters.cholesterol}
                onChange={(e) => setParameters(prev => ({ ...prev, cholesterol: parseInt(e.target.value) }))}
                className="copilot-slider slider-orange"
              />
              <div className="slider-bounds">
                <span>80</span>
                <span className="normal-range">120 - 200</span>
                <span>400</span>
              </div>
            </div>

            {/* Creatinine */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">kidney</span>
                  <span className="param-label">Creatinine</span>
                </div>
                <span className="param-value">{parameters.creatinine.toFixed(1)} <span className="param-unit">mg/dL</span></span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="6.0" 
                step="0.1"
                value={parameters.creatinine}
                onChange={(e) => setParameters(prev => ({ ...prev, creatinine: parseFloat(e.target.value) }))}
                className="copilot-slider slider-yellow"
              />
              <div className="slider-bounds">
                <span>0.2</span>
                <span className="normal-range">0.6 - 1.2</span>
                <span>6.0</span>
              </div>
            </div>

            {/* Bilirubin */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">person</span>
                  <span className="param-label">Bilirubin</span>
                </div>
                <span className="param-value">{parameters.bilirubin.toFixed(1)} <span className="param-unit">mg/dL</span></span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="10.0" 
                step="0.1"
                value={parameters.bilirubin}
                onChange={(e) => setParameters(prev => ({ ...prev, bilirubin: parseFloat(e.target.value) }))}
                className="copilot-slider slider-green"
              />
              <div className="slider-bounds">
                <span>0.1</span>
                <span className="normal-range">0.2 - 1.2</span>
                <span>10.0</span>
              </div>
            </div>

            {/* TSH */}
            <div className="slider-group">
              <div className="slider-labels">
                <div className="param-header">
                  <span className="material-icons param-icon">monitor_heart</span>
                  <span className="param-label">TSH (Thyroid)</span>
                </div>
                <span className="param-value">{parameters.tsh.toFixed(1)} <span className="param-unit">uIU/mL</span></span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="15.0" 
                step="0.05"
                value={parameters.tsh}
                onChange={(e) => setParameters(prev => ({ ...prev, tsh: parseFloat(e.target.value) }))}
                className="copilot-slider slider-pink"
              />
              <div className="slider-bounds">
                <span>0.05</span>
                <span className="normal-range">0.4 - 4.0</span>
                <span>15.0</span>
              </div>
            </div>

          </div>
        </section>

        {/* PANEL 2: Central Dashboard (Rings + Simulation) */}
        <section className="copilot-card panel-center">
          
          {/* Apple watch health rings */}
          <div className="apple-rings-section glass-card">
            <div className="card-header-bar">
              <span className="material-icons header-icon">health_and_safety</span>
              <h2>Biometric Vectors</h2>
            </div>
            
            <div className="rings-layout-grid">
              <HealthRing
                color="#ff2d55"
                percentage={getProgressPercentage('hemoglobin', parameters.hemoglobin)}
                label="O2 Transfer"
                icon="oxygen"
              />
              <HealthRing
                color="#007aff"
                percentage={getProgressPercentage('wbc', parameters.wbc)}
                label="Immune Index"
                icon="security"
              />
              <HealthRing
                color="#af52de"
                percentage={getProgressPercentage('platelets', parameters.platelets)}
                label="Clotting Rate"
                icon="bloodtype"
              />
              <HealthRing
                color="#30d158"
                percentage={getProgressPercentage('glucose', parameters.glucose)}
                label="Glycemic Index"
                icon="bolt"
              />
            </div>
          </div>
          
          {/* SVG Cellular stream simulation */}
          <div className="simulation-frame-card glass-card">
            <div className="card-header-bar">
              <span className="material-icons header-icon">biotech</span>
              <h2>Microscopic Simulation</h2>
            </div>
            
            <div className="simulation-frame">
              <svg className="blood-stream-svg" viewBox="0 0 400 240">
                <defs>
                  <radialGradient id="rbc-grad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ff4d4d" />
                    <stop offset="70%" stopColor="#d91e1e" />
                    <stop offset="100%" stopColor="#800a0a" />
                  </radialGradient>
                  <radialGradient id="wbc-grad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#eef4fc" />
                    <stop offset="100%" stopColor="#a3c4f3" />
                  </radialGradient>
                  <radialGradient id="platelet-grad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#e0b3ff" />
                    <stop offset="70%" stopColor="#9b5de5" />
                    <stop offset="100%" stopColor="#560bad" />
                  </radialGradient>
                  <linearGradient id="plasma-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0e0e10" />
                    <stop offset="100%" stopColor="#040404" />
                  </linearGradient>
                </defs>

                {/* Plasma Background */}
                <rect width="400" height="240" rx="14" fill="url(#plasma-grad)" />

                {/* Red Blood Cells */}
                {[...Array(12)].map((_, i) => (
                  <motion.ellipse
                    key={`rbc-${i}`}
                    cx={-50}
                    cy={60 + (i % 4) * 40}
                    rx="16"
                    ry="10"
                    fill="url(#rbc-grad)"
                    className="blood-cell rbc"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      cx: 450,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{ 
                      duration: 6 + i * 0.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.6,
                    }}
                  />
                ))}

                {/* White Blood Cells */}
                {[...Array(5)].map((_, i) => (
                  <motion.circle
                    key={`wbc-${i}`}
                    cx={-30}
                    cy={80 + (i % 3) * 50}
                    r="10"
                    fill="url(#wbc-grad)"
                    className="blood-cell wbc"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      cx: 430,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{ 
                      duration: 9 + i * 0.8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 1.2,
                    }}
                  />
                ))}

                {/* Platelets */}
                {[...Array(18)].map((_, i) => (
                  <motion.circle
                    key={`plt-${i}`}
                    cx={-20}
                    cy={50 + (i % 5) * 35}
                    r="5"
                    fill="url(#platelet-grad)"
                    className="blood-cell platelet"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      cx: 420,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{ 
                      duration: 5 + i * 0.4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3,
                    }}
                  />
                ))}

                {/* Sugar dots representing glucose */}
                {[...Array(Math.min(40, Math.floor(parameters.glucose / 6)))].map((_, i) => (
                  <circle
                    key={`glu-${i}`}
                    cx={((i * 47) % 360) + 20}
                    cy={((i * 31) % 200) + 20}
                    r="1.8"
                    fill="#30d158"
                    opacity="0.75"
                    className="plasma-particle"
                    style={{
                      animationDuration: `${2.5 + (i % 3)}s`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}

                {/* Cholesterol yellow lipid droplets */}
                {[...Array(Math.min(25, Math.floor(parameters.cholesterol / 16)))].map((_, i) => (
                  <circle
                    key={`chol-${i}`}
                    cx={((i * 61) % 350) + 25}
                    cy={((i * 41) % 190) + 25}
                    r="3.2"
                    fill="#ff9500"
                    opacity="0.8"
                    className="plasma-particle"
                    style={{
                      animationDuration: `${4 + (i % 4)}s`,
                      animationDelay: `${i * 0.12}s`
                    }}
                  />
                ))}

                {/* Bilirubin particles */}
                {parameters.bilirubin > 1.2 && [...Array(Math.min(20, Math.floor(parameters.bilirubin * 3)))].map((_, i) => (
                  <circle
                    key={`bili-${i}`}
                    cx={((i * 73) % 340) + 30}
                    cy={((i * 29) % 180) + 30}
                    r="2.2"
                    fill="#fbbf24"
                    opacity="0.85"
                    className="plasma-particle"
                    style={{
                      animationDuration: `${3 + (i % 2)}s`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </svg>
            </div>

            {/* Simulation Stats */}
            <div className="flow-specs">
              <div className="spec-pill">
                <span className="spec-label">Hematocrit</span>
                <span className="spec-value">{Math.round((parameters.hemoglobin / 3) * 10)}%</span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">O2 Sat</span>
                <span className="spec-value">{Math.min(100, Math.max(80, Math.round(parameters.hemoglobin * 6.5)))}%</span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">Flow Rate</span>
                <span className="spec-value">{Math.round(parameters.platelets / 50000)}.0x</span>
              </div>
            </div>
          </div>

        </section>

        {/* PANEL 3: AI Console */}
        <section className="copilot-card glass-card panel-ai-console">
          <div className="card-header-bar">
            <span className="material-icons header-icon">assistant</span>
            <h2>AI Diagnostic Console</h2>
          </div>

          {/* Thinking Timeline */}
          <div className="thinking-timeline">
            {thinkingSteps.map((step) => (
              <div key={step.id} className={`timeline-step ${step.status}`}>
                <div className="step-marker">
                  {step.status === 'completed' ? (
                    <span className="material-icons done">check_circle</span>
                  ) : step.status === 'active' ? (
                    <div className="pulse-dot active-blue"></div>
                  ) : (
                    <div className="marker-dot"></div>
                  )}
                </div>
                <span>{step.text}</span>
              </div>
            ))}
          </div>

          {/* Main Diagnosis Card */}
          <div className="diagnosis-box glass-card">
            <div className="diag-overall">
              <div className="diag-kpi">
                <span className="kpi-label">Overall Risk</span>
                <span className="kpi-val" style={{ color: getRiskColor(diagnosis.riskLevel) }}>
                  {diagnosis.riskLevel}
                </span>
              </div>
              <div className="diag-kpi">
                <span className="kpi-label">Urgency</span>
                <span className="kpi-val urgency-tag" style={{ 
                  background: `${getRiskColor(diagnosis.riskLevel)}20`,
                  color: getRiskColor(diagnosis.riskLevel),
                  borderColor: `${getRiskColor(diagnosis.riskLevel)}40`
                }}>
                  {diagnosis.urgency}
                </span>
              </div>
              <div className="diag-kpi">
                <span className="kpi-label">Confidence</span>
                <span className="kpi-val">{diagnosis.confidence}%</span>
              </div>
            </div>

            <p className="diag-summary">{diagnosis.summary}</p>

            {/* Findings List */}
            <div className="diag-findings">
              <h4>Key Findings</h4>
              <div className="findings-grid">
                {diagnosis.findings.map((finding, idx) => (
                  <div key={idx} className="finding-pill">
                    <div className="finding-header">
                      <strong>{finding.parameter}</strong>
                      <span className={`finding-status ${finding.status.toLowerCase()}`}>
                        {finding.status}
                      </span>
                    </div>
                    <p className="finding-note">{finding.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations List */}
            <div className="diag-recommendations">
              <h4>Recommendations</h4>
              <ul>
                {diagnosis.recommendations.map((rec, idx) => (
                  <li key={idx}>
                    <span className="material-icons">arrow_forward_ios</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="apple-tab-bar">
            <button 
              className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
              onClick={() => setActiveTab('risk')}
            >
              Risk Stratification
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              Test Recommendations
            </button>
            <button 
              className={`tab-btn ${activeTab === 'dictation' ? 'active' : ''}`}
              onClick={() => setActiveTab('dictation')}
            >
              Clinical Notes
            </button>
          </div>

          <div className="tab-content-container">
            <AnimatePresence mode="wait">
              {activeTab === 'risk' && (
                <motion.div 
                  key="risk"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="tab-pane-content"
                >
                  <h4>Systemic Risk Assessment</h4>
                  <div className="system-risks-grid">
                    <div className="system-risk-item">
                      <span>Cardiovascular</span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar fill-red" style={{ width: `${systemRisks.cardiovascular}%` }}></div>
                      </div>
                      <span className="risk-percent-label">{systemRisks.cardiovascular}%</span>
                    </div>
                    <div className="system-risk-item">
                      <span>Metabolic</span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar fill-orange" style={{ width: `${systemRisks.diabetic}%` }}></div>
                      </div>
                      <span className="risk-percent-label">{systemRisks.diabetic}%</span>
                    </div>
                    <div className="system-risk-item">
                      <span>Renal</span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar fill-blue" style={{ width: `${systemRisks.renal}%` }}></div>
                      </div>
                      <span className="risk-percent-label">{systemRisks.renal}%</span>
                    </div>
                    <div className="system-risk-item">
                      <span>Hepatic</span>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar fill-yellow" style={{ width: `${systemRisks.hepatic}%` }}></div>
                      </div>
                      <span className="risk-percent-label">{systemRisks.hepatic}%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tests' && (
                <motion.div 
                  key="tests"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="tab-pane-content"
                >
                  <h4>Suggested Follow-up Tests</h4>
                  <div className="test-recommendations-list">
                    {testRecommendations.map((rec, idx) => (
                      <div key={idx} className="test-rec-item glass-card">
                        <span className="material-icons test-rec-icon">science</span>
                        <div className="test-rec-text">
                          <h5>{rec.test}</h5>
                          <p>{rec.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'dictation' && (
                <motion.div 
                  key="dictation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="tab-pane-content notes-dictator-pane"
                >
                  <h4>Clinical Note Dictation</h4>
                  <p className="pane-desc">Paste or type raw notes to format them clinically</p>
                  <textarea
                    className="dictation-textarea"
                    placeholder="Enter patient notes here..."
                    value={rawNotes}
                    onChange={(e) => setRawNotes(e.target.value)}
                  />
                  <button 
                    className="format-notes-btn pill-btn"
                    onClick={handleFormatNotes}
                    disabled={isFormattingNotes}
                  >
                    {isFormattingNotes ? (
                      <><span className="btn-spinner"></span>Formatting...</>
                    ) : (
                      'Format Clinical Note'
                    )}
                  </button>

                  {formattedNotes && (
                    <div className="formatted-notes-output glass-card">
                      <button className="copy-notes-btn" onClick={() => {
                        navigator.clipboard.writeText(formattedNotes);
                        toast.success('Note copied to clipboard!');
                      }}>
                        <span className="material-icons">content_copy</span>
                      </button>
                      <pre>{formattedNotes}</pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Console */}
          <div className="chat-section">
            <div className="card-header-bar">
              <div className="chat-header-wrap">
                <span className="material-icons header-icon">chat</span>
                <h2>Clinical Assistant</h2>
              </div>
              <button 
                className={`voice-toggle-btn ${voiceEnabled ? 'active' : ''}`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? "Disable Voice" : "Enable Voice"}
              >
                <span className="material-icons">{voiceEnabled ? 'volume_up' : 'volume_off'}</span>
              </button>
            </div>
            
            <div className="chat-messages-container apple-chat">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-wrap ${msg.role}`}>
                  <div className="chat-bubble">
                    <p>{msg.content}</p>
                    {msg.role === 'assistant' && voiceEnabled && (
                      <button className="bubble-speak-btn" onClick={() => speakText(msg.content)}>
                        <span className="material-icons">volume_up</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isChatTyping && (
                <div className="chat-bubble-wrap assistant">
                  <div className="chat-bubble typing-bubble">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="quick-prompts">
              <span className="prompt-chip" onClick={() => setChatInput('What is the normal hemoglobin range?')}>Normal hemoglobin?</span>
              <span className="prompt-chip" onClick={() => setChatInput('Interpret high WBC count')}>High WBC?</span>
              <span className="prompt-chip" onClick={() => setChatInput('Explain platelet function')}>Platelet function?</span>
            </div>

            <form onSubmit={handleChatSubmit} className="chat-input-form">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ask a clinical question..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" disabled={!chatInput.trim()}>
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>

        </section>

      </main>
    </div>
  );
};

export default AIAnalysisDashboard;
