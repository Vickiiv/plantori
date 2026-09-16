import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB verbunden');
  } catch (error) {
    console.error('MongoDB-Verbindung fehlgeschlagen:', error);
    process.exit(1);
  }
}
