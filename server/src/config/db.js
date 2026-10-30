const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management_system';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected successfully.');
    return { connected: true, uri: mongoUri };
  } catch (error) {
    console.warn('MongoDB unavailable, running in demo mode:', error.message);
    return { connected: false, uri: mongoUri, error: error.message };
  }
};

module.exports = { connectDatabase };
