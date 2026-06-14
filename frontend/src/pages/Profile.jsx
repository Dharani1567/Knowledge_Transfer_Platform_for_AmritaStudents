import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Calendar, Settings, Edit, Check, X, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    batchYear: user?.batchYear || new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    const success = await updateProfile(formData);
    setLoading(false);
    if (success) {
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="profile-page animate-fade">
      <div className="profile-grid">
        {/* Profile Card Summary */}
        <div className="profile-summary-card glass-panel text-center">
          <div className="avatar-placeholder">
            <User size={48} className="avatar-icon" />
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <span className="badge badge-red role-badge">{user?.role}</span>
          
          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-num">5</span>
              <span className="stat-lbl">Contributions</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <span className="stat-num">2</span>
              <span className="stat-lbl">Mentee Requests</span>
            </div>
          </div>
        </div>

        {/* Profile Details Edit Card */}
        <div className="profile-details-card glass-panel">
          <div className="card-header">
            <h3>Profile Settings</h3>
            {!isEditing ? (
              <button className="btn btn-secondary btn-edit" onClick={() => setIsEditing(true)}>
                <Edit size={16} /> Edit Profile
              </button>
            ) : (
              <button className="btn btn-danger btn-edit" onClick={() => setIsEditing(false)}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          {successMsg && (
            <div className="profile-success-banner animate-fade">
              <Check size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="profile-error-banner animate-fade">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Amrita Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  title="Your official email address cannot be edited."
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="form-label">Department</label>
                <div className="input-with-icon">
                  <GraduationCap className="input-icon" size={18} />
                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <div className="input-with-icon">
                  <Calendar className="input-icon" size={18} />
                  <input
                    type="number"
                    name="batchYear"
                    className="form-control"
                    value={formData.batchYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <button type="submit" className="btn btn-primary profile-submit-btn" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            )}
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          align-items: start;
        }

        .profile-summary-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 3rem 1.5rem;
        }

        .avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: rgba(179, 25, 66, 0.1);
          border: 2px dashed var(--color-amrita-red-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .avatar-icon {
          color: var(--color-amrita-red-light);
        }

        .profile-name {
          font-size: 1.5rem;
          font-weight: 750;
        }

        .role-badge {
          padding: 0.35rem 1rem;
        }

        .profile-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          width: 100%;
          border-top: 1px solid var(--border-glass);
          padding-top: 1.5rem;
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-num {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-gold);
        }

        .stat-lbl {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: var(--border-glass);
        }

        .profile-details-card {
          padding: 2.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1rem;
        }

        .btn-edit {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .profile-success-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--color-success);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
        }

        .profile-error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--color-danger);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .input-with-icon .form-control {
          padding-left: 2.5rem;
        }

        .input-with-icon .form-control:disabled {
          background: rgba(255, 255, 255, 0.01);
          color: var(--text-secondary);
          border-color: rgba(255, 255, 255, 0.04);
          cursor: not-allowed;
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .profile-submit-btn {
          margin-top: 1rem;
          padding: 0.85rem;
        }

        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .grid-2-col {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
