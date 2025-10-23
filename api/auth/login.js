import mongoose from 'mongoose';
import User from '../../server/models/User.js';

// Ensure DB connection
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
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await connectDB();

  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    // Find existing user or create new one
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
    } else {
      user.name = name;
    }

    // Generate session
    const sessionId = user.generateSession();
    await user.save();

    res.json({
      success: true,
      message: user.isNew ? 'User registered successfully' : 'Logged in successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        sessionId: sessionId
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
}
