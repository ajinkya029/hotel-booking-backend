import { Router } from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseStay } from '../utils/dates.js';

const router = Router();
router.use(protect);

router.post('/', asyncHandler(async (req, res) => {
  const { room: roomId, checkIn: checkInValue, checkOut: checkOutValue, guests = 1, roomsBooked = 1 } = req.body;
  if (!roomId) return res.status(400).json({ message: 'room is required.' });
  const stay = parseStay(checkInValue, checkOutValue);
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  const guestCount = Number(guests);
  const roomCount = Number(roomsBooked);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > room.capacity * roomCount) return res.status(400).json({ message: 'Guest count exceeds room capacity or is invalid.' });
  if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > room.quantity) return res.status(400).json({ message: 'Invalid roomsBooked value.' });

  const overlapping = await Booking.find({
    room: room._id, status: 'confirmed',
    checkIn: { $lt: stay.checkOut }, checkOut: { $gt: stay.checkIn }
  });
  const alreadyBooked = overlapping.reduce((sum, b) => sum + b.roomsBooked, 0);
  if (alreadyBooked + roomCount > room.quantity) return res.status(409).json({ message: 'Not enough rooms available for those dates.' });

  const hotel = await Hotel.findById(room.hotel);
  const booking = await Booking.create({
    user: req.user._id, hotel: room.hotel, room: room._id,
    checkIn: stay.checkIn, checkOut: stay.checkOut, guests: guestCount,
    roomsBooked: roomCount, totalPrice: room.pricePerNight * stay.nights * roomCount
  });
  res.status(201).json({ booking, hotel: hotel ? { id: hotel._id, name: hotel.name } : null, room: { id: room._id, name: room.name } });
}));

router.get('/my', asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('hotel', 'name city country images').populate('room', 'name type pricePerNight').sort({ createdAt: -1 });
  res.json({ bookings });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('hotel').populate('room').populate('user', 'name email');
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  if (String(booking.user._id) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot view this booking.' });
  res.json({ booking });
}));

router.patch('/:id/cancel', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot cancel this booking.' });
  if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled.' });
  if (booking.checkIn <= new Date()) return res.status(400).json({ message: 'Bookings cannot be cancelled after check-in has started.' });
  booking.status = 'cancelled';
  await booking.save();
  res.json({ message: 'Booking cancelled.', booking });
}));

router.get('/admin/all', adminOnly, asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate('user', 'name email').populate('hotel', 'name city').populate('room', 'name type').sort({ createdAt: -1 });
  res.json({ bookings });
}));

export default router;
