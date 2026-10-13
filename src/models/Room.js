import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['single', 'double', 'twin', 'suite', 'family', 'deluxe'], default: 'double' },
  pricePerNight: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1, max: 20 },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  amenities: [{ type: String }],
  images: [{ type: String }]
}, { timestamps: true });

roomSchema.index({ hotel: 1, pricePerNight: 1 });
export default mongoose.model('Room', roomSchema);
