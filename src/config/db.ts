import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 