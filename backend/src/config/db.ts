import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI fehlt in der .env Datei');
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB verbunden');
  } catch (error) {
    console.error('MongoDB-Verbindung fehlgeschlagen:', error);
    process.exit(1);
  }
}
