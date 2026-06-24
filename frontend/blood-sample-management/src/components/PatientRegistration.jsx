import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/apiService';
import { toast } from 'react-hot-toast';
import './PatientRegistration.css';

const PatientRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phoneNumber: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalHistory: [],
    allergies: '',
    currentMedications: ''
  });

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [currentCondition, setCurrentCondition] = useState({ condition: '', diagnosisDate: '', notes: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPatientData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPatientData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleMedicalHistoryChange = (index, field, value) => {
    const updatedHistory = [...medicalHistory];
    updatedHistory[index][field] = value;
    setMedicalHistory(updatedHistory);
  };

  const addMedicalHistory = () => {
    if (currentCondition.condition && currentCondition.diagnosisDate) {
      setMedicalHistory([...medicalHistory, currentCondition]);
      setCurrentCondition({ condition: '', diagnosisDate: '', notes: '' });
    }
  };

  const removeMedicalHistory = (index) => {
    const updatedHistory = medicalHistory.filter((_, i) => i !== index);
    setMedicalHistory(updatedHistory);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare data matching backend schema
    const formattedData = {
      ...patientData,
      allergies: patientData.allergies ? patientData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      currentMedications: patientData.currentMedications ? patientData.currentMedications.split(',').map(s => s.trim()).filter(Boolean) : [],
      medicalHistory: medicalHistory.filter(item => item.condition && item.diagnosisDate)
    };

    try {
      const response = await api.post('/patients', formattedData);
      toast.success(`Patient registered successfully! ID: ${response.data.patientId}`);
      
      // Reset form
      setPatientData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        phoneNumber: '',
        email: '',
        address: { street: '', city: '', state: '', zipCode: '', country: '' },
        emergencyContact: { name: '', relationship: '', phone: '' },
        medicalHistory: [],
        allergies: '',
        currentMedications: ''
      });
      setMedicalHistory([]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register patient';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="patient-registration"
    >
      <div className="registration-header">
        <h1>Patient Registration</h1>
        <p>Register a new patient in the system</p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form glass-card">
        <div className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={patientData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={patientData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={patientData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={patientData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={patientData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={patientData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={patientData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Address Information</h2>
          
          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              value={patientData.address.street}
              onChange={handleAddressChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={patientData.address.city}
                onChange={handleAddressChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={patientData.address.state}
                onChange={handleAddressChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={patientData.address.zipCode}
                onChange={handleAddressChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={patientData.address.country}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Emergency Contact</h2>
          
          <div className="form-group">
            <label htmlFor="emergencyName">Full Name</label>
            <input
              type="text"
              id="emergencyName"
              name="name"
              value={patientData.emergencyContact.name}
              onChange={handleEmergencyContactChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="relationship">Relationship</label>
              <input
                type="text"
                id="relationship"
                name="relationship"
                value={patientData.emergencyContact.relationship}
                onChange={handleEmergencyContactChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emergencyPhone">Phone Number</label>
              <input
                type="tel"
                id="emergencyPhone"
                name="phone"
                value={patientData.emergencyContact.phone}
                onChange={handleEmergencyContactChange}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Medical History</h2>
          
          <div className="medical-history-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <input
                  type="text"
                  id="condition"
                  value={currentCondition.condition}
                  onChange={(e) => setCurrentCondition({...currentCondition, condition: e.target.value})}
                  placeholder="e.g., Diabetes"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="diagnosisDate">Diagnosis Date</label>
                <input
                  type="date"
                  id="diagnosisDate"
                  value={currentCondition.diagnosisDate}
                  onChange={(e) => setCurrentCondition({...currentCondition, diagnosisDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={currentCondition.notes}
                onChange={(e) => setCurrentCondition({...currentCondition, notes: e.target.value})}
                placeholder="Additional information about the condition"
              />
            </div>
            
            <button type="button" onClick={addMedicalHistory} className="add-history-btn">
              Add to Medical History
            </button>
          </div>
          
          <div className="medical-history-list">
            {medicalHistory.map((history, index) => (
              <div key={index} className="history-item">
                <div className="history-details">
                  <strong>{history.condition}</strong> - Diagnosed on {history.diagnosisDate}
                  {history.notes && <p>{history.notes}</p>}
                </div>
                <button 
                  type="button" 
                  onClick={() => removeMedicalHistory(index)}
                  className="remove-history-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Additional Information</h2>
          
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <textarea
              id="allergies"
              name="allergies"
              value={patientData.allergies}
              onChange={handleChange}
              placeholder="List any known allergies (comma separated)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="medications">Current Medications</label>
            <textarea
              id="medications"
              name="currentMedications"
              value={patientData.currentMedications}
              onChange={handleChange}
              placeholder="List current medications (comma separated)"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" disabled={isSubmitting}>Cancel</button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PatientRegistration;