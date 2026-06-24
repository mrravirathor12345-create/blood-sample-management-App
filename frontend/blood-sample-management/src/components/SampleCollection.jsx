import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import api from '../services/apiService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './SampleCollection.css';

const SampleCollection = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sampleData, setSampleData] = useState({
    patientId: '',
    collectorId: '',
    collectionPoint: '',
    sampleType: '',
    volume: '',
    containerType: '',
    priority: 'Routine',
    notes: ''
  });

  const [generatedSampleId, setGeneratedSampleId] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setSampleData(prev => ({
        ...prev,
        collectorId: user.id
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSampleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sampleData.patientId || !sampleData.collectorId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Fetch patients to find matching patient ID (e.g. PAT000001)
      const patientsResponse = await api.get('/patients');
      const patients = patientsResponse.data;
      
      const matchedPatient = patients.find(
        p => p.patientId.toLowerCase() === sampleData.patientId.trim().toLowerCase() ||
             p._id === sampleData.patientId.trim()
      );

      if (!matchedPatient) {
        toast.error(`Patient with ID "${sampleData.patientId}" not found. Please register patient first.`);
        setIsSubmitting(false);
        return;
      }

      // 2. Submit sample collection data
      const payload = {
        patient: matchedPatient._id,
        collector: sampleData.collectorId,
        collectionPoint: sampleData.collectionPoint,
        sampleType: sampleData.sampleType,
        volume: Number(sampleData.volume),
        containerType: sampleData.containerType,
        priority: sampleData.priority,
        notes: sampleData.notes
      };

      const response = await api.post('/samples', payload);
      setGeneratedSampleId(response.data.sampleId);
      setShowQRCode(true);
      toast.success('Sample collection registered successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error creating sample';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSampleData({
      patientId: '',
      collectorId: user?.id || '',
      collectionPoint: '',
      sampleType: '',
      volume: '',
      containerType: '',
      priority: 'Routine',
      notes: ''
    });
    setGeneratedSampleId('');
    setShowQRCode(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sample-collection"
    >
      <div className="collection-header">
        <h1>Blood Sample Collection</h1>
        <p>Collect and register a new blood sample</p>
      </div>

      <div className="collection-content">
        <form onSubmit={handleSubmit} className="collection-form glass-card">
          <div className="form-section">
            <h2>Sample Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientId">Patient ID *</label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={sampleData.patientId}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="collectorId">Collector ID *</label>
                <input
                  type="text"
                  id="collectorId"
                  name="collectorId"
                  value={sampleData.collectorId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="collectionPoint">Collection Point</label>
              <input
                type="text"
                id="collectionPoint"
                name="collectionPoint"
                value={sampleData.collectionPoint}
                onChange={handleChange}
                placeholder="e.g., Lab Room 3, Outpatient Department"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sampleType">Sample Type *</label>
                <select
                  id="sampleType"
                  name="sampleType"
                  value={sampleData.sampleType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Sample Type</option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Plasma">Plasma</option>
                  <option value="Serum">Serum</option>
                  <option value="Buffy Coat">Buffy Coat</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="volume">Volume (mL) *</label>
                <input
                  type="number"
                  id="volume"
                  name="volume"
                  value={sampleData.volume}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="containerType">Container Type</label>
              <input
                type="text"
                id="containerType"
                name="containerType"
                value={sampleData.containerType}
                onChange={handleChange}
                placeholder="e.g., EDTA Tube, Serum Separator Tube"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={sampleData.priority}
                onChange={handleChange}
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Stat">Stat</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={sampleData.notes}
                onChange={handleChange}
                placeholder="Any special instructions or observations"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn" disabled={isSubmitting}>Reset</button>
            <button type="submit" className="collect-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Collect Sample'}
            </button>
          </div>
        </form>
        
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="qr-section glass-card"
          >
            <h2>Sample Registered Successfully</h2>
            <p>Sample ID: <strong>{generatedSampleId}</strong></p>
            
            <div className="qr-container">
              <QRCode 
                value={`${generatedSampleId}|${sampleData.patientId}|${new Date().toISOString()}`} 
                size={200} 
                level="H"
              />
            </div>
            
            <p className="qr-instructions">
              Scan this QR code to track the sample throughout the process
            </p>
            
            <div className="print-actions">
              <button className="print-btn">Print Label</button>
              <button className="download-btn">Download QR</button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SampleCollection;