import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@lab.com',
    role: 'Lab Technician',
    department: 'Hematology',
    employeeId: 'EMP001',
    phoneNumber: '+1 (555) 123-4567',
    profileImage: null
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    timezone: 'IST (UTC+5:30)'
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log('Profile updated:', userData);
    alert('Profile updated successfully!');
  };

  const handlePreferencesUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log('Preferences updated:', preferences);
    alert('Preferences updated successfully!');
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    
    if (security.newPassword !== security.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (security.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // In a real app, this would send data to the backend
    console.log('Password updated');
    alert('Password updated successfully!');
    
    // Reset form
    setSecurity({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, this would upload the file to the server
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData({ ...userData, profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="user-profile"
    >
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        {/* Profile Sidebar */}
        <div className="profile-sidebar glass-card">
          <div className="profile-image-section">
            <div className="profile-image">
              {userData.profileImage ? (
                <img src={userData.profileImage} alt="Profile" />
              ) : (
                <div className="placeholder">👤</div>
              )}
            </div>
            <label htmlFor="image-upload" className="upload-button">
              Change Photo
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="user-info">
            <h2>{userData.firstName} {userData.lastName}</h2>
            <p className="user-role">{userData.role}</p>
            <p className="user-department">{userData.department}</p>
          </div>
          
          <div className="profile-tabs">
            <button 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button 
              className={activeTab === 'preferences' ? 'active' : ''}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
            <button 
              className={activeTab === 'security' ? 'active' : ''}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button 
              className={activeTab === 'activity' ? 'active' : ''}
              onClick={() => setActiveTab('activity')}
            >
              Activity Log
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-main glass-card">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="employeeId">Employee ID</label>
                    <input
                      type="text"
                      id="employeeId"
                      value={userData.employeeId}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      id="role"
                      value={userData.role}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    value={userData.department}
                    onChange={(e) => setUserData({...userData, department: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                  />
                </div>
                
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <h2>Preferences</h2>
              <form onSubmit={handlePreferencesUpdate}>
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={preferences.theme}
                    onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                  >
                    <option>UTC</option>
                    <option>IST (UTC+5:30)</option>
                    <option>EST (UTC-5:00)</option>
                    <option>PST (UTC-8:00)</option>
                  </select>
                </div>
                
                <div className="notification-settings">
                  <h3>Notification Preferences</h3>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.email}
                        onChange={(e) => setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, email: e.target.checked}
                        })}
                      />
                      Email Notifications
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.sms}
                        onChange={(e) => setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, sms: e.target.checked}
                        })}
                      />
                      SMS Notifications
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.push}
                        onChange={(e) => setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, push: e.target.checked}
                        })}
                      />
                      Push Notifications
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="save-btn">Save Preferences</button>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="security-tab">
              <h2>Security Settings</h2>
              <form onSubmit={handleSecurityUpdate}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                
                <div className="password-requirements">
                  <h3>Password Requirements</h3>
                  <ul>
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
                
                <button type="submit" className="save-btn">Update Password</button>
              </form>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="activity-tab">
              <h2>Activity Log</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🔒</div>
                  <div className="activity-details">
                    <h3>Login</h3>
                    <p>Successful login from IP 192.168.1.101</p>
                    <span className="activity-time">Today, 10:30 AM</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-details">
                    <h3>Profile Updated</h3>
                    <p>Changed phone number and department</p>
                    <span className="activity-time">Yesterday, 3:45 PM</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">⚙️</div>
                  <div className="activity-details">
                    <h3>Preferences Changed</h3>
                    <p>Updated notification settings</p>
                    <span className="activity-time">Sep 14, 2023, 11:20 AM</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🔒</div>
                  <div className="activity-details">
                    <h3>Password Changed</h3>
                    <p>Updated account password</p>
                    <span className="activity-time">Sep 12, 2023, 9:15 AM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;