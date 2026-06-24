import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, BookOpen, FileText, Star, Bookmark, Calendar, User, ExternalLink, MessageSquare, CornerDownRight, X, AlertCircle } from 'lucide-react';

const Resources = () => {
  const { token, user, API_BASE } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  
  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'notes',
    courseCode: '',
    description: '',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // Pre-populated for easy testing
  });

  // Comments state
  const [newComment, setNewComment] = useState('');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/resources?category=${category}&search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category, search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upload') === 'true' && user) {
      setIsUploadOpen(true);
    }
  }, [user]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsUploadOpen(false);
        setFormData({
          title: '',
          category: 'notes',
          courseCode: '',
          description: '',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        });
        fetchResources();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/resources/${id}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchResources();
        if (selectedResource && selectedResource._id === id) {
          const updatedRes = await fetch(`${API_BASE}/resources/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await updatedRes.json();
          setSelectedResource(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRate = async (id, score) => {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score })
      });
      if (res.ok) {
        fetchResources();
        // Refresh details drawer if open
        const updatedRes = await fetch(`${API_BASE}/resources/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await updatedRes.json();
        setSelectedResource(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedResource) return;

    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetId: selectedResource._id,
          text: newComment
        })
      });

      if (res.ok) {
        const commentData = await res.json();
        setSelectedResource({
          ...selectedResource,
          comments: [commentData, ...selectedResource.comments]
        });
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDetails = async (resource) => {
    setSelectedResource(resource);
    // Fetch full details including comments
    try {
      const res = await fetch(`${API_BASE}/resources/${resource._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedResource(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to calculate average rating
  const getAvgRating = (ratings = []) => {
    if (ratings.length === 0) return 'No ratings';
    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    return (sum / ratings.length).toFixed(1) + ' / 5.0';
  };

  return (
    <div className="resources-page animate-fade">
      {/* Header and Search */}
      <div className="resources-header">
        <div>
          <h1>Resource Repository</h1>
          <p className="subtitle">Search lecture notes, assignments, and exam archives shared by seniors</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
          <Plus size={18} /> Upload Resource
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="search-filter-bar glass-panel">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-field"
            placeholder="Search by title, course code (e.g. 19CSE301)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {['all', 'notes', 'exam_paper', 'assignment'].map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' && 'All Resources'}
              {cat === 'notes' && 'Lecture Notes'}
              {cat === 'exam_paper' && 'Question Papers'}
              {cat === 'assignment' && 'Assignments'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="loading-state">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="empty-state glass-panel">
          <AlertCircle size={36} className="empty-icon" />
          <h3>No Resources Found</h3>
          <p>Be the first to upload materials for this filter!</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {resources.map((res) => {
            const isBookmarked = res.bookmarks && res.bookmarks.includes(user?._id);
            return (
              <div key={res._id} className="resource-card glass-card" onClick={() => openDetails(res)}>
                <div className="card-top">
                  <span className={`badge ${
                    res.category === 'notes' ? 'badge-red' : 
                    res.category === 'exam_paper' ? 'badge-gold' : 'badge-blue'
                  }`}>
                    {res.category === 'notes' ? 'Notes' : 
                     res.category === 'exam_paper' ? 'Exam Paper' : 'Assignment'}
                  </span>
                  <button className={`bookmark-btn ${isBookmarked ? 'active' : ''}`} onClick={(e) => handleBookmark(res._id, e)}>
                    <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <h3 className="card-title">{res.title}</h3>
                <span className="course-code-badge">{res.courseCode}</span>
                
                <p className="card-desc">
                  {res.description || 'No description provided.'}
                </p>

                <div className="card-footer">
                  <div className="footer-metric">
                    <Star size={14} className="star-icon" />
                    <span>{getAvgRating(res.ratings)}</span>
                  </div>
                  <div className="footer-metric">
                    <User size={14} />
                    <span>{res.uploadedBy?.name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide">
            <div className="modal-header">
              <h2>Upload Academic Resource</h2>
              <button className="close-btn" onClick={() => setIsUploadOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleUploadSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Unit 3 - Compiler Design Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2-col">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="notes">Lecture Notes</option>
                    <option value="exam_paper">Question Paper</option>
                    <option value="assignment">Assignment Solution</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 19CSE305"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Summarize the resource (e.g. covers code generation and optimization topics)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">File Link (Cloudinary / PDF URL)</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsUploadOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Drawer / Drawer Overlay */}
      {selectedResource && (
        <div className="modal-overlay" onClick={() => setSelectedResource(null)}>
          <div className="drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="badge badge-red">{selectedResource.category}</span>
              <button className="close-btn" onClick={() => setSelectedResource(null)}><X size={20} /></button>
            </div>

            <h2 className="drawer-title">{selectedResource.title}</h2>
            <div className="drawer-course">{selectedResource.courseCode}</div>

            <p className="drawer-desc">{selectedResource.description || 'No description available.'}</p>

            <div className="drawer-meta-grid">
              <div className="meta-box">
                <span className="meta-title">Uploaded By</span>
                <span className="meta-value">{selectedResource.uploadedBy?.name || 'Anonymous'} ({selectedResource.uploadedBy?.role})</span>
              </div>
              <div className="meta-box">
                <span className="meta-title">Rating</span>
                <span className="meta-value">{getAvgRating(selectedResource.ratings)}</span>
              </div>
            </div>

            <div className="drawer-actions">
              <a href={selectedResource.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary drawer-action-btn">
                <ExternalLink size={16} /> View Document (PDF)
              </a>
              
              {/* Rate action */}
              <div className="rate-selector">
                <span>Your Rating: </span>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => handleRate(selectedResource._id, star)} className="star-btn">
                      <Star size={18} fill={
                        selectedResource.ratings?.find(r => r.user.toString() === user?._id.toString())?.score >= star ? 'var(--color-gold)' : 'none'
                      } />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              <h3>Discussion ({selectedResource.comments?.length || 0})</h3>
              
              <form onSubmit={handleAddComment} className="comment-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask a question or leave a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-secondary btn-comment">Post</button>
              </form>

              <div className="comments-list">
                {selectedResource.comments && selectedResource.comments.map((comment) => (
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
        .resources-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .resources-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .resources-header h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }

        .resources-header .subtitle {
          color: var(--text-secondary);
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

        .resource-card {
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

        .bookmark-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          transition: var(--transition-smooth);
        }

        .bookmark-btn:hover {
          color: var(--color-gold);
        }

        .bookmark-btn.active {
          color: var(--color-gold);
        }

        .card-title {
          font-size: 1.15rem;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .course-code-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--color-gold);
          background: rgba(255, 183, 3, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          align-self: flex-start;
        }

        .card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex: 1;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--border-glass);
          padding-top: 0.75rem;
          margin-top: 0.5rem;
        }

        .footer-metric {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .star-icon {
          color: var(--color-gold);
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
          max-width: 540px;
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

        /* Drawer details view styling */
        .drawer-content {
          width: 100%;
          max-width: 600px;
          height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-title {
          font-size: 1.6rem;
          line-height: 1.25;
        }

        .drawer-course {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: var(--color-gold);
          font-weight: 600;
        }

        .drawer-desc {
          color: var(--text-secondary);
          line-height: 1.6;
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
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .drawer-action-btn {
          width: 100%;
          padding: 0.9rem;
        }

        .rate-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .rating-stars {
          display: flex;
          gap: 0.25rem;
        }

        .star-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .star-btn:hover, .star-btn:hover ~ .star-btn {
          color: var(--color-gold-light);
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
          .grid-2-col {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .resources-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .resources-header button {
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

export default Resources;
