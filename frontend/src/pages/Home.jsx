import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Briefcase, FolderGit, ArrowRight, Shield, Globe, Award } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const metrics = [
    { label: 'Resources Shared', count: '250+', icon: <BookOpen className="metric-icon" /> },
    { label: 'Career Reviews', count: '80+', icon: <Briefcase className="metric-icon" /> },
    { label: 'Projects Uploaded', count: '40+', icon: <FolderGit className="metric-icon" /> }
  ];

  return (
    <div className="home-container animate-fade">
      {/* Hero Section */}
      <header className="hero-section glass-panel">
        <div className="hero-content">
          <div className="tagline-badge">
            <span className="badge badge-red">Amrita University</span>
            <span>SSR Project Pillar: Education</span>
          </div>
          <h1 className="hero-title">
            Stop Re-inventing the Wheel.<br />
            <span>Share & Inherit Knowledge.</span>
          </h1>
          <p className="hero-subtitle">
            A sustainable knowledge repository built by students, for students. Find course resources, past exam papers, real placement reviews, and get mentored by seniors and alumni.
          </p>
          <div className="hero-cta">
            {user ? (
              <div className="cta-wrapper">
                <Link to="/resources" className="btn btn-primary">
                  Explore Resource Repository <ArrowRight size={16} />
                </Link>
                <Link to="/experiences" className="btn btn-secondary">
                  Read Placement Experiences
                </Link>
              </div>
            ) : (
              <div className="cta-wrapper">
                <Link to="/register" className="btn btn-primary">
                  Get Started (Amrita Email) <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Student Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

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
        <h2 className="section-title">Platform Ecosystem</h2>
        <p className="section-subtitle">Grouped into 4 core modules designed to facilitate peer-to-peer knowledge transfer</p>

        <div className="grid-cols-3">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper red">
              <BookOpen size={24} />
            </div>
            <h3>Resource Repository</h3>
            <p>Upload and search notes, assignments, and past end-semester papers. Categorized by course code and rated by students.</p>
            {user && <Link to="/resources" className="feature-link">View Notes &rarr;</Link>}
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper gold">
              <Briefcase size={24} />
            </div>
            <h3>Placement & Internship Hub</h3>
            <p>Read detailed interview logs for companies like Amazon, Orion, and TCS. Understand recruitment stages and prep tips.</p>
            {user && <Link to="/experiences" className="feature-link">View Reviews &rarr;</Link>}
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper blue">
              <FolderGit size={24} />
            </div>
            <h3>Project Showcase</h3>
            <p>Explore capstone and course projects uploaded by seniors. Find GitHub links, demo URLs, and team collaboration setups.</p>
            {user && <Link to="/projects" className="feature-link">View Projects &rarr;</Link>}
          </div>


        </div>
      </section>

      {/* Social Impact / Sustainability */}
      <section className="sustainability-section glass-panel">
        <div className="sustainability-content">
          <h2>Social Sustainability & Impact</h2>
          <div className="impact-points">
            <div className="impact-point">
              <Shield className="impact-icon" />
              <div>
                <h4>Zero Knowledge Decay</h4>
                <p>Every graduate leaves their preparation tips and study folders behind, ensuring juniors start with strong momentum.</p>
              </div>
            </div>
            <div className="impact-point">
              <Globe className="impact-icon" />
              <div>
                <h4>Democratized Guidance</h4>
                <p>Equal access to study materials and referral pathways for first-generation students and juniors without senior contacts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .hero-section {
          padding: 4rem 3rem;
          background: linear-gradient(135deg, rgba(179, 25, 66, 0.08) 0%, rgba(12, 13, 18, 0.5) 100%);
          border-color: rgba(179, 25, 66, 0.15);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .tagline-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          padding: 0.35rem 0.75rem;
          border-radius: 30px;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }

        .hero-title {
          font-size: 3rem;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          font-weight: 800;
        }

        .hero-title span {
          background: linear-gradient(90deg, #ffb703 0%, #ff8500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          max-width: 780px;
          margin: 0 auto 2.25rem auto;
          color: var(--text-secondary);
          font-size: 1.15rem;
          line-height: 1.6;
        }

        .cta-wrapper {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

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
          padding: 1.75rem;
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
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .features-section {
          padding: 2rem 0;
        }

        .section-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 3rem;
          font-size: 1rem;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
        }

        .feature-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          margin-bottom: 0.5rem;
        }

        .feature-icon-wrapper.red {
          background: rgba(179, 25, 66, 0.15);
          color: var(--color-amrita-red-light);
        }

        .feature-icon-wrapper.gold {
          background: rgba(255, 183, 3, 0.15);
          color: var(--color-gold);
        }

        .feature-icon-wrapper.blue {
          background: rgba(59, 130, 246, 0.15);
          color: var(--color-info);
        }

        .feature-icon-wrapper.green {
          background: rgba(16, 185, 129, 0.15);
          color: var(--color-success);
        }

        .feature-card h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          flex: 1;
        }

        .feature-link {
          color: var(--color-amrita-red-light);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .feature-link:hover {
          text-decoration: underline;
        }

        .sustainability-section {
          padding: 3rem;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(12, 13, 18, 0.5) 100%);
          border-color: rgba(16, 185, 129, 0.15);
        }

        .sustainability-content h2 {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .impact-points {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .impact-point {
          display: flex;
          gap: 1rem;
        }

        .impact-icon {
          color: var(--color-success);
          flex-shrink: 0;
          width: 28px;
          height: 28px;
        }

        .impact-point h4 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .impact-point p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 2.5rem 1.5rem;
          }
          .hero-title {
            font-size: 2.25rem;
          }
          .impact-points {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
