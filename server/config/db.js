import mongoose from 'mongoose';
import { getMongoUri } from './env.js';

export const connectDB = async () => {
  const uri = getMongoUri();

  if (!uri || typeof uri !== 'string') {
    console.error(
      'MongoDB connection error: MONGODB_URI is missing. Add it in Railway → Variables.'
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
