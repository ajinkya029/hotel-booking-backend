import { Router } from 'express';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { city, q, minRating, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(`^${String(city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  if (minRating !== undefined) filter.rating = { $gte: Number(minRating) };
  if (q) filter.$text = { $search: String(q) };
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const [hotels, total] = await Promise.all([
    Hotel.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSize).limit(pageSize),
    Hotel.countDocuments(filter)
  ]);
  res.json({ hotels, pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });
  const rooms = await Room.find({ hotel: hotel._id });
  res.json({ hotel, rooms });
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, description, address, city, country } = req.body;
  if (!name || !description || !address || !city || !country) return res.status(400).json({ message: 'name, description, address, city and country are required.' });
  const hotel = await Hotel.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ hotel });
}));

router.patch('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const allowed = ['name', 'description', 'address', 'city', 'country', 'amenities', 'images', 'rating'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });
  res.json({ hotel });
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });
  await Room.deleteMany({ hotel: hotel._id });
  res.json({ message: 'Hotel and its rooms deleted.' });
}));

export default router;
