import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';

try {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing.');
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'admin@example.com';
  let admin = await User.findOne({ email });
  if (!admin) admin = await User.create({ name: 'Demo Admin', email, password: 'ChangeMe123!', role: 'admin' });
  let hotel = await Hotel.findOne({ name: 'Demo Grand Hotel' });
  if (!hotel) hotel = await Hotel.create({
    name: 'Demo Grand Hotel',
    description: 'A sample hotel record for testing the booking API.',
    address: '123 Main Street', city: 'Mumbai', country: 'India',
    amenities: ['Wi-Fi', 'Pool', 'Restaurant'], images: [],
    createdBy: admin._id
  });
  if (!(await Room.exists({ hotel: hotel._id }))) await Room.create([
    { hotel: hotel._id, name: 'Deluxe Double', type: 'deluxe', description: 'Comfortable double room.', pricePerNight: 4500, capacity: 2, quantity: 5, amenities: ['Wi-Fi', 'Air conditioning'] },
    { hotel: hotel._id, name: 'Family Suite', type: 'family', description: 'Spacious suite for families.', pricePerNight: 7500, capacity: 4, quantity: 2, amenities: ['Wi-Fi', 'Air conditioning', 'Breakfast'] }
  ]);
  console.log('Seed complete. Demo admin: admin@example.com / ChangeMe123! Change this password before any public deployment.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
