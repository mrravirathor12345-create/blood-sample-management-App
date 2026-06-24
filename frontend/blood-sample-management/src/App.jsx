import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import ToastProvider from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ParticleBackground from './components/ParticleBackground';
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
import BarcodeScanner from './components/BarcodeScanner';
import AppointmentScheduler from './components/AppointmentScheduler';
import InventoryTracker from './components/InventoryTracker';
import './App.css';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="app">
      <ParticleBackground />
      {isAuthenticated && <Navbar />}
      <div className="main-content">
        {isAuthenticated && <Sidebar />}
        <div className={isAuthenticated ? 'content content-authenticated' : 'content'}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Core */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Patients */}
              <Route path="/patients/register" element={<ProtectedRoute><PatientRegistration /></ProtectedRoute>} />

              {/* Samples */}
              <Route path="/samples/collection" element={<ProtectedRoute><SampleCollection /></ProtectedRoute>} />
              <Route path="/samples/tracking"   element={<ProtectedRoute><SampleTracking /></ProtectedRoute>} />
              <Route path="/samples/scanner"    element={<ProtectedRoute><BarcodeScanner /></ProtectedRoute>} />

              {/* Tests */}
              <Route path="/tests/assignment" element={<ProtectedRoute><TestAssignment /></ProtectedRoute>} />
              <Route path="/tests/results"    element={<ProtectedRoute><TestResultsEntry /></ProtectedRoute>} />

              {/* Doctors & Reports */}
              <Route path="/doctors/review"     element={<ProtectedRoute><DoctorReview /></ProtectedRoute>} />
              <Route path="/reports/generation" element={<ProtectedRoute><ReportGeneration /></ProtectedRoute>} />

              {/* Analytics */}
              <Route path="/analytics"    element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/ai-analytics" element={<ProtectedRoute><AIAnalysisDashboard /></ProtectedRoute>} />

              {/* New Features */}
              <Route path="/appointments" element={<ProtectedRoute><AppointmentScheduler /></ProtectedRoute>} />
              <Route path="/inventory"    element={<ProtectedRoute><InventoryTracker /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin"   element={<ProtectedRoute><AdminControlCenter /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
