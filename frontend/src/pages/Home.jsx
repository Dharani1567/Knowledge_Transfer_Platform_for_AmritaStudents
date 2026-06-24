import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Briefcase, FolderGit, ArrowRight, 
  Shield, Globe, Award, HelpCircle, Users, 
  RefreshCw, UploadCloud, Compass, CheckCircle2,
  Search, FileText
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const metrics = [
    { label: 'Academic Resources', count: '250+', icon: <BookOpen className="metric-icon" /> },
    { label: 'Interview Journals', count: '80+', icon: <Briefcase className="metric-icon" /> },
    { label: 'Project Handovers', count: '40+', icon: <FolderGit className="metric-icon" /> }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/resources?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const faqQuestions = [
    {
      q: "What is this?",
      a: "A central digital repository built specifically for Amrita students to share notes, projects, and interview experiences.",
      icon: <HelpCircle className="q-icon blue" size={24} />,
      tag: "Academic Hub"
    },
    {
      q: "Who is it for?",
      a: "Juniors searching for study material and PYQs, and seniors/alumni who want to pass down guidance and refer students.",
      icon: <Users className="q-icon red" size={24} />,
      tag: "For All Batches"
    },
    {
      q: "What can I do here?",
      a: "Instantly download semester notes, read actual placement interview stages, explore code repositories, or upload your own guides.",
      icon: <Compass className="q-icon gold" size={24} />,
      tag: "Interactive Tools"
    },
    {
      q: "Why should I come back?",
      a: "New files, interview reports, and peer comments are uploaded weekly by verified students across all departments.",
      icon: <RefreshCw className="q-icon green" size={24} />,
      tag: "Weekly Updates"
    }
  ];

  return (
    <div className="home-container animate-fade">
      {/* Hero Section */}
      <header className="hero-section glass-panel">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="hero-content">
          <div className="tagline-badge">
            <span className="badge badge-red">Amrita University</span>
            <span>SSR Project Pillar: Academic Sustainability</span>
          </div>
          
          <h1 className="hero-title">
            Amrita’s student knowledge hub — <br />
            <span>notes, PYQs, project guides, interview experiences, and campus resources from seniors to juniors.</span>
          </h1>
          
          <p className="hero-subtitle">
            Find subject-wise resources, placement prep, project handovers, and verified student contributions in one place.
          </p>

          {/* Quick Search Console */}
          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <div className="hero-search-input-wrapper">
              <Search className="hero-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search subject resources... (e.g. DBMS, OS, Data Structures)"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="hero-search-field"
              />
              <button type="submit" className="btn btn-primary hero-search-btn">
                Search
              </button>
            </div>
          </form>
          
          <div className="hero-cta-group">
            {/* Primary CTAs */}
            <div className="primary-ctas">
              <Link to="/resources" className="btn btn-primary btn-large">
                Browse resources <ArrowRight size={18} />
              </Link>
              <Link to={user ? "/resources?upload=true" : "/login?redirect=/resources?upload=true"} className="btn btn-outline btn-large">
                <UploadCloud size={18} /> Upload a contribution
              </Link>
            </div>
            
            {/* Secondary CTAs */}
            <div className="secondary-ctas">
              <Link to="/resources" className="btn-link-sec">
                Explore by semester &rarr;
              </Link>
              <span className="cta-divider">|</span>
              <Link to="/experiences" className="btn-link-sec">
                See placement prep &rarr;
              </Link>
            </div>
          </div>

          {/* Top Shortcuts Quick Actions */}
          <div className="shortcuts-container">
            <span className="shortcuts-label">Top Shortcuts</span>
            <div className="shortcuts-grid">
              <Link to="/resources?category=notes" className="shortcut-btn glass-card">
                <BookOpen size={15} /> Semester Resources
              </Link>
              <Link to="/resources?category=exam_paper" className="shortcut-btn glass-card">
                <FileText size={15} /> PYQs (Exam Papers)
              </Link>
              <Link to="/experiences" className="shortcut-btn glass-card">
                <Briefcase size={15} /> Placement Prep
              </Link>
              <Link to="/projects" className="shortcut-btn glass-card">
                <FolderGit size={15} /> Projects
              </Link>
              <Link to="/experiences" className="shortcut-btn glass-card">
                <Compass size={15} /> Interview Experiences
              </Link>
              <Link to="/guidance" className="shortcut-btn glass-card">
                <HelpCircle size={15} /> Ask Seniors / FAQs
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Instant Answer (4 Questions) Section */}
      <section className="faq-grid-section">
        <div className="section-header-centered">
          <span className="pre-title">Instantly Answered</span>
          <h2>KTP at a Glance</h2>
          <p>Everything you need to know about the Amrita Knowledge Transfer Platform in 5 seconds</p>
        </div>
        
        <div className="faq-grid">
          {faqQuestions.map((item, idx) => (
            <div key={idx} className="faq-card glass-card animate-slide">
              <div className="faq-card-header">
                <div className="faq-icon-box">{item.icon}</div>
                <span className="faq-tag">{item.tag}</span>
              </div>
              <h3 className="faq-question">{item.q}</h3>
              <p className="faq-answer">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Section */}
      <section className="metrics-grid">
        {metrics.map((metric, i) => (
          <div key={i} className="metric-card glass-card">
            <div className="metric-header">
              {metric.icon}
              <span className="metric-count">{metric.count}</span>
            </div>
            <span className="metric-label">{metric.label}</span>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header-centered">
          <span className="pre-title">Core Ecosystem</span>
          <h2>Platform Modules</h2>
          <p>Four modules designed to facilitate peer-to-peer knowledge sharing and eliminate knowledge decay</p>
        </div>

        <div className="grid-cols-3">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper red">
              <BookOpen size={24} />
            </div>
            <h3>Resource Repository</h3>
            <p>Upload and search study notes, assignments, and past end-semester papers. Fully categorized by course codes and verified by classmates.</p>
            <Link to="/resources" className="feature-link">View Notes &rarr;</Link>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper gold">
              <Briefcase size={24} />
            </div>
            <h3>Placement & Internship Hub</h3>
            <p>Read comprehensive interview reviews for top recruiters. Understand selection rounds, coding questions, and direct referral routes.</p>
            <Link to="/experiences" className="feature-link">View Journals &rarr;</Link>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper blue">
              <FolderGit size={24} />
            </div>
            <h3>Project Showcase</h3>
            <p>Inspect final year capstones and course project handovers. Browse source code, live demos, and documentation left behind by seniors.</p>
            <Link to="/projects" className="feature-link">View Projects &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Value Proposition / Zero Knowledge Decay */}
      <section className="sustainability-section glass-panel">
        <div className="sustainability-content">
          <span className="pre-title green-text">Social Sustainability & Impact</span>
          <h2>Peer-to-Peer Academic Continuity</h2>
          <p className="sustain-desc">
            When seniors graduate, their valuable study guides and interview insights often disappear. 
            KTP prevents this academic decay by preserving and organizing records forever.
          </p>
          
          <div className="impact-points">
            <div className="impact-point">
              <CheckCircle2 className="impact-icon" size={24} />
              <div>
                <h4>Zero Knowledge Leakage</h4>
                <p>Ensuring senior student directories, exam guides, and preparation timelines remain on-campus to serve the next batch.</p>
              </div>
            </div>
            <div className="impact-point">
              <CheckCircle2 className="impact-icon" size={24} />
              <div>
                <h4>Democratized Guidance</h4>
                <p>Equal access to study materials, guidance, and interview paths for all students, regardless of their social circles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }

        .hero-section {
          padding: 5rem 3rem;
          background: linear-gradient(135deg, rgba(179, 25, 66, 0.06) 0%, rgba(12, 13, 18, 0.5) 100%);
          border-color: rgba(179, 25, 66, 0.15);
          text-align: center;
          position: relative;
          overflow: hidden;
          border-radius: 24px;
        }

        .hero-glow-1 {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 50%;
          height: 80%;
          background: radial-gradient(circle, rgba(179, 25, 66, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-glow-2 {
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 50%;
          height: 80%;
          background: radial-gradient(circle, rgba(255, 183, 3, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tagline-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          padding: 0.4rem 0.85rem;
          border-radius: 30px;
          margin-bottom: 2rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .hero-title {
          font-size: 2.75rem;
          line-height: 1.25;
          margin-bottom: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          text-align: center;
        }

        .hero-title span {
          background: linear-gradient(90deg, var(--text-primary) 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          max-width: 820px;
          margin: 0 auto 2.5rem auto;
          color: var(--text-secondary);
          font-size: 1.15rem;
          line-height: 1.65;
          text-align: center;
        }

        /* Hero Search Bar styles */
        .hero-search-form {
          width: 100%;
          max-width: 620px;
          margin-bottom: 2.5rem;
        }

        .hero-search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          border-radius: 50px;
          padding: 4px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          backdrop-filter: blur(12px);
          transition: var(--transition-smooth);
        }

        .hero-search-input-wrapper:focus-within {
          border-color: rgba(179, 25, 66, 0.4);
          box-shadow: 0 8px 32px 0 rgba(179, 25, 66, 0.15);
        }

        .hero-search-icon {
          position: absolute;
          left: 20px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .hero-search-field {
          width: 100%;
          height: 48px;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1rem;
          padding-left: 3.25rem;
          padding-right: 7.5rem;
          outline: none;
        }

        .hero-search-field::placeholder {
          color: var(--text-muted);
        }

        .hero-search-btn {
          position: absolute;
          right: 6px;
          height: calc(100% - 12px);
          padding: 0 1.5rem;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .hero-cta-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .primary-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .secondary-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .btn-link-sec {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .btn-link-sec:hover {
          color: var(--color-amrita-red-light);
        }

        .cta-divider {
          color: rgba(255, 255, 255, 0.15);
        }

        /* Top Shortcuts Styles */
        .shortcuts-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 900px;
        }

        .shortcuts-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          font-weight: 700;
        }

        .shortcuts-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }

        .shortcut-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.15rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .shortcut-btn:hover {
          transform: translateY(-2px);
          color: var(--text-primary);
          border-color: var(--border-glass-focused);
          background: rgba(255, 255, 255, 0.05);
        }

        /* Centered Headers */
        .section-header-centered {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3rem auto;
        }

        .pre-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-amrita-red-light);
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: block;
        }

        .pre-title.green-text {
          color: var(--color-success);
        }

        .section-header-centered h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .section-header-centered p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        /* FAQ Question Grid */
        .faq-grid-section {
          padding: 1rem 0;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .faq-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: var(--transition-smooth);
          height: 100%;
        }

        .faq-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-glass-focused);
        }

        .faq-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
        }

        .q-icon.blue { color: var(--color-info); }
        .q-icon.red { color: var(--color-amrita-red-light); }
        .q-icon.gold { color: var(--color-gold); }
        .q-icon.green { color: var(--color-success); }

        .faq-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
        }

        .faq-question {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .faq-answer {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }

        /* Metrics grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .metric-icon {
          color: var(--color-amrita-red-light);
          width: 24px;
          height: 24px;
        }

        .metric-count {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Features Section */
        .features-section {
          padding: 1rem 0;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 2rem;
          text-align: left;
        }

        .feature-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 12px;
        }

        .feature-icon-wrapper.red {
          background: rgba(179, 25, 66, 0.12);
          color: var(--color-amrita-red-light);
        }

        .feature-icon-wrapper.gold {
          background: rgba(255, 183, 3, 0.12);
          color: var(--color-gold);
        }

        .feature-icon-wrapper.blue {
          background: rgba(59, 130, 246, 0.12);
          color: var(--color-info);
        }

        .feature-card h3 {
          font-size: 1.35rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.55;
          flex: 1;
        }

        .feature-link {
          color: var(--color-amrita-red-light);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .feature-link:hover {
          text-decoration: underline;
        }

        /* Sustainability Section */
        .sustainability-section {
          padding: 4rem;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(12, 13, 18, 0.5) 100%);
          border-color: rgba(16, 185, 129, 0.15);
          border-radius: 20px;
        }

        .sustainability-content h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .sustain-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 800px;
          margin-bottom: 2.5rem;
        }

        .impact-points {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .impact-point {
          display: flex;
          gap: 1.25rem;
        }

        .impact-icon {
          color: var(--color-success);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .impact-point h4 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .impact-point p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        @media (max-width: 992px) {
          .sustainability-section {
            padding: 3rem 2rem;
          }
          .impact-points {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .home-container {
            gap: 3rem;
            padding: 2rem 1rem;
          }
          .hero-section {
            padding: 4rem 1.5rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 2rem;
          }
          .primary-ctas {
            flex-direction: column;
            width: 100%;
          }
          .primary-ctas .btn {
            width: 100%;
          }
          .hero-search-field {
            padding-right: 6.5rem;
          }
          .hero-search-btn {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
