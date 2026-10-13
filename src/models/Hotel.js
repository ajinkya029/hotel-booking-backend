import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 3000 },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true, index: true },
  country: { type: String, required: true, trim: true },
  amenities: [{ type: String, trim: true }],
  images: [{ type: String, trim: true }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

hotelSchema.index({ name: 'text', description: 'text', city: 'text', country: 'text' });
export default mongoose.model('Hotel', hotelSchema);
