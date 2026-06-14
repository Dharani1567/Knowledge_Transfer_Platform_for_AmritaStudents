import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Briefcase, Calendar, Star, BookOpen, AlertCircle, X, ChevronDown, Check, Award, ShieldAlert, User } from 'lucide-react';

const Experiences = () => {
  const { token, user, API_BASE } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');

  // Modal & Detail state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    type: 'placement',
    company: '',
    role: '',
    packageOrStipend: '',
    preparationTips: '',
    difficulty: 'medium',
    rounds: [{ roundName: 'Round 1: Technical MCQ', description: '', tips: '' }]
  });

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/experiences?search=${search}`;
      if (type !== 'all') {
        url += `&type=${type}`;
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [type, search]);

  const handleAddRound = () => {
    setFormData({
      ...formData,
      rounds: [...formData.rounds, { roundName: `Round ${formData.rounds.length + 1}`, description: '', tips: '' }]
    });
  };

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[index][field] = value;
    setFormData({
      ...formData,
      rounds: updatedRounds
    });
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      rounds: updatedRounds
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSubmitOpen(false);
        setFormData({
          type: 'placement',
          company: '',
          role: '',
          packageOrStipend: '',
          preparationTips: '',
          difficulty: 'medium',
          rounds: [{ roundName: 'Round 1: Technical MCQ', description: '', tips: '' }]
        });
        fetchExperiences();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isJunior = user?.role === 'student';

  return (
    <div className="experiences-page animate-fade">
      {/* Header */}
      <div className="experiences-header">
        <div>
          <h1>Placement & Internship Hub</h1>
          <p className="subtitle">Learn from recruitment journals of seniors who landed roles at top companies</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsSubmitOpen(true)}
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      {/* Gating Banner for Juniors */}
      {isJunior && (
        <div className="info-banner glass-panel animate-fade">
          <ShieldAlert size={20} className="info-icon" />
          <span>Note: You can browse all reviews, but review submissions are restricted to Seniors and Alumni.</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="search-filter-bar glass-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-field"
            placeholder="Search by company (e.g. Orion, Amazon) or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {['all', 'placement', 'internship'].map((t) => (
            <button
              key={t}
              className={`cat-tab ${type === t ? 'active' : ''}`}
              onClick={() => setType(t)}
            >
              {t === 'all' && 'All Careers'}
              {t === 'placement' && 'Placement Logs'}
              {t === 'internship' && 'Internships'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="loading-state">Loading reviews...</div>
      ) : experiences.length === 0 ? (
        <div className="empty-state glass-panel">
          <AlertCircle size={36} className="empty-icon" />
          <h3>No Reviews Found</h3>
          <p>Be the first senior to share your recruitment story!</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {experiences.map((exp) => (
            <div key={exp._id} className="experience-card glass-card" onClick={() => setSelectedExp(exp)}>
              <div className="card-top">
                <span className={`badge ${exp.type === 'placement' ? 'badge-red' : 'badge-gold'}`}>
                  {exp.type}
                </span>
                <span className={`badge-difficulty ${exp.difficulty}`}>
                  {exp.difficulty}
                </span>
              </div>

              <h3 className="card-company">{exp.company}</h3>
              <p className="card-role">{exp.role}</p>

              {exp.packageOrStipend && (
                <div className="package-info">
                  <span className="pkg-label">{exp.type === 'placement' ? 'CTC:' : 'Stipend:'}</span>
                  <span className="pkg-value">{exp.packageOrStipend}</span>
                </div>
              )}

              <div className="card-footer">
                <div className="footer-metric">
                  <BookOpen size={14} />
                  <span>{exp.rounds?.length} Rounds</span>
                </div>
                <div className="footer-metric">
                  <User size={14} />
                  <span>{exp.author?.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Modal (gated check done inside) */}
      {isSubmitOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide">
            <div className="modal-header">
              <h2>Post Interview Experience</h2>
              <button className="close-btn" onClick={() => setIsSubmitOpen(false)}><X size={20} /></button>
            </div>

            {isJunior ? (
              <div className="junior-warning">
                <ShieldAlert size={48} className="warning-icon" />
                <h3>Submission Gated</h3>
                <p>Only Seniors, Alumni, and Admin roles are authorized to publish career experience logs. This ensures authentic records of campus placements.</p>
                <button className="btn btn-secondary w-full" onClick={() => setIsSubmitOpen(false)}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form scrollable-form">
                <div className="grid-2-col">
                  <div className="form-group">
                    <label className="form-label">Review Type</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="placement">Full-time Placement</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Difficulty Rating</label>
                    <select
                      className="form-control"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2-col">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Orion Innovation"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Title / Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. SDE Intern"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Package (CTC / Stipend)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 6.5 LPA or 40,000 / month"
                    value={formData.packageOrStipend}
                    onChange={(e) => setFormData({ ...formData, packageOrStipend: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Overall Preparation Advice</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="What topics should juniors study? (e.g. SQL joins, OOPs, specific LeetCode modules)"
                    value={formData.preparationTips}
                    onChange={(e) => setFormData({ ...formData, preparationTips: e.target.value })}
                  />
                </div>

                <div className="rounds-setup">
                  <div className="rounds-header">
                    <h4>Interview Rounds ({formData.rounds.length})</h4>
                    <button type="button" className="btn btn-secondary btn-small" onClick={handleAddRound}>+ Add Round</button>
                  </div>

                  {formData.rounds.map((round, idx) => (
                    <div key={idx} className="round-form-block glass-panel">
                      <div className="round-block-title">
                        <h5>Round {idx + 1}</h5>
                        {formData.rounds.length > 1 && (
                          <button type="button" className="round-remove-btn" onClick={() => handleRemoveRound(idx)}>Remove</button>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Round Name (e.g., Coding Test or Technical HR)"
                          value={round.roundName}
                          onChange={(e) => handleRoundChange(idx, 'roundName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="What happened in this round? What questions were asked?"
                          value={round.description}
                          onChange={(e) => handleRoundChange(idx, 'description', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tips for this round"
                          value={round.tips}
                          onChange={(e) => handleRoundChange(idx, 'tips', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Details View Drawer */}
      {selectedExp && (
        <div className="modal-overlay" onClick={() => setSelectedExp(null)}>
          <div className="drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className={`badge ${selectedExp.type === 'placement' ? 'badge-red' : 'badge-gold'}`}>{selectedExp.type}</span>
              <button className="close-btn" onClick={() => setSelectedExp(null)}><X size={20}/></button>
            </div>

            <h2 className="drawer-title">{selectedExp.company}</h2>
            <div className="drawer-role-display">{selectedExp.role}</div>
            
            {selectedExp.packageOrStipend && (
              <div className="drawer-package-banner glass-panel">
                <span>{selectedExp.type === 'placement' ? 'Annual Compensation' : 'Monthly Stipend'}</span>
                <strong>{selectedExp.packageOrStipend}</strong>
              </div>
            )}

            <div className="drawer-meta-grid">
              <div className="meta-box">
                <span className="meta-title">Senior Author</span>
                <span className="meta-value">{selectedExp.author?.name || 'Amrita Graduate'}</span>
              </div>
              <div className="meta-box">
                <span className="meta-title">Difficulty Level</span>
                <span className={`meta-value badge-difficulty ${selectedExp.difficulty}`}>{selectedExp.difficulty}</span>
              </div>
            </div>

            {selectedExp.preparationTips && (
              <div className="drawer-prep-box glass-panel">
                <h4>General Preparation Advice</h4>
                <p>{selectedExp.preparationTips}</p>
              </div>
            )}

            <div className="rounds-timeline">
              <h3>Interview Stages</h3>
              <div className="timeline-list">
                {selectedExp.rounds?.map((round, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-icon">
                      <Check size={14} />
                    </div>
                    <div className="timeline-body glass-panel">
                      <h4>{round.roundName}</h4>
                      {round.description && <p className="round-desc">{round.description}</p>}
                      {round.tips && (
                        <div className="round-tips-callout">
                          <strong>Tips:</strong> {round.tips}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .experiences-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .experiences-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .experiences-header h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .experiences-header .subtitle {
          color: var(--text-secondary);
        }

        .info-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 183, 3, 0.05);
          border-color: rgba(255, 183, 3, 0.15);
          color: var(--color-gold);
          padding: 0.75rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .info-icon {
          flex-shrink: 0;
        }

        .search-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .search-field {
          padding-left: 2.75rem;
        }

        .category-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .cat-tab {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition-smooth);
          white-space: nowrap;
        }

        .cat-tab:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .cat-tab.active {
          background: rgba(179, 25, 66, 0.15);
          color: var(--color-amrita-red-light);
          border-color: var(--color-amrita-red);
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .empty-state p {
          color: var(--text-secondary);
        }

        .experience-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          height: 100%;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge-difficulty {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .badge-difficulty.easy {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-difficulty.medium {
          background: rgba(255, 183, 3, 0.1);
          color: var(--color-gold);
          border: 1px solid rgba(255, 183, 3, 0.2);
        }

        .badge-difficulty.hard {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .card-company {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-role {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: -0.25rem;
        }

        .package-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          margin-top: 0.25rem;
        }

        .pkg-label {
          color: var(--text-muted);
        }

        .pkg-value {
          font-weight: 600;
          color: var(--color-gold);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--border-glass);
          padding-top: 0.75rem;
          margin-top: auto;
        }

        .footer-metric {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 620px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .scrollable-form {
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .junior-warning {
          text-align: center;
          padding: 2.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .warning-icon {
          color: var(--color-gold);
        }

        .junior-warning h3 {
          font-size: 1.35rem;
        }

        .junior-warning p {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          transition: var(--transition-smooth);
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rounds-setup {
          border-top: 1px solid var(--border-glass);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rounds-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-small {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }

        .round-form-block {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .round-block-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .round-remove-btn {
          background: none;
          border: none;
          color: var(--color-danger);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        /* Drawer Details View styling */
        .drawer-content {
          width: 100%;
          max-width: 640px;
          height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .drawer-title {
          font-size: 1.8rem;
        }

        .drawer-role-display {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: -0.75rem;
        }

        .drawer-package-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.25rem;
          background: rgba(179, 25, 66, 0.05);
          border-color: rgba(179, 25, 66, 0.15);
        }

        .drawer-package-banner span {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .drawer-package-banner strong {
          color: var(--color-amrita-red-light);
          font-size: 1.2rem;
          font-family: var(--font-heading);
        }

        .drawer-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
          padding: 1rem 0;
        }

        .meta-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .meta-value {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .drawer-prep-box {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
        }

        .drawer-prep-box h4 {
          font-size: 1rem;
          color: var(--color-gold);
        }

        .drawer-prep-box p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Timeline stages */
        .rounds-timeline {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          padding-left: 1.5rem;
        }

        .timeline-list::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: var(--border-glass);
        }

        .timeline-item {
          position: relative;
        }

        .timeline-icon {
          position: absolute;
          left: -23px;
          top: 14px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-amrita-red);
          border: 3px solid var(--bg-dark-mesh);
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .timeline-body {
          padding: 1rem;
        }

        .timeline-body h4 {
          font-size: 1.05rem;
          margin-bottom: 0.35rem;
          color: var(--text-primary);
        }

        .round-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .round-tips-callout {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          padding: 0.4rem 0.75rem;
          background: rgba(16, 185, 129, 0.05);
          border-left: 3px solid var(--color-success);
          color: var(--text-primary);
          border-radius: 0 4px 4px 0;
        }

        @media (max-width: 580px) {
          .grid-2-col {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .experiences-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .experiences-header button {
            width: 100%;
          }
          .drawer-meta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Experiences;
