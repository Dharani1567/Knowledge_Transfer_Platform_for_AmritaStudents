import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, FolderGit, ExternalLink, Users, Calendar, User, X, AlertCircle } from 'lucide-react';

const Github = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Projects = () => {
  const { token, user, API_BASE } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal and details
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedProj, setSelectedProj] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    demoLink: '',
    teamMembersText: '' // Comma separated list
  });

  // Comments state
  const [newComment, setNewComment] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects?search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse team members
    const teamMembers = formData.teamMembersText
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          githubLink: formData.githubLink,
          demoLink: formData.demoLink,
          teamMembers
        })
      });

      if (res.ok) {
        setIsSubmitOpen(false);
        setFormData({
          title: '',
          description: '',
          githubLink: '',
          demoLink: '',
          teamMembersText: ''
        });
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedProj) return;

    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetId: selectedProj._id,
          text: newComment
        })
      });

      if (res.ok) {
        const commentData = await res.json();
        setSelectedProj({
          ...selectedProj,
          comments: [commentData, ...selectedProj.comments]
        });
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDetails = async (proj) => {
    setSelectedProj(proj);
    try {
      const res = await fetch(`${API_BASE}/projects/${proj._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProj(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="projects-page animate-fade">
      {/* Header */}
      <div className="projects-header">
        <div>
          <h1>Project Showcase</h1>
          <p className="subtitle">Discover Capstone, research, and course projects designed by Amrita students</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsSubmitOpen(true)}>
          <Plus size={18} /> Share Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-filter-bar glass-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-field"
            placeholder="Search by title, technology, or developer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="loading-state">Loading showcases...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state glass-panel">
          <AlertCircle size={36} className="empty-icon" />
          <h3>No Projects Found</h3>
          <p>Be the first to upload and showcase your project!</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {projects.map((proj) => (
            <div key={proj._id} className="project-card glass-card" onClick={() => openDetails(proj)}>
              <div className="project-header-top">
                <FolderGit size={28} className="project-icon" />
                <div className="project-links">
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noreferrer" className="proj-link-icon" onClick={(e) => e.stopPropagation()}>
                      <Github size={18} />
                    </a>
                  )}
                  {proj.demoLink && (
                    <a href={proj.demoLink} target="_blank" rel="noreferrer" className="proj-link-icon" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="card-title">{proj.title}</h3>
              <p className="card-desc">{proj.description}</p>

              <div className="project-team">
                <Users size={14} className="team-icon" />
                <span className="team-names">
                  {proj.teamMembers?.join(', ') || 'Solo Project'}
                </span>
              </div>

              <div className="card-footer">
                <div className="footer-metric">
                  <User size={14} />
                  <span>{proj.uploadedBy?.name.split(' ')[0]} ({proj.uploadedBy?.department})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {isSubmitOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide">
            <div className="modal-header">
              <h2>Share Your Project</h2>
              <button className="close-btn" onClick={() => setIsSubmitOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Smart AUMS Extension"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Architecture</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="What tech stack is used? What problem does it solve?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2-col">
                <div className="form-group">
                  <label className="form-label">GitHub Repository Link</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://github.com/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Live Demo Link (Optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={formData.demoLink}
                    onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Team Members (Comma separated names)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dharani Kumar, Abhiram K, Meera Nair"
                  value={formData.teamMembersText}
                  onChange={(e) => setFormData({ ...formData, teamMembersText: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Share Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Drawer */}
      {selectedProj && (
        <div className="modal-overlay" onClick={() => setSelectedProj(null)}>
          <div className="drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="badge badge-blue">Project Showcase</span>
              <button className="close-btn" onClick={() => setSelectedProj(null)}><X size={20} /></button>
            </div>

            <h2 className="drawer-title">{selectedProj.title}</h2>
            <div className="drawer-owner-info">
              <span>Submitted by: </span>
              <strong>{selectedProj.uploadedBy?.name || 'Amrita Student'}</strong>
            </div>

            <p className="drawer-desc">{selectedProj.description}</p>

            <div className="project-drawer-links">
              {selectedProj.githubLink && (
                <a href={selectedProj.githubLink} target="_blank" rel="noreferrer" className="btn btn-secondary drawer-link-btn">
                  <Github size={16} /> GitHub Codebase
                </a>
              )}
              {selectedProj.demoLink && (
                <a href={selectedProj.demoLink} target="_blank" rel="noreferrer" className="btn btn-primary drawer-link-btn">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>

            <div className="drawer-meta-grid">
              <div className="meta-box">
                <span className="meta-title">Collaborators / Authors</span>
                <span className="meta-value">{selectedProj.teamMembers?.join(', ') || 'Solo Project'}</span>
              </div>
              <div className="meta-box">
                <span className="meta-title">Date Shared</span>
                <span className="meta-value">{new Date(selectedProj.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Comments / Discussion */}
            <div className="comments-section">
              <h3>Project Q&A / Discussion ({selectedProj.comments?.length || 0})</h3>

              <form onSubmit={handleAddComment} className="comment-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask a question about their codebase or tech stack..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-secondary btn-comment">Post</button>
              </form>

              <div className="comments-list">
                {selectedProj.comments && selectedProj.comments.map((comment) => (
                  <div key={comment._id} className="comment-card glass-panel">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author?.name}</span>
                      <span className="comment-role">{comment.author?.role}</span>
                      <span className="comment-time">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .projects-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .projects-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .projects-header h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .projects-header .subtitle {
          color: var(--text-secondary);
        }

        .search-filter-bar {
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

        .project-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          height: 100%;
        }

        .project-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-icon {
          color: var(--color-amrita-red-light);
        }

        .project-links {
          display: flex;
          gap: 0.5rem;
        }

        .proj-link-icon {
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          padding: 0.35rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .proj-link-icon:hover {
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-team {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.01);
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
        }

        .team-icon {
          flex-shrink: 0;
        }

        .team-names {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        /* Drawer Details View styling */
        .drawer-content {
          width: 100%;
          max-width: 620px;
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

        .drawer-owner-info {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: -0.75rem;
        }

        .drawer-owner-info strong {
          color: var(--color-amrita-red-light);
        }

        .drawer-desc {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .project-drawer-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .drawer-link-btn {
          padding: 0.85rem;
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

        /* Comments Section */
        .comments-section {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .comment-form {
          display: flex;
          gap: 0.5rem;
        }

        .btn-comment {
          padding: 0.5rem 1.25rem;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .comment-card {
          padding: 0.85rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .comment-author {
          font-weight: 600;
          color: var(--text-primary);
        }

        .comment-role {
          background: rgba(179, 25, 66, 0.1);
          color: var(--color-amrita-red-light);
          padding: 0.05rem 0.3rem;
          border-radius: 3px;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .comment-time {
          color: var(--text-muted);
          margin-left: auto;
        }

        .comment-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 580px) {
          .grid-2-col, .project-drawer-links {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .projects-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .projects-header button {
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

export default Projects;
