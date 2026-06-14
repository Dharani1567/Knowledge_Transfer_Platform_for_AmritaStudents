import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Compass, BookOpen, AlertCircle, Calendar, User, X, ShieldAlert, FileText } from 'lucide-react';

const Guidance = () => {
  const { token, user, API_BASE } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Modal & Detail states
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'general_advice',
    content: ''
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/guidance?search=${search}`;
      if (category !== 'all') {
        url += `&category=${category}`;
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsPublishOpen(false);
        setFormData({ title: '', category: 'general_advice', content: '' });
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isJunior = user?.role === 'student';

  return (
    <div className="guidance-page animate-fade">
      {/* Header */}
      <div className="guidance-header">
        <div>
          <h1>Guidance & Advice Hub</h1>
          <p className="subtitle">Read survival guides, club advice, and technical preparation maps written by alumni</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsPublishOpen(true)}>
          <Plus size={18} /> Write Article
        </button>
      </div>

      {/* Gating Banner for Juniors */}
      {isJunior && (
        <div className="info-banner glass-panel">
          <ShieldAlert size={20} className="info-icon" />
          <span>Note: You are currently browsing guides. Writing articles is restricted to Senior students and Alumni.</span>
        </div>
      )}

      {/* Search and Category filters */}
      <div className="search-filter-bar glass-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-field"
            placeholder="Search guides by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {['all', 'first_year', 'placement_prep', 'general_advice'].map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' && 'All Advice'}
              {cat === 'first_year' && 'First-Year Guides'}
              {cat === 'placement_prep' && 'Placement Prep'}
              {cat === 'general_advice' && 'General Advice'}
            </button>
          ))}
        </div>
      </div>

      {/* Article List Grid */}
      {loading ? (
        <div className="loading-state">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="empty-state glass-panel">
          <AlertCircle size={36} className="empty-icon" />
          <h3>No Guides Found</h3>
          <p>Be the first senior to share academic tips on this category!</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {articles.map((art) => (
            <div key={art._id} className="article-card glass-card" onClick={() => setSelectedArticle(art)}>
              <div className="card-top">
                <span className={`badge ${
                  art.category === 'first_year' ? 'badge-green' :
                  art.category === 'placement_prep' ? 'badge-red' : 'badge-gold'
                }`}>
                  {art.category === 'first_year' ? 'First Year' :
                   art.category === 'placement_prep' ? 'Placement' : 'General'}
                </span>
                <Compass className="card-top-icon" size={18} />
              </div>

              <h3 className="card-title">{art.title}</h3>
              <p className="card-desc">{art.content}</p>

              <div className="card-footer">
                <div className="footer-metric">
                  <User size={14} />
                  <span>By {art.author?.name.split(' ')[0]} ({art.author?.role})</span>
                </div>
                <div className="footer-metric">
                  <Calendar size={14} />
                  <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Article Modal */}
      {isPublishOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide">
            <div className="modal-header">
              <h2>Publish Guidance Article</h2>
              <button className="close-btn" onClick={() => setIsPublishOpen(false)}><X size={20} /></button>
            </div>

            {isJunior ? (
              <div className="junior-warning">
                <ShieldAlert size={48} className="warning-icon" />
                <h3>Submission Gated</h3>
                <p>Only Seniors, Alumni, and Admins are authorized to write guidance articles. This ensures reliable advice is curated for the student body.</p>
                <button className="btn btn-secondary w-full" onClick={() => setIsPublishOpen(false)}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Article Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Unit 1 Physics midsem preparation tips"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="first_year">First-Year Guide</option>
                    <option value="placement_prep">Placement Prep Map</option>
                    <option value="general_advice">General College Advice</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Article Content</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    placeholder="Write detailed recommendations here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsPublishOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Publish Guide</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Details View Drawer */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className={`badge ${
                selectedArticle.category === 'first_year' ? 'badge-green' :
                selectedArticle.category === 'placement_prep' ? 'badge-red' : 'badge-gold'
              }`}>{selectedArticle.category}</span>
              <button className="close-btn" onClick={() => setSelectedArticle(null)}><X size={20} /></button>
            </div>

            <h2 className="drawer-title">{selectedArticle.title}</h2>
            
            <div className="drawer-owner-info">
              <span>Author: </span>
              <strong>{selectedArticle.author?.name || 'Amrita Senior'}</strong>
              <span> ({selectedArticle.author?.role})</span>
            </div>

            <div className="drawer-article-body glass-panel">
              {selectedArticle.content?.split('\n\n').map((para, idx) => (
                <p key={idx} className="drawer-para">{para}</p>
              ))}
            </div>

            <div className="drawer-meta-grid">
              <div className="meta-box">
                <span className="meta-title">Department</span>
                <span className="meta-value">{selectedArticle.author?.department || 'CSE'}</span>
              </div>
              <div className="meta-box">
                <span className="meta-title">Date Published</span>
                <span className="meta-value">{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="btn btn-secondary w-full" onClick={() => setSelectedArticle(null)}>Close Article</button>
          </div>
        </div>
      )}

      <style>{`
        .guidance-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .guidance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .guidance-header h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .guidance-header .subtitle {
          color: var(--text-secondary);
        }

        .info-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.15);
          color: var(--color-info);
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

        .article-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          height: 100%;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-top-icon {
          color: var(--text-muted);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
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
          gap: 1.25rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
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
          line-height: 1.25;
        }

        .drawer-owner-info {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: -0.75rem;
        }

        .drawer-owner-info strong {
          color: var(--color-amrita-red-light);
        }

        .drawer-article-body {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.01);
          border-color: var(--border-glass);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .drawer-para {
          font-size: 0.95rem;
          color: var(--text-primary);
          line-height: 1.6;
          white-space: pre-line;
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

        @media (max-width: 580px) {
          .guidance-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .guidance-header button {
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

export default Guidance;
