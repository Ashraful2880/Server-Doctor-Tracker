import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

