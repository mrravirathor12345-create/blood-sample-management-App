import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientRegistration from './components/PatientRegistration';
import SampleCollection from './components/SampleCollection';
import SampleTracking from './components/SampleTracking';
import TestAssignment from './components/TestAssignment';
import TestResultsEntry from './components/TestResultsEntry';
import DoctorReview from './components/DoctorReview';
import ReportGeneration from './components/ReportGeneration';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AIAnalysisDashboard from './components/AIAnalysisDashboard';
import AdminControlCenter from './components/AdminControlCenter';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients/register" element={<PatientRegistration />} />
              <Route path="/samples/collection" element={<SampleCollection />} />
              <Route path="/samples/tracking" element={<SampleTracking />} />
              <Route path="/tests/assignment" element={<TestAssignment />} />
              <Route path="/tests/results" element={<TestResultsEntry />} />
              <Route path="/doctors/review" element={<DoctorReview />} />
              <Route path="/reports/generation" element={<ReportGeneration />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/ai-analytics" element={<AIAnalysisDashboard />} />
              <Route path="/admin" element={<AdminControlCenter />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;