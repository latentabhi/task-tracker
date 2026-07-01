const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tasktracker');
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Database connection failed: ${error.message}`);
    console.warn('Using in-memory fallback storage.');
  }
};

module.exports = connectDB;
