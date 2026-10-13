import { Router } from 'express';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseStay } from '../utils/dates.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { hotel, type, minPrice, maxPrice, capacity, checkIn, checkOut, guests = 1 } = req.query;
  const filter = {};
  if (hotel) filter.hotel = hotel;
  if (type) filter.type = type;
  if (capacity) filter.capacity = { $gte: Number(capacity) };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerNight = {};
    if (minPrice !== undefined) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.pricePerNight.$lte = Number(maxPrice);
  }
  let rooms = await Room.find(filter).populate('hotel', 'name city country address');
  if (checkIn || checkOut) {
    const stay = parseStay(checkIn, checkOut);
    const guestCount = Math.max(1, Number(guests) || 1);
    rooms = rooms.filter(room => room.capacity >= guestCount);
    const roomIds = rooms.map(r => r._id);
    const overlaps = await Booking.find({
      room: { $in: roomIds }, status: 'confirmed',
      checkIn: { $lt: stay.checkOut }, checkOut: { $gt: stay.checkIn }
    }).select('room roomsBooked');
    const bookedCounts = new Map();
    for (const booking of overlaps) bookedCounts.set(String(booking.room), (bookedCounts.get(String(booking.room)) || 0) + booking.roomsBooked);
    rooms = rooms.filter(room => room.quantity - (bookedCounts.get(String(room._id)) || 0) > 0);
  }
  res.json({ rooms });
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { hotel, name, pricePerNight, capacity } = req.body;
  if (!hotel || !name || pricePerNight === undefined || capacity === undefined) return res.status(400).json({ message: 'hotel, name, pricePerNight and capacity are required.' });
  if (!(await Hotel.exists({ _id: hotel }))) return res.status(404).json({ message: 'Hotel not found.' });
  const room = await Room.create(req.body);
  res.status(201).json({ room });
}));

router.patch('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const allowed = ['name', 'description', 'type', 'pricePerNight', 'capacity', 'quantity', 'amenities', 'images'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  res.json({ room });
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  res.json({ message: 'Room deleted.' });
}));

export default router;
