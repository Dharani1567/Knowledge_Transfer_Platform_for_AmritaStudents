import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Users, CheckCircle, XCircle, Trash2, 
  AlertTriangle, FileText, Code, Briefcase, Search, UserCheck
} from 'lucide-react';

const Admin = () => {
  const { user, token, API_BASE } = useAuth();
  
  const [activeTab, setActiveTab] = useState('uploads');
  const [usersList, setUsersList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [experiencesList, setExperiencesList] = useState([]);
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Role Gate check
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Load Admin Data
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const res = await fetch(`${API_BASE}/admin/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResourcesList(data);
      }
    } catch (err) {
      console.error('Fetch resources error:', err);
    } finally {
      setLoadingResources(false);
    }
  };

  const fetchOtherContent = async () => {
    setLoadingContent(true);
    try {
      // Fetch projects
      const resProjects = await fetch(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resProjects.ok) {
        const pData = await resProjects.json();
        setProjectsList(pData);
      }

      // Fetch experiences
      const resExp = await fetch(`${API_BASE}/experiences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resExp.ok) {
        const eData = await resExp.json();
        setExperiencesList(eData);
      }
    } catch (err) {
      console.error('Fetch other content error:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchResources();
    fetchOtherContent();
  }, [activeTab]);

  // Actions
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/resources/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setSuccessMsg(`Resource successfully ${status}!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchResources();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || 'Action failed');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });

      if (res.ok) {
        setSuccessMsg('User role updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban/delete this user? All their credentials will be revoked.')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccessMsg('User successfully deleted/banned.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action is permanent.')) return;
    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccessMsg('Resource deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchResources();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project showcase? This action is permanent.')) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccessMsg('Project deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchOtherContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview journal? This action is permanent.')) return;
    try {
      const res = await fetch(`${API_BASE}/experiences/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccessMsg('Experience log deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchOtherContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations for Stats
  const pendingApprovalsCount = resourcesList.filter(r => r.status === 'pending').length;
  const approvedResourcesCount = resourcesList.filter(r => r.status === 'approved').length;

  return (
    <div className="admin-page animate-fade">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-row">
          <Shield className="admin-title-icon" size={32} />
          <div>
            <h1>Admin Command Center</h1>
            <p className="subtitle">Moderate study uploads, manage user access, and maintain platform integrity</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && <div className="alert alert-success animate-fade">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger animate-fade">{errorMsg}</div>}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-header">
            <Users className="stat-icon blue" size={24} />
            <span className="stat-value">{usersList.length}</span>
          </div>
          <span className="stat-label">Registered Users</span>
        </div>
        <div className="stat-card glass-card warning-card">
          <div className="stat-header">
            <AlertTriangle className="stat-icon gold animate-pulse" size={24} />
            <span className="stat-value">{pendingApprovalsCount}</span>
          </div>
          <span className="stat-label">Pending Approvals</span>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-header">
            <FileText className="stat-icon red" size={24} />
            <span className="stat-value">{approvedResourcesCount}</span>
          </div>
          <span className="stat-label">Approved Resources</span>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-header">
            <Code className="stat-icon green" size={24} />
            <span className="stat-value">{projectsList.length}</span>
          </div>
          <span className="stat-label">Project Showcases</span>
        </div>
      </div>

      {/* Tab Control */}
      <div className="tabs-container">
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploads')}
          >
            <CheckCircle size={16} /> Upload Approvals {pendingApprovalsCount > 0 && <span className="tab-badge">{pendingApprovalsCount}</span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> User Directory
          </button>
          <button 
            className={`tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <Trash2 size={16} /> Content Purge
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="tab-content-panel glass-panel">
        
        {/* Upload Approvals Tab */}
        {activeTab === 'uploads' && (
          <div className="tab-pane">
            <h2 className="tab-pane-title">Moderate Resource Submissions</h2>
            <p className="tab-pane-subtitle">Ensure notes, papers, and assignments meet academic standards before making them public.</p>
            
            {loadingResources ? (
              <div className="loading-state">Loading resource moderation queue...</div>
            ) : resourcesList.filter(r => r.status === 'pending').length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} className="empty-icon-green" />
                <h3>Moderation Queue Clear!</h3>
                <p>All student resource submissions have been processed.</p>
              </div>
            ) : (
              <div className="moderation-list">
                {resourcesList.filter(r => r.status === 'pending').map(res => (
                  <div key={res._id} className="moderation-item glass-card animate-slide">
                    <div className="mod-item-main">
                      <div className="mod-item-header">
                        <span className={`badge ${res.category === 'notes' ? 'badge-red' : res.category === 'exam_paper' ? 'badge-gold' : 'badge-blue'}`}>
                          {res.category.replace('_', ' ')}
                        </span>
                        <span className="mod-course-code">{res.courseCode}</span>
                      </div>
                      <h3 className="mod-item-title">{res.title}</h3>
                      <p className="mod-item-desc">{res.description || 'No description provided.'}</p>
                      
                      <div className="mod-item-meta">
                        <span>Uploaded by: <strong>{res.uploadedBy?.name || 'Anonymous'}</strong> ({res.uploadedBy?.role})</span>
                        <a href={res.fileUrl} target="_blank" rel="noreferrer" className="btn-link">View File Link</a>
                      </div>
                    </div>
                    
                    <div className="mod-item-actions">
                      <button 
                        className="btn btn-success btn-small"
                        onClick={() => handleUpdateStatus(res._id, 'approved')}
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleUpdateStatus(res._id, 'rejected')}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Directory Tab */}
        {activeTab === 'users' && (
          <div className="tab-pane">
            <h2 className="tab-pane-title">Manage User Accounts</h2>
            <p className="tab-pane-subtitle">Promote roles for trusted contributors or delete abusive student accounts.</p>

            {loadingUsers ? (
              <div className="loading-state">Loading user base directory...</div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Dept & Batch</th>
                      <th>System Role</th>
                      <th>Update Access</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u._id} className={u.role === 'admin' ? 'row-admin' : ''}>
                        <td>
                          <div className="user-name-col">
                            {u.role === 'admin' ? <Shield size={14} className="col-admin-icon" /> : null}
                            <strong>{u.name}</strong>
                            {u._id === user._id && <span className="self-badge">(You)</span>}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.department} (Class of {u.batchYear})</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="form-control select-small"
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                            disabled={u._id === user._id} // Prevent demoting yourself
                          >
                            <option value="student">Student</option>
                            <option value="senior">Senior</option>
                            <option value="alumni">Alumni</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-icon-danger"
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u._id === user._id}
                            title="Ban User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Content Purge Tab */}
        {activeTab === 'moderation' && (
          <div className="tab-pane">
            <h2 className="tab-pane-title">Platform Content Purge</h2>
            <p className="tab-pane-subtitle">Directly delete files, placement reviews, or projects flag-marked as inappropriate.</p>
            
            <div className="search-filter-bar" style={{ marginBottom: '2rem' }}>
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="form-control search-field"
                  placeholder="Filter content items by company, title, or course code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingResources || loadingContent ? (
              <div className="loading-state">Loading active platform databases...</div>
            ) : (
              <div className="content-purge-sections">
                
                {/* Resources list */}
                <div className="purge-section">
                  <h3>Academic Resources ({resourcesList.length})</h3>
                  <div className="purge-cards">
                    {resourcesList
                      .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.courseCode.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 10)
                      .map(r => (
                        <div key={r._id} className="purge-card glass-card">
                          <div className="purge-meta">
                            <span className="badge-small">{r.courseCode}</span>
                            <span className={`status-tag ${r.status}`}>{r.status}</span>
                          </div>
                          <h4>{r.title}</h4>
                          <button 
                            className="btn btn-danger btn-small w-full"
                            onClick={() => handleDeleteResource(r._id)}
                          >
                            <Trash2 size={14} /> Delete Resource
                          </button>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Projects list */}
                <div className="purge-section">
                  <h3>Project Showcases ({projectsList.length})</h3>
                  <div className="purge-cards">
                    {projectsList
                      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 10)
                      .map(p => (
                        <div key={p._id} className="purge-card glass-card">
                          <div className="purge-meta">
                            <span className="badge-small">Project</span>
                          </div>
                          <h4>{p.title}</h4>
                          <button 
                            className="btn btn-danger btn-small w-full"
                            onClick={() => handleDeleteProject(p._id)}
                          >
                            <Trash2 size={14} /> Delete Showcase
                          </button>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Experiences list */}
                <div className="purge-section">
                  <h3>Placement Logs ({experiencesList.length})</h3>
                  <div className="purge-cards">
                    {experiencesList
                      .filter(e => e.company.toLowerCase().includes(searchQuery.toLowerCase()) || e.role.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 10)
                      .map(e => (
                        <div key={e._id} className="purge-card glass-card">
                          <div className="purge-meta">
                            <span className="badge-small">{e.company}</span>
                          </div>
                          <h4>{e.role}</h4>
                          <button 
                            className="btn btn-danger btn-small w-full"
                            onClick={() => handleDeleteExperience(e._id)}
                          >
                            <Trash2 size={14} /> Delete Journal
                          </button>
                        </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* Styled system */}
      <style>{`
        .admin-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-header {
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1.5rem;
        }

        .admin-title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-title-icon {
          color: var(--color-amrita-red-light);
        }

        .admin-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
        }

        .admin-header .subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: var(--transition-smooth);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-glass-focused);
        }

        .stat-card.warning-card {
          background: linear-gradient(135deg, rgba(255, 183, 3, 0.08) 0%, rgba(12, 13, 18, 0.5) 100%);
          border-color: rgba(255, 183, 3, 0.2);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 24px;
          height: 24px;
        }

        .stat-icon.blue { color: var(--color-info); }
        .stat-icon.gold { color: var(--color-gold); }
        .stat-icon.red { color: var(--color-amrita-red-light); }
        .stat-icon.green { color: var(--color-success); }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Tab Layout */
        .tabs-container {
          border-bottom: 1px solid var(--border-glass);
        }

        .admin-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .tab-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.75rem 1.25rem;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-smooth);
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
          color: var(--color-amrita-red-light);
          border-bottom: 2px solid var(--color-amrita-red-light);
          background: rgba(179, 25, 66, 0.05);
        }

        .tab-badge {
          background: var(--color-danger);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 10px;
        }

        .tab-content-panel {
          padding: 2.5rem;
        }

        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tab-pane-title {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .tab-pane-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        /* Moderation List */
        .moderation-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .moderation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          gap: 1.5rem;
        }

        .mod-item-main {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .mod-item-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mod-course-code {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .mod-item-title {
          font-size: 1.2rem;
          color: var(--text-primary);
        }

        .mod-item-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .mod-item-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-top: 0.5rem;
        }

        .btn-link {
          color: var(--color-info);
          text-decoration: none;
          font-weight: 500;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .mod-item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 140px;
        }

        /* User Directory Table */
        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .admin-table th {
          border-bottom: 1px solid var(--border-glass-focused);
          padding: 1rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .admin-table td {
          border-bottom: 1px solid var(--border-glass);
          padding: 1.25rem 1rem;
          color: var(--text-primary);
        }

        .admin-table tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }

        .admin-table tr.row-admin {
          background: rgba(179, 25, 66, 0.02);
        }

        .user-name-col {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .col-admin-icon {
          color: var(--color-amrita-red-light);
        }

        .self-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .role-badge {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .role-badge.admin {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }
        .role-badge.senior {
          background: rgba(255, 183, 3, 0.15);
          color: var(--color-gold);
        }
        .role-badge.alumni {
          background: rgba(59, 130, 246, 0.15);
          color: var(--color-info);
        }
        .role-badge.student {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
        }

        .select-small {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          padding: 0.35rem 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-icon-danger {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: var(--transition-smooth);
        }

        .btn-icon-danger:hover:not(:disabled) {
          color: var(--color-danger);
          background: rgba(239, 68, 68, 0.1);
        }

        .btn-icon-danger:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Content Purge CSS */
        .content-purge-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .purge-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .purge-section h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 0.5rem;
        }

        .purge-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .purge-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .purge-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge-small {
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: var(--text-muted);
        }

        .status-tag {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-tag.approved { color: var(--color-success); }
        .status-tag.pending { color: var(--color-gold); }
        .status-tag.rejected { color: var(--color-danger); }

        .purge-card h4 {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.4;
          color: var(--text-primary);
        }

        .alert {
          padding: 1rem 1.25rem;
          border-radius: 8px;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--color-success);
        }
        .alert-danger {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--color-danger);
        }

        .empty-icon-green {
          color: var(--color-success);
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .tab-content-panel {
            padding: 1.5rem;
          }
          .moderation-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .mod-item-actions {
            width: 100%;
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;
