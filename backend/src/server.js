require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routers
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const commentRoutes = require('./routes/commentRoutes');
const guidanceRoutes = require('./routes/guidanceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Establish Database Connection (Mongoose or Mock)
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/guidance', guidanceRoutes);
app.use('/api/admin', adminRoutes);

// Base route / health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to the Amrita Student Knowledge Sharing Platform API',
    databaseMode: process.env.USE_MOCK_DB === 'true' ? 'MOCK DATABASE (In-Memory)' : 'MONGODB ATLAS',
    timestamp: new Date()
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({
    message: 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 [API Base] URL: http://localhost:${PORT}/`);
});
