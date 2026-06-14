import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Experiences from './pages/Experiences';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Guidance from './pages/Guidance';

// Protected Route Gating Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Authenticating Session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Student Ecosystem Routes */}
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/experiences" 
                element={
                  <ProtectedRoute>
                    <Experiences />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/guidance" 
                element={
                  <ProtectedRoute>
                    <Guidance />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback route redirection */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>

      <style>{`
        .loading-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          font-family: var(--font-heading);
          color: var(--text-secondary);
          font-size: 1.2rem;
        }
      `}</style>
    </AuthProvider>
  );
};

export default App;
