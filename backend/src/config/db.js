const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('--------------------------------------------------');
    console.log('🚀 [Database] Running in MOCK DATABASE mode.');
    console.log('🚀 Data will persist in-memory during server runtime.');
    console.log('--------------------------------------------------');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amrita_ktp');
    console.log(`🚀 [Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [Database] Connection Error: ${error.message}`);
    console.log('🔄 Falling back to MOCK DATABASE mode...');
    process.env.USE_MOCK_DB = 'true';
    return null;
  }
};

module.exports = connectDB;
