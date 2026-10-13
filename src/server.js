import 'dotenv/config';
import 'express-async-errors';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

try {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Copy .env.example to .env and configure it.');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  app.listen(PORT, () => console.log(`Hotel Booking API listening on port ${PORT}`));
} catch (error) {
  console.error('Startup failed:', error.message);
  process.exit(1);
}
