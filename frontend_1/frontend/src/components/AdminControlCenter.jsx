import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AdminControlCenter.css';

const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for users
  const mockUsers = [
    { id: 'USR001', name: 'Dr. Alice Johnson', email: 'alice@lab.com', role: 'Doctor', status: 'Active', lastLogin: '2023-09-15' },
    { id: 'USR002', name: 'Bob Smith', email: 'bob@lab.com', role: 'Lab Technician', status: 'Active', lastLogin: '2023-09-16' },
    { id: 'USR003', name: 'Carol Williams', email: 'carol@lab.com', role: 'Lab Technician', status: 'Active', lastLogin: '2023-09-14' },
    { id: 'USR004', name: 'David Brown', email: 'david@lab.com', role: 'Admin', status: 'Active', lastLogin: '2023-09-16' },
    { id: 'USR005', name: 'Eva Davis', email: 'eva@lab.com', role: 'Nurse', status: 'Inactive', lastLogin: '2023-09-10' }
  ];

  // Mock data for system logs
  const mockLogs = [
    { id: 1, timestamp: '2023-09-16 14:30:22', user: 'Dr. Alice Johnson', action: 'Generated Report RPT00000001', ip: '192.168.1.101' },
    { id: 2, timestamp: '2023-09-16 13:45:17', user: 'Bob Smith', action: 'Entered test results for SMP00000125', ip: '192.168.1.102' },
    { id: 3, timestamp: '2023-09-16 12:20:45', user: 'Carol Williams', action: 'Assigned tests to sample SMP00000124', ip: '192.168.1.103' },
    { id: 4, timestamp: '2023-09-16 11:15:33', user: 'David Brown', action: 'Created new test: Vitamin B12', ip: '192.168.1.104' },
    { id: 5, timestamp: '2023-09-16 10:05:12', user: 'System', action: 'Backup completed successfully', ip: '192.168.1.1' }
  ];

  // Mock data for system stats
  const systemStats = {
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
    activeUsers: 12,
    pendingReports: 3,
    systemStatus: 'Operational'
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    // In a real app, this would open a modal or form to add a new user
    alert('Add User functionality would open here');
  };

  const handleEditUser = (userId) => {
    // In a real app, this would open a modal or form to edit the user
    alert(`Edit User ${userId} functionality would open here`);
  };

  const handleDeactivateUser = (userId) => {
    // In a real app, this would deactivate the user
    alert(`User ${userId} deactivated successfully`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="admin-control-center"
    >
      <div className="control-header">
        <h1>Admin Control Center</h1>
        <p>Manage system settings, users, and monitor activity</p>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'system' ? 'active' : ''}
          onClick={() => setActiveTab('system')}
        >
          System Monitoring
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''}
          onClick={() => setActiveTab('logs')}
        >
          Activity Logs
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          System Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h2>User Management</h2>
              <button onClick={handleAddUser} className="add-user-btn">
                Add New User
              </button>
            </div>
            
            <div className="search-box">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name, email, or role"
                className="search-input"
              />
            </div>
            
            <div className="users-table glass-card">
              <div className="table-header">
                <div className="header-cell">User ID</div>
                <div className="header-cell">Name</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Role</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Last Login</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {filteredUsers.map(user => (
                <div key={user.id} className="table-row">
                  <div className="cell">{user.id}</div>
                  <div className="cell">{user.name}</div>
                  <div className="cell">{user.email}</div>
                  <div className="cell">
                    <span className="role-badge">{user.role}</span>
                  </div>
                  <div className="cell">
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="cell">{user.lastLogin}</div>
                  <div className="cell actions">
                    <button 
                      onClick={() => handleEditUser(user.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeactivateUser(user.id)}
                      className="deactivate-btn"
                      disabled={user.status === 'Inactive'}
                    >
                      {user.status === 'Inactive' ? 'Deactivated' : 'Deactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="system-tab">
            <h2>System Monitoring</h2>
            
            <div className="system-stats">
              <div className="stat-card glass-card">
                <h3>System Status</h3>
                <div className="status-indicator operational">Operational</div>
              </div>
              
              <div className="stat-card glass-card">
                <h3>CPU Usage</h3>
                <div className="usage-bar">
                  <div 
                    className="usage-fill" 
                    style={{ width: `${systemStats.cpuUsage}%`, backgroundColor: '#4ECDC4' }}
                  ></div>
                </div>
                <div className="usage-percent">{systemStats.cpuUsage}%</div>
              </div>
              
              <div className="stat-card glass-card">
                <h3>Memory Usage</h3>
                <div className="usage-bar">
                  <div 
                    className="usage-fill" 
                    style={{ width: `${systemStats.memoryUsage}%`, backgroundColor: '#FF6B6B' }}
                  ></div>
                </div>
                <div className="usage-percent">{systemStats.memoryUsage}%</div>
              </div>
              
              <div className="stat-card glass-card">
                <h3>Disk Usage</h3>
                <div className="usage-bar">
                  <div 
                    className="usage-fill" 
                    style={{ width: `${systemStats.diskUsage}%`, backgroundColor: '#45B7D1' }}
                  ></div>
                </div>
                <div className="usage-percent">{systemStats.diskUsage}%</div>
              </div>
              
              <div className="stat-card glass-card">
                <h3>Active Users</h3>
                <div className="active-users-count">{systemStats.activeUsers}</div>
              </div>
              
              <div className="stat-card glass-card">
                <h3>Pending Reports</h3>
                <div className="pending-reports-count">{systemStats.pendingReports}</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div className="logs-tab">
            <h2>Activity Logs</h2>
            
            <div className="logs-table glass-card">
              <div className="table-header">
                <div className="header-cell">Timestamp</div>
                <div className="header-cell">User</div>
                <div className="header-cell">Action</div>
                <div className="header-cell">IP Address</div>
              </div>
              
              {mockLogs.map(log => (
                <div key={log.id} className="table-row">
                  <div className="cell">{log.timestamp}</div>
                  <div className="cell">{log.user}</div>
                  <div className="cell">{log.action}</div>
                  <div className="cell">{log.ip}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>System Settings</h2>
            
            <div className="settings-form glass-card">
              <div className="setting-group">
                <h3>General Settings</h3>
                
                <div className="form-group">
                  <label htmlFor="systemName">System Name</label>
                  <input
                    type="text"
                    id="systemName"
                    defaultValue="Blood Sample Management System"
                    className="setting-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select id="timezone" className="setting-input">
                    <option>UTC</option>
                    <option>IST (UTC+5:30)</option>
                    <option>EST (UTC-5:00)</option>
                    <option>PST (UTC-8:00)</option>
                  </select>
                </div>
              </div>
              
              <div className="setting-group">
                <h3>Email Configuration</h3>
                
                <div className="form-group">
                  <label htmlFor="smtpHost">SMTP Host</label>
                  <input
                    type="text"
                    id="smtpHost"
                    defaultValue="smtp.example.com"
                    className="setting-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="smtpPort">SMTP Port</label>
                  <input
                    type="number"
                    id="smtpPort"
                    defaultValue="587"
                    className="setting-input"
                  />
                </div>
              </div>
              
              <div className="setting-group">
                <h3>Security Settings</h3>
                
                <div className="form-group">
                  <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    defaultValue="30"
                    className="setting-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked /> Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button className="cancel-btn">Cancel</button>
                <button className="save-btn">Save Settings</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminControlCenter;