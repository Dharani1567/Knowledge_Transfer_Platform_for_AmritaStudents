import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, BookOpen, Calendar, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    department: 'CSE',
    batchYear: new Date().getFullYear() + 2,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Quick frontend validation for Amrita Domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]*amrita\.(edu|in))$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('Registration is restricted to official Amrita email addresses only (e.g. name@cb.amrita.edu)');
      return;
    }

    setLoading(true);
    const success = await register(formData);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page animate-slide">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <UserPlus className="auth-icon" />
          <h2>Join the Platform</h2>
          <p>Create an account to share study assets and view archives</p>
        </div>

        {(localError || error) && (
          <div className="auth-error animate-fade">
            <AlertCircle size={18} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Dharani Kumar"
                value={formData.name}
                onChange={handleChange}
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
                name="email"
                className="form-control"
                placeholder="name@cb.amrita.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-group">
              <label className="form-label">Academic Role</label>
              <select
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student (Junior)</option>
                <option value="senior">Senior Student</option>
                <option value="alumni">Amrita Alumni</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="CSE">CSE</option>
                <option value="AIE">AIE (AI)</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
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
                placeholder="e.g. 2027"
                min="2010"
                max="2035"
                value={formData.batchYear}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">Sign in here</Link>
        </div>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 90vh;
          padding: 2rem 1rem;
        }

        .auth-card {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-header {
          text-align: center;
        }

        .auth-icon {
          color: var(--color-amrita-red-light);
          width: 42px;
          height: 42px;
          margin-bottom: 0.75rem;
        }

        .auth-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--color-danger);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .w-full {
          width: 100%;
        }

        .auth-submit {
          margin-top: 0.5rem;
          padding: 0.85rem;
        }

        .auth-footer {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-link {
          color: var(--color-amrita-red-light);
          text-decoration: none;
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .grid-2-col {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
