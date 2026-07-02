import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    food: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    instructions: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
