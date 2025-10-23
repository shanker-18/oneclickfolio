import mongoose from 'mongoose';
import app from '../server/index.js';

// Ensure DB connection before handling requests
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected in serverless');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};

export default async (req, res) => {
  await connectDB();
  return app(req, res);
};
